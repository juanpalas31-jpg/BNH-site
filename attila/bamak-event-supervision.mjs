// Bamak Event: one explicit, read-only supervision cycle. No scheduling, no device commands.
import {inspectBamakBooths} from "./bamak-event-readonly.mjs";
import {assessBamakFleet} from "./bamak-event-health.mjs";

export async function runBamakSupervisionCycle({adapter,boothIds=[],authorized=false,evidenceSink}={}){
 const inspection=await inspectBamakBooths({adapter,boothIds,authorized});
 if(inspection.status!=="READ_ONLY") return Object.freeze({
  project:"bamak-event",status:inspection.status,health:"UNKNOWN",commandsSent:0,productionChanged:false
 });
 const assessment=assessBamakFleet(inspection);
 const report=Object.freeze({
  project:"bamak-event",status:"SUPERVISION_COMPLETE",health:assessment.health,
  summary:assessment.summary,alerts:assessment.alerts,requiresHumanReview:assessment.requiresHumanReview,
  commandsSent:0,productionChanged:false
 });
 if(typeof evidenceSink==="function"){
  try{await evidenceSink(report)}catch{return Object.freeze({...report,status:"EVIDENCE_SINK_FAILED"});}
 }
 return report;
}
