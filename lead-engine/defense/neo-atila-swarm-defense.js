import {createHash,randomUUID} from "node:crypto";
const H=v=>createHash("sha256").update(String(v)).digest("hex");
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));

export const FIGHTER_TRAIT=Object.freeze({
 courage:.92, persistence:.95, composure:.88, tactical_patience:.91,
 intimidation_bias:0, revenge_bias:0, protect_host:1,
 doctrine:"SURROUND_ANALYZE_CONTAIN"
});

export function classifyMinorAttack(signal={}){
 const severity=clamp(signal.severity),scope=clamp(signal.scope),confidence=clamp(signal.confidence);
 const score=clamp(.45*severity+.30*scope+.25*confidence);
 return {score,minor:score>0&&score<.55,major:score>=.55};
}

export function spawnReplicantSwarm({signal={},max=12}={}){
 const classification=classifyMinorAttack(signal);
 if(!classification.minor)return {spawned:false,reason:classification.major?"ESCALATE_TO_IMMUNE_SYSTEM":"NO_THREAT",replicants:[]};
 const count=Math.max(3,Math.min(max,Math.ceil(3+classification.score*12)));
 const fingerprint=H(JSON.stringify({type:signal.type,source:signal.source,pattern:signal.pattern}));
 const roles=["OBSERVER","PATTERN_ANALYST","DECOY","INTEGRITY_CHECKER","POLICY_CHECKER","CONTAINMENT_PLANNER"];
 const replicants=Array.from({length:count},(_,i)=>({
  id:"NEO-ATILA-"+randomUUID(),ephemeral:true,role:roles[i%roles.length],
  target_fingerprint:fingerprint,external_attack_allowed:false,
  privileges:"SANDBOX_READ_ONLY",ttl_cycles:3
 }));
 return {spawned:true,count,fingerprint,replicants,doctrine:FIGHTER_TRAIT.doctrine};
}

export function surroundThreat({replicants=[],signal={}}={}){
 const views=replicants.map((r,i)=>({replicant_id:r.id,role:r.role,
  observation_slot:i,confidence:clamp((signal.confidence||.5)+(i%3)*.03)}));
 return {formation:"LOGICAL_ENCIRCLEMENT",views,
  boundary:"OWN_SYSTEM_ONLY",outbound_retaliation:false};
}

export function tacticalResponses({signal={},formation={}}={}){
 const plans=[
  {name:"ISOLATE",score:.92,actions:["QUARANTINE_SESSION","DENY_WRITE","PRESERVE_LOGS"]},
  {name:"STARVE",score:.86,actions:["REVOKE_TOKEN","DROP_UNTRUSTED_INPUT","RATE_LIMIT"]},
  {name:"DECOY",score:.72,actions:["ROUTE_TO_SANDBOX","OBSERVE_PATTERN","NO_SECRET_ACCESS"]},
  {name:"RESET",score:.68,actions:["INVALIDATE_SESSION","FRESH_CHALLENGE","VERIFY_INTEGRITY"]}
 ];
 return plans.sort((a,b)=>b.score-a.score).slice(0,4);
}

export function consumeMinorThreat({signal={},max=12}={}){
 const swarm=spawnReplicantSwarm({signal,max});
 if(!swarm.spawned)return {...swarm,consumed:false};
 const formation=surroundThreat({replicants:swarm.replicants,signal});
 const strategies=tacticalResponses({signal,formation});
 return {...swarm,formation,strategies,selected:strategies[0],
  consumed:true,meaning:"CONTAINED_OR_INVALIDATED_INSIDE_OWN_BOUNDARY",
  replicants_self_destruct_after:true};
}
