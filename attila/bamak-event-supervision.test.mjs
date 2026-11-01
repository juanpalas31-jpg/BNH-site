import assert from "node:assert/strict";
import {runBamakSupervisionCycle} from "./bamak-event-supervision.mjs";
let reads=0,commands=0,evidence=0;
const adapter={
 async getStatus(id){reads++;return {reachable:id==="a",state:"READY"};},
 async sendCommand(){commands++;throw Error("FORBIDDEN");}
};
const denied=await runBamakSupervisionCycle({adapter,boothIds:["a"],authorized:false});
assert.equal(denied.status,"AUTHORIZATION_REQUIRED");
assert.equal(reads,0);
const reports=[];
const ok=await runBamakSupervisionCycle({
 adapter,boothIds:["a","b"],authorized:true,
 evidenceSink:async report=>{evidence++;reports.push(report);}
});
assert.equal(ok.status,"SUPERVISION_COMPLETE");
assert.equal(ok.health,"DEGRADED");
assert.deepEqual(ok.summary,{total:2,reachable:1,unreachable:1});
assert.equal(ok.alerts.length,1);
assert.equal(ok.requiresHumanReview,true);
assert.equal(ok.commandsSent,0);
assert.equal(commands,0);
assert.equal(reads,2);
assert.equal(evidence,1);
assert.deepEqual(reports[0],ok);
const failed=await runBamakSupervisionCycle({
 adapter,boothIds:["a"],authorized:true,evidenceSink:async()=>{throw Error("NO_STORAGE");}
});
assert.equal(failed.status,"EVIDENCE_SINK_FAILED");
assert.equal(commands,0);
console.log("Bamak Event supervision cycle tests OK");
