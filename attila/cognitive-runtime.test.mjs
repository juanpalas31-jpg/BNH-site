import assert from "node:assert/strict";
import {planCycle,runAttilaCycle} from "./cognitive-runtime.mjs";
const tasks=[
 {id:"publish",intent:"PUBLISH",type:"x",impact:10,confidence:10,urgency:10,cost:0},
 {id:"research",intent:"RESEARCH",type:"research",impact:8,confidence:8,urgency:8,cost:1}
];
assert.equal(planCycle(tasks)[0].protected,true);
const r=await runAttilaCycle({tasks,executors:{research:async()=>({evidence:"test-proof"})}});
assert.equal(r.log.find(x=>x.id==="publish").status,"AWAITING_HUMAN_APPROVAL");
assert.equal(r.log.find(x=>x.id==="research").status,"EXECUTED");
console.log("Attila cognitive runtime tests OK");
