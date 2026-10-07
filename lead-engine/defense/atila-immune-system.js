import {createHash} from "node:crypto";
const H=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));

export function immuneFingerprint(observation={}){
 const safe={type:observation.type||"UNKNOWN",surface:observation.surface||"UNKNOWN",
  pattern:observation.pattern||null,code:observation.code||null};
 return H(safe);
}
export function assessThreat(obs={},memory=[]){
 const anomaly=clamp(obs.anomaly_score),integrity=clamp(obs.integrity_loss),
  auth=obs.owner_proof_failed===true?1:0,replay=obs.replay_detected===true?1:0;
 const fp=immuneFingerprint(obs),known=memory.some(x=>x.fingerprint===fp);
 const score=clamp(.35*anomaly+.30*integrity+.20*auth+.15*replay+(known?.08:0));
 const level=score>=.82?"CRITICAL":score>=.58?"HIGH":score>=.32?"ELEVATED":"LOW";
 return {fingerprint:fp,known,score,level};
}
export function immuneResponse(threat={}){
 if(threat.level==="CRITICAL") return {mode:"QUARANTINE",
  actions:["ISOLATE_NODE","FREEZE_WRITES","REVOKE_SESSION","PRESERVE_EVIDENCE","REQUIRE_OWNER_PROOF"]};
 if(threat.level==="HIGH") return {mode:"CONTAIN",
  actions:["RESTRICT_NETWORK","FREEZE_PRIVILEGED_ACTIONS","SNAPSHOT","AUDIT"]};
 if(threat.level==="ELEVATED") return {mode:"WATCH",
  actions:["RATE_LIMIT","INCREASE_TELEMETRY","RECHECK_INTEGRITY"]};
 return {mode:"NORMAL",actions:["LOG_MINIMAL"]};
}
export function learnImmuneMemory(threat={},memory=[]){
 if(!threat.fingerprint||threat.score<.32)return memory;
 const old=memory.find(x=>x.fingerprint===threat.fingerprint);
 const next=old?memory.map(x=>x.fingerprint===threat.fingerprint?
  {...x,hits:(x.hits||1)+1,max_score:Math.max(x.max_score||0,threat.score)}:x):
  [...memory,{fingerprint:threat.fingerprint,hits:1,max_score:threat.score}];
 return next.slice(-512);
}
export function canRejoinColony({integrity_verified=false,owner_verified=false,
 fresh_process=false,threat_score=1}={}){
 return integrity_verified&&owner_verified&&fresh_process&&clamp(threat_score)<.20;
}
