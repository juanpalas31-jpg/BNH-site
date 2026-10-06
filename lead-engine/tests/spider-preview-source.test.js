import assert from "node:assert/strict";
import test from "node:test";
import { previewSession } from "../eggs/preview-spider.js";
import { createSourceAnchor, verifySourceAnchor, sourceConnection } from "../eggs/source-anchor.js";

test("guardian preview never grants ownership or secrets",()=>{
 const r=previewSession({guardian_mission_active:true,years_completed:10});
 assert.equal(r.mode,"preview");
 assert.equal(r.ownership_granted,false);
 assert.ok(r.never_show.includes("private_keys"));
});

test("misuse terminates preview without destructive action",()=>{
 const r=previewSession({guardian_mission_active:true,years_completed:9,misuse_detected:true});
 assert.equal(r.mode,"terminated");
 assert.equal(r.destructive_action,false);
});

test("source anchor detects alteration",()=>{
 const a=createSourceAnchor({lineage_id:"SPIDER-ANCESTRAL-PAYKULLIANA",founder_public_commitment:"founder-origin-v1"});
 assert.equal(verifySourceAnchor(a),true);
 assert.equal(verifySourceAnchor({...a,lineage_id:"ALTERED"}),false);
});

test("return to source requires all lineage gates",()=>{
 assert.equal(sourceConnection({anchor_valid:true,lineage_proof:true,authorized_branch:false}).connected,false);
 assert.equal(sourceConnection({anchor_valid:true,lineage_proof:true,authorized_branch:true}).connected,true);
});
