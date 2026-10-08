// Attila Cognitive Runtime — bounded autonomous work cycles with live status hooks.
export const ATTILA_RUNTIME_POLICY=Object.freeze({mode:"BOUNDED_AUTONOMY",maxCycleMs:20*60*1000,maxTasksPerCycle:12,protectedIntents:["LIVE_TRADE","ASSET_TRANSFER","PUBLISH","EXTERNAL_SEND","DELETE","LEGAL_COMMITMENT"],requireHumanApprovalForProtectedIntent:true,evidenceRequired:true,fabricatedResultsAllowed:false});
export const WEBS=Object.freeze({SALTICIDAE:{role:"SCOUT",behavior:"observe-rank-focus"},ORB_WEAVER:{role:"SYSTEM",behavior:"connect-measure-repair"},BOLAS:{role:"TARGET",behavior:"selective-attraction"},TRAPDOOR:{role:"WATCH",behavior:"wait-trigger-escalate"},SOCIAL_SPIDER:{role:"COORDINATE",behavior:"share-tools-isolate-data"}});
export function scoreTask(t={}){return (Number(t.impact)||0)*.4+(Number(t.confidence)||0)*.25+(Number(t.urgency)||0)*.25-(Number(t.cost)||0)*.1}
export function isProtected(t={}){return ATTILA_RUNTIME_POLICY.protectedIntents.includes(String(t.intent||"").toUpperCase())}
export function planCycle(tasks=[]){return tasks.map(t=>({...t,score:scoreTask(t),protected:isProtected(t)})).sort((a,b)=>b.score-a.score).slice(0,ATTILA_RUNTIME_POLICY.maxTasksPerCycle)}
export async function runAttilaCycle({tasks=[],executors={},statusStore=null,now=()=>Date.now()}={}){
 const started=now(),log=[];
 for(const task of planCycle(tasks)){
  if(now()-started>ATTILA_RUNTIME_POLICY.maxCycleMs){log.push({id:task.id,status:"TIMEBOX_END"});break}
  if(task.protected){await statusStore?.waitingApproval(task);log.push({id:task.id,status:"AWAITING_HUMAN_APPROVAL",intent:task.intent});continue}
  const exec=executors[task.type];if(typeof exec!=="function"){log.push({id:task.id,status:"NO_EXECUTOR"});continue}
  try{await statusStore?.start(task);const result=await exec(task);const proof=result?.evidence??null;if(proof)await statusStore?.evidence(proof);log.push({id:task.id,status:"EXECUTED",evidence:proof})}
  catch(e){await statusStore?.blocked(String(e?.message||e));log.push({id:task.id,status:"FAILED",error:String(e?.message||e)})}
 }
 if(!log.some(x=>x.status==="FAILED"||x.status==="AWAITING_HUMAN_APPROVAL"))await statusStore?.idle();
 return Object.freeze({startedAt:started,finishedAt:now(),log});
}