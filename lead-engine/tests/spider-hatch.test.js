import assert from "node:assert/strict";
import test from "node:test";
import { hatchAssessment } from "../eggs/hatch-controller.js";
import { lineageRecord, verifyLineageChain } from "../eggs/lineage-ledger.js";

test("egg cannot hatch without recipient consent",()=>{
 const r=hatchAssessment({
  integrity_verified:true,lineage_verified:true,claim_started:true,claim_verified:true,
  legacy_capsule_available:true,recipient_consent:false,
  environment:{capabilities:["filesystem","cryptography","runtime","communications"]}
 });
 assert.equal(r.hatch_permitted,false);
});

test("verified consenting recipient can reach reconstruction gate",()=>{
 const r=hatchAssessment({
  integrity_verified:true,lineage_verified:true,claim_started:true,claim_verified:true,
  legacy_capsule_available:true,recipient_consent:true,
  environment:{capabilities:["filesystem","cryptography","runtime","communications"]}
 });
 assert.equal(r.hatch_permitted,true);
 assert.equal(r.automatic_execution,false);
});

test("lineage ledger detects tampering",()=>{
 const a=lineageRecord({egg_id:"G1-A",generation:1,event:"created"});
 const b=lineageRecord({egg_id:"G1-A",generation:1,event:"sealed",previous_hash:a.record_hash});
 assert.equal(verifyLineageChain([a,b]).valid,true);
 const altered={...b,event:"rewritten"};
 assert.equal(verifyLineageChain([a,altered]).valid,false);
});
