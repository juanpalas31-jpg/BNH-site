const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export const SILK_TYPES=Object.freeze({
 SENSOR:{purpose:"OBSERVATION_LINK",persistent:false},
 ANCHOR:{purpose:"TRUSTED_REFERENCE",persistent:true},
 MEMORY:{purpose:"PROVENANCE_TRACE",persistent:true},
 SAFETY:{purpose:"ISOLATION_BOUNDARY",persistent:false},
 COORDINATION:{purpose:"AGENT_SIGNAL",persistent:false}
});
export function spinSilk(type="SENSOR",payload={}){
 const silk=SILK_TYPES[type]||SILK_TYPES.SENSOR;
 return {organ:"DIGITAL_SPINNERET",type,...silk,payload,
  external_side_effect:false};
}
export function sensorySetae(signals=[]){
 const sensed=signals.map(s=>({channel:s.channel||"UNKNOWN",strength:C(s.strength),novelty:C(s.novelty)}));
 const strongest=[...sensed].sort((a,b)=>b.strength-a.strength)[0]||null;
 return {organ:"DIGITAL_SETAE",sensed,strongest,multimodal:sensed.length>1};
}
export function chelicerae({target={},authorized=false}={}){
 return {organ:"DIGITAL_CHELICERAE",target:target.id||null,
  action:authorized?"ISOLATE_INTERNAL_TARGET":"OBSERVE_ONLY",
  boundary:"OWN_SYSTEM_ONLY",destructive:false,outbound_attack:false};
}
