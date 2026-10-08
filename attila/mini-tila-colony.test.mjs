import assert from "node:assert/strict";
import {delegateAcrossWebs,PROJECT_WEBS} from "./mini-tila-colony.mjs";
const assignments=[
 {project:PROJECT_WEBS.VINTED,task:{id:"v",type:"inspect",intent:"RESEARCH"}},
 {project:PROJECT_WEBS.PETITES_AFFICHES,task:{id:"a",type:"inspect",intent:"RESEARCH"}},
 {project:PROJECT_WEBS.MON_PETIT_MARIN,task:{id:"m",type:"inspect",intent:"RESEARCH"}}
];
const r=await delegateAcrossWebs(assignments,{executors:{inspect:async t=>({result:"ok",evidence:{scope:t.scope},lessons:["checked"]})}});
assert.equal(r.parallelism,3);
assert.equal(r.reports.every(x=>x.status==="COMPLETED"),true);
assert.equal(new Set(r.reports.map(x=>x.scope)).size,3);
assert.equal(r.synthesis.evidence.length,3);
const blocked=await delegateAcrossWebs([{project:PROJECT_WEBS.VINTED,task:{id:"p",type:"inspect",intent:"PUBLISH"}}],{executors:{inspect:async()=>({})}});
assert.equal(blocked.reports[0].status,"WAITING_APPROVAL");
console.log("Mini-Tila colony tests OK");
