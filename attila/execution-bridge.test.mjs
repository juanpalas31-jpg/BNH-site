import assert from "node:assert/strict";
import {runFinisherFleet} from "./execution-bridge.mjs";
const mk=id=>({
 VALIDATED_DECISIONS:async()=>[{project:id,validated:true,decision:"mobile",theme:"validated-theme",reference:"https://github.com/juanpalas31-jpg/BNH-site/blob/main/README.md"},{project:id,validated:true,decision:"seo"}],
 REPOSITORY_CODE:async()=>[{project:id,validated:true,content:"code",reference:"https://github.com/juanpalas31-jpg/BNH-site/blob/main/README.md"}],
 PROJECT_FILES:async()=>[{project:id,validated:true,content:"files"}],
 TEST_EVIDENCE:async()=>[{project:id,validated:true,content:"tests",reference:"https://github.com/juanpalas31-jpg/BNH-site/blob/main/README.md"}],
 DEPLOYMENT_EVIDENCE:async()=>[{project:id,validated:true,content:"preview"}],
 CHAT_HISTORY:async()=>[{project:id,content:"prompt context"}],
 AUTHORIZED_EMAIL:async()=>[{project:id,content:"mail context"}]
});
const ids=["mon-petit-marin","mes-petites-affiches","le-bilan"];
const connectorsByProject=Object.fromEntries(ids.map(id=>[id,mk(id)]));
const statesByProject=Object.fromEntries(ids.map(id=>[id,{proven:["mobile"]}]));
const executorByProject=Object.fromEntries(ids.map(id=>[id,async task=>({evidence:{project:id,gaps:task.gaps}})]));
const out=await runFinisherFleet({connectorsByProject,statesByProject,executorByProject});
assert.equal(out.report.length,3);
assert.ok(out.report.every(x=>x.status==="FINISHER_EXECUTED"));
assert.ok(out.report.every(x=>x.productionPublished===false));
console.log("Attila execution bridge tests OK");

const blocked=await runFinisherFleet({connectorsByProject:Object.fromEntries(ids.map(id=>[id,{}])),executorByProject:Object.fromEntries(ids.map(id=>[id,async()=>{throw Error("EXECUTOR_MUST_NOT_RUN")}]))});
assert.ok(blocked.report.every(x=>x.status==="PREFLIGHT_BLOCKED"));
assert.ok(blocked.report.every(x=>x.productionPublished===false));
