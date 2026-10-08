/** Attila autonomous memory worker: deterministic task processing without Jarvis.
 * Host app must supply durable encrypted storage, auth, queue and a scheduler.
 * No direct private content is logged, stored or sent by this pure worker.
 */
import {authorizeMemoryAction,evaluateMemoryIntegrity,planMemoryRecovery} from './spider-private-memory-guard.js';
const ACTIONS=new Set(['CHECK_ACCESS','VERIFY_INTEGRITY','PLAN_RECOVERY']);
const id=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(s);
export const ATTILA_AUTONOMY=Object.freeze({agent:'ATTILA',engine:'SPIDER_ENGINE',jarvisRequired:false,
 mode:'DETERMINISTIC_WORKER',deployment:'NOT_DEPLOYED',storage:'NOT_CONNECTED',
 humanApprovalRequired:['PUBLISH','PODCAST_RELEASE','DELETE','EXPORT','ACCESS_GRANT']});
export function createMemoryWorker({workspaceId}={}){
 if(!id(workspaceId))throw Error('INVALID_WORKSPACE');
 return {workspaceId,sequence:0,processedIds:[],history:[],status:'READY_IN_MEMORY'};
}
export function runMemoryMission(worker,mission){
 if(!worker||!id(worker.workspaceId)||!mission||!id(mission.id)||!ACTIONS.has(mission.action)||mission.workspaceId!==worker.workspaceId)throw Error('INVALID_MISSION');
 if(worker.processedIds.includes(mission.id))return {worker,outcome:{id:mission.id,status:'DUPLICATE_SKIPPED'}};
 let result;
 try{
  if(mission.action==='CHECK_ACCESS')result=authorizeMemoryAction(mission.payload||{});
  else if(mission.action==='VERIFY_INTEGRITY')result=evaluateMemoryIntegrity(mission.payload||{});
  else result=planMemoryRecovery(mission.payload||{});
 }catch(_){result={allowed:false,reason:'INVALID_MISSION_PAYLOAD'};}
 const success=mission.action==='CHECK_ACCESS'?result.allowed===true:mission.action==='VERIFY_INTEGRITY'?result.verified===true:result.canRestore===true;
 const outcome={id:mission.id,action:mission.action,status:success?'POLICY_CHECK_PASSED':'REVIEW_OR_BLOCKED',
  reason:result.reason||'NO_REASON',sideEffects:false,completedAt:null};
 const next={...worker,sequence:worker.sequence+1,processedIds:[...worker.processedIds.slice(-999),mission.id],
  history:[...worker.history.slice(-199),outcome]};
 return {worker:next,outcome};
}
export function runMemoryQueue(worker,missions,{maxPerRun=25}={}){
 if(!Array.isArray(missions)||!Number.isInteger(maxPerRun)||maxPerRun<1||maxPerRun>100)throw Error('INVALID_QUEUE');
 let state=worker;const outcomes=[];
 for(const mission of missions.slice(0,maxPerRun)){const r=runMemoryMission(state,mission);state=r.worker;outcomes.push(r.outcome);}
 return {worker:state,outcomes,remaining:missions.length-outcomes.length};
}
