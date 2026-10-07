const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export function webVibration(signal={}){
 const intensity=clamp(signal.intensity),novelty=clamp(signal.novelty),repeat=clamp(signal.repeat_rate);
 const integrity=clamp(signal.integrity_risk);
 const score=clamp(.30*intensity+.20*novelty+.20*repeat+.30*integrity);
 const band=score>=.78?"ALARM":score>=.48?"ATTENTION":score>=.18?"LOCAL":"NOISE";
 return {score,band,fingerprint:signal.fingerprint||null};
}
export function routeVibration(signal={}){
 const v=webVibration(signal);
 if(v.band==="NOISE")return {...v,route:"DROP",wake_atila:false,replicants:0};
 if(v.band==="LOCAL")return {...v,route:"NEO_LOCAL",wake_atila:false,replicants:3};
 if(v.band==="ATTENTION")return {...v,route:"NEO_SWARM",wake_atila:false,replicants:6};
 return {...v,route:"ATILA_IMMUNE_ESCALATION",wake_atila:true,replicants:0};
}
export function fuseSignals(signals=[]){
 const routed=signals.map(routeVibration);
 const alarms=routed.filter(x=>x.band==="ALARM").length;
 const attention=routed.filter(x=>x.band==="ATTENTION").length;
 return {routed,collective_alarm:alarms>0||attention>=3,
  local_only:alarms===0&&attention<3};
}
