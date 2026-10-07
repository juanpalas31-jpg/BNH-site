import { assessThreat,immuneResponse } from "./atila-immune-system.js";
import { consumeMinorThreat } from "./neo-atila-swarm-defense.js";

const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));

export function classifyDigitalAggression(signal={}){
 const type=String(signal.type||"UNKNOWN").toUpperCase();
 const severity=clamp(signal.severity??signal.anomaly_score);
 const confidence=clamp(signal.confidence??.5);
 const hostile=["BUG","ERROR","SPAM","MALWARE","VIRUS","INTRUSION","UNAUTHORIZED_ACCESS"].includes(type);
 return {type,severity,confidence,hostile,major:hostile&&severity>=.55};
}

/** Protocol 1: normal immune metabolism for bugs, spam, errors and bounded intrusions. */
export function protocolOne(signal={}){
 const a=classifyDigitalAggression(signal);
 if(!a.hostile)return {protocol:1,state:"IGNORE_OR_OBSERVE",consumed:false};
 if(!a.major){
  const neo=consumeMinorThreat({signal:{...signal,severity:a.severity,confidence:a.confidence,scope:signal.scope??.15}});
  return {protocol:1,state:"NEO_ATILA_RESPONSE",neo,feeding_signal:{
   kind:"DEFENSIVE_LEARNING",value:a.severity,meaning:"successful containment becomes validated immune experience"
  }};
 }
 const threat=assessThreat({type:a.type,surface:signal.surface||"AUTHORIZED_HOST",
  anomaly_score:a.severity,integrity_loss:signal.integrity_loss||0,
  owner_proof_failed:signal.owner_proof_failed,replay_detected:signal.replay_detected},signal.immune_memory||[]);
 return {protocol:1,state:"WAKE_ATTILA",threat,response:immuneResponse(threat),
  feeding_signal:{kind:"DEFENSIVE_LEARNING",value:threat.score,meaning:"major defense outcome becomes immune experience"}};
}

/**
 * Protocol 2: antimalware response plan for an explicitly authorized host.
 * Detection engines may supply hashes/findings; this layer only plans local
 * containment, quarantine, cleanup and restoration. No remote retaliation.
 */
export function protocolTwoAntimalware({host_authorized=false,findings=[]}={}){
 if(!host_authorized)return {protocol:2,allowed:false,reason:"HOST_PERMISSION_REQUIRED"};
 const normalized=findings.slice(0,256).map(f=>({
  finding_id:String(f.finding_id||f.hash||"unknown").slice(0,160),
  severity:clamp(f.severity),confidence:clamp(f.confidence),
  location_class:String(f.location_class||"unknown").slice(0,80)
 }));
 const critical=normalized.filter(x=>x.severity>=.75&&x.confidence>=.6);
 return {protocol:2,allowed:true,mode:critical.length?"ATTILA_ANTIMALWARE_CONTAINMENT":"NEO_ATILA_SCAN",
  findings:normalized,actions:critical.length
   ?["ISOLATE_AUTHORIZED_HOST","QUARANTINE_CONFIRMED_ARTIFACTS","STOP_CONFIRMED_MALICIOUS_PROCESS","PRESERVE_EVIDENCE","VERIFY_INTEGRITY","RESTORE_TRUSTED_COMPONENTS","RESCAN"]
   :["SCAN_WITH_TRUSTED_ENGINE","HASH_SUSPECT_ARTIFACTS","OBSERVE_PROCESS_BEHAVIOR","ESCALATE_CONFIRMED_FINDINGS"],
  venom:"LOCAL_QUARANTINE_AND_CAPABILITY_REVOCATION",
  boundary:"EXPLICITLY_AUTHORIZED_HOST_ONLY",outbound_retaliation:false,
  destructive_cleanup_requires_verified_finding:true};
}
