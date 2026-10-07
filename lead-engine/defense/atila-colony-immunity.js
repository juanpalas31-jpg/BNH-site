import {assessThreat,immuneResponse,learnImmuneMemory} from "../defense/atila-immune-system.js";
export function propagateImmuneSignal({colony=[],source_id,observation={},memory=[]}={}){
 const threat=assessThreat(observation,memory),response=immuneResponse(threat);
 const nextMemory=learnImmuneMemory(threat,memory);
 const signal={source_id,fingerprint:threat.fingerprint,level:threat.level,score:threat.score,
  contains_secret:false,contains_biometric:false};
 const nodes=colony.map(n=>n.id===source_id?{...n,immune_state:response.mode}:
  {...n,immune_alert:signal,privilege_escalation:false});
 return {threat,response,memory:nextMemory,signal,nodes};
}
export function colonyCircuitBreaker({nodes=[],critical_threshold=1}={}){
 const critical=nodes.filter(n=>n.immune_state==="QUARANTINE"||n.immune_alert?.level==="CRITICAL").length;
 if(critical>=critical_threshold)return {tripped:true,mode:"COLONY_SAFE_MODE",
  network:"DENY_BY_DEFAULT",writes:false,deploys:false,self_update:false,
  recovery:"OWNER_VERIFIED_MANUAL_RELEASE"};
 return {tripped:false,mode:"NORMAL"};
}
