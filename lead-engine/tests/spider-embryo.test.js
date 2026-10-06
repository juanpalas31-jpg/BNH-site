import assert from "node:assert/strict";
import test from "node:test";
import { validateEmbryo } from "../eggs/embryo-validator.js";

const required=["ancestral_genome","dna_manifest","instincts","behavioral_states","organ_registry","reconstruction_plan","integrity","lineage"];
const manifest={required_components:required.map(id=>({id})),invariants:["portable"]};

test("complete embryo is reconstructible",()=>{
 const r=validateEmbryo(manifest,required);
 assert.equal(r.schema_valid,true);
 assert.equal(r.payload_complete,true);
 assert.equal(r.reconstructible,true);
 assert.equal(r.automatic_execution,false);
});

test("missing organ blocks reconstruction readiness",()=>{
 const r=validateEmbryo(manifest,required.filter(x=>x!=="lineage"));
 assert.equal(r.reconstructible,false);
 assert.deepEqual(r.payload_missing,["lineage"]);
});
