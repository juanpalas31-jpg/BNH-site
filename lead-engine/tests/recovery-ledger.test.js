import test from "node:test";
import assert from "node:assert/strict";
import {RecoveryLedger,OPERATION_STATES} from "../resilience/recovery-ledger.js";

test("crash then restart recovery produces exactly one completed operation",async()=>{
 const ledger=new RecoveryLedger();
 const record={lead_id:"L-CRASH-1",tenant_id:"bnh",project_id:"bnh-site",record_type:"lead"};
 let calls=0;
 const first=await ledger.process(record,async()=>{calls++;throw new Error("crash");});
 assert.equal(first.state,OPERATION_STATES.FAILED);
 const recovered=await ledger.recover(async()=>{calls++;return {opportunity_id:"O-1"};});
 assert.equal(recovered.length,1);
 assert.equal(recovered[0].state,OPERATION_STATES.COMPLETED);
 const duplicate=await ledger.process(record,async()=>{calls++;return {opportunity_id:"O-2"};});
 assert.equal(duplicate.duplicate,true);
 assert.equal(calls,2);
 assert.equal(ledger.canClose(),true);
});

test("unrecoverable operation is quarantined instead of silently deleted",async()=>{
 const ledger=new RecoveryLedger();
 const record={event_id:"E-BAD-1",tenant_id:"bnh",project_id:"bnh-site",record_type:"event"};
 await ledger.process(record,async()=>{throw new Error("down");});
 await ledger.recover(async()=>{throw new Error("down");},{maxAttempts:2});
 await ledger.recover(async()=>({ok:true}),{maxAttempts:2});
 const op=ledger.operations.get("event:E-BAD-1");
 assert.equal(op.state,OPERATION_STATES.QUARANTINED);
 assert.equal(ledger.deadLetter.length,1);
 assert.equal(ledger.canClose(),true);
});
