import {hostSecurityMode} from "./atila-host-identity.js";
export function hostGate({proof_result={},risk={},requested_action="READ"}={}){
 const mode=hostSecurityMode({failed_attempts:risk.failed_attempts||0,
  anomaly_score:risk.anomaly_score||0,verified:proof_result.ok===true});
 const write=["WRITE","DEPLOY","DELETE","ROTATE_KEY","CHANGE_POLICY"].includes(String(requested_action).toUpperCase());
 if(mode==="LOCKDOWN") return {allowed:false,mode,capability:"ISOLATED_READ_ONLY",require_reauth:true};
 if(!proof_result.ok&&write) return {allowed:false,mode,capability:"READ_ONLY",require_reauth:true};
 if(proof_result.ok) return {allowed:true,mode,capability:"OWNER_SESSION",require_reauth:false};
 return {allowed:!write,mode,capability:"PUBLIC_SAFE_READ",require_reauth:write};
}
export function attackResponse({anomaly_score=0,host_verified=false}={}){
 if(host_verified) return {state:"NORMAL",network_policy:"STANDARD",mutation_allowed:false};
 if(anomaly_score>=.85) return {state:"QUARANTINE",network_policy:"DENY_BY_DEFAULT",mutation_allowed:false,
  actions:["FREEZE_PRIVILEGED_ACTIONS","PRESERVE_LOGS","INVALIDATE_SESSION","REQUIRE_OWNER_PROOF"]};
 if(anomaly_score>=.55) return {state:"SUSPICIOUS",network_policy:"RESTRICTED",mutation_allowed:false,
  actions:["RATE_LIMIT","INCREASE_CHALLENGE","AUDIT"]};
 return {state:"OBSERVE",network_policy:"STANDARD",mutation_allowed:false,actions:["LOG"]};
}
