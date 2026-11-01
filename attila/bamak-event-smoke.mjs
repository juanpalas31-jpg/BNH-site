// Reproducible Bamak Event supervision smoke test with synthetic booths only.
// No credentials, remote server, scheduler or device commands.
import {runBamakSupervisionCycle} from "./bamak-event-supervision.mjs";
const statuses=new Map([["demo-01",{reachable:true,state:"READY"}],["demo-02",{reachable:false,state:"OFFLINE"}]]);
const adapter={async getStatus(id){return statuses.get(id)??{reachable:false,state:"UNKNOWN"};}};
const report=await runBamakSupervisionCycle({
 adapter,boothIds:[...statuses.keys()],authorized:true,
 evidenceSink:async result=>{if(result.commandsSent!==0)throw Error("UNEXPECTED_COMMAND");}
});
if(report.status!=="SUPERVISION_COMPLETE"||report.health!=="DEGRADED"||report.summary?.total!==2)
 throw Error("BAMAK_SMOKE_TEST_FAILED");
console.log(JSON.stringify({mode:"SYNTHETIC_ONLY",project:report.project,status:report.status,health:report.health,summary:report.summary,alerts:report.alerts.length,commandsSent:report.commandsSent}));
