// Attila execution bridge: turns coded organs into one executable, evidence-first cycle.
// External source readers/executors remain injected so the runtime cannot invent access.
import {runFinisherPreflight,executeFinisher} from "./mini-tila-finisher.mjs";
import {finisherAssignments} from "./finisher-registry.mjs";

export async function runFinisherFleet({connectorsByProject={},statesByProject={},executorByProject={},evidenceSink=async()=>{}}={}){
 const report=[];
 for(const assignment of finisherAssignments()){
  const id=assignment.project.id;
  try{
   const preflight=await runFinisherPreflight({
    project:assignment.project,
    adapters:connectorsByProject[id]||{},
    currentState:statesByProject[id]||{}
   });
   if(!preflight.ready){
    const item={project:id,status:"CONTEXT_INCOMPLETE",confidence:preflight.intent.confidence,next:preflight.next,productionPublished:false};
    await evidenceSink(item); report.push(item);
    continue;
   }
   const result=await executeFinisher({preflight,executor:executorByProject[id]});
   const item={project:id,status:result.status,evidence:result.evidence??null,productionPublished:false};
   await evidenceSink(item); report.push(item);
  }catch(error){
   const item={project:id,status:"BLOCKED",error:String(error?.message||error),productionPublished:false};
   report.push(item);
   try{await evidenceSink(item)}catch{}
  }
 }
 return Object.freeze({worker:"ATTILA_FINISHER_FLEET",executedAt:new Date().toISOString(),report});
}
