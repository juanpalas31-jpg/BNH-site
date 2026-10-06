import test from "node:test";
import assert from "node:assert/strict";
import {PostgresStorageAdapter} from "../storage/postgres-adapter.js";
import {dualWrite} from "../storage/adapter.js";
import {assertMigrationTransition,MIGRATION_STATES} from "../storage/migration-state.js";

function fakeQuery(){
 const leads=new Set(),events=new Set();
 return async (sql,p)=>{
  if(sql.includes("INSERT INTO leads")) leads.add(p[0]);
  if(sql.includes("INSERT INTO events")) events.add(p[0]);
  if(sql.includes("SELECT 1")) return {rows:[{ok:1}]};
  return {rows:[],leadCount:leads.size,eventCount:events.size};
 };
}

test("durable adapter uses conflict-safe lead/event writes",async()=>{
 const calls=[]; const query=async(sql,p)=>{calls.push([sql,p]);return {rows:[]};};
 const db=new PostgresStorageAdapter({query});
 await db.saveLead({lead_id:"L1",tenant_id:"bnh",project_id:"bnh-site",received_at:"2026-10-07T00:00:00Z"});
 await db.saveEvent({event_id:"E1",tenant_id:"bnh",project_id:"bnh-site",received_at:"2026-10-07T00:00:00Z"});
 assert.match(calls[0][0],/ON CONFLICT \(lead_id\) DO NOTHING/);
 assert.match(calls[1][0],/ON CONFLICT \(event_id\) DO NOTHING/);
});

test("mirror failure cannot invalidate primary write",async()=>{
 const primary={saveLead:async()=>({ok:true,id:"L1"})};
 const mirror={saveLead:async()=>{throw new Error("mirror down");}};
 const r=await dualWrite({primary,mirror,kind:"lead",record:{lead_id:"L1"}});
 assert.equal(r.ok,true);
 assert.equal(r.primary.id,"L1");
 assert.equal(r.mirror_error,"mirror down");
});

test("unsafe promotion to new primary is blocked",()=>{
 assert.throws(()=>assertMigrationTransition(MIGRATION_STATES.SHADOW_WRITE,MIGRATION_STATES.NEW_PRIMARY,{
  primary_healthcheck:true,shadow_counts_match:false,sample_integrity_verified:true
 }),/Shadow record-count verification required/);
});

test("verified promotion to new primary is allowed",()=>{
 const r=assertMigrationTransition(MIGRATION_STATES.SHADOW_WRITE,MIGRATION_STATES.NEW_PRIMARY,{
  primary_healthcheck:true,shadow_counts_match:true,sample_integrity_verified:true
 });
 assert.equal(r.ok,true);
});
