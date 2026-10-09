import assert from "node:assert/strict";
import {runFinisherPreflight,executeFinisher} from "./mini-tila-finisher.mjs";
const adapters={
 VALIDATED_DECISIONS:async p=>[
  {project:p.id,validated:true,decision:"mobile-ready",theme:"marine"},
  {project:p.id,validated:true,decision:"seo-ready"}
 ],
 REPOSITORY_CODE:async p=>[{project:p.id,validated:true,content:"repo snapshot"}],
 TEST_EVIDENCE:async p=>[{project:p.id,validated:true,content:"tests"}],
 DEPLOYMENT_EVIDENCE:async p=>[{project:p.id,validated:true,content:"preview"}],
 CHAT_HISTORY:async p=>[{project:p.id,validated:false,content:"historical prompt"}],
 AUTHORIZED_EMAIL:async p=>[{project:p.id,validated:false,content:"mail context",token:"must-redact"}]
};
const pf=await runFinisherPreflight({project:{id:"mon-petit-marin"},adapters,currentState:{proven:["mobile-ready"]}});
assert.equal(pf.ready,true);assert.deepEqual(pf.audit.gaps,["seo-ready"]);
assert.equal(pf.memory.sources.find(x=>x.kind==="AUTHORIZED_EMAIL").token,"[REDACTED]");
let received=null;
const out=await executeFinisher({preflight:pf,executor:async x=>(received=x,{evidence:{test:"ok"}})});
assert.equal(out.status,"FINISHER_EXECUTED");assert.equal(out.productionPublished,false);
assert.equal(received.theme,"marine");
await assert.rejects(()=>executeFinisher({preflight:{ready:false}}),/PREFLIGHT/);
console.log("Mini-Tila Finisher PRE-FLIGHT tests OK");
