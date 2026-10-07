const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export function buildThreatSequence(events=[]){
 const recent=events.slice(-24);
 const counts={};
 for(const e of recent){const k=String(e.type||"UNKNOWN");counts[k]=(counts[k]||0)+1;}
 const rising=recent.length>=4&&recent.slice(-4).every((e,i,a)=>i===0||Number(e.risk||0)>=Number(a[i-1].risk||0));
 return {size:recent.length,counts,rising,last:recent.at(-1)||null};
}
export function forecastThreat(events=[]){
 const seq=buildThreatSequence(events),lastRisk=clamp(seq.last?.risk||0);
 const repetition=clamp(Math.max(0,...Object.values(seq.counts))/8);
 const probability=clamp(.45*lastRisk+.30*repetition+.25*(seq.rising?1:0));
 const horizon=probability>=.72?"IMMINENT":probability>=.46?"NEAR":"UNCERTAIN";
 return {probability,horizon,sequence:seq,actionable:probability>=.72};
}
export function competingHypotheses(events=[]){
 const f=forecastThreat(events);
 return [
  {name:"BENIGN_NOISE",weight:clamp(1-f.probability)},
  {name:"REPEATED_MINOR_THREAT",weight:clamp(f.probability*.72)},
  {name:"ESCALATING_THREAT",weight:clamp(f.probability*(f.sequence.rising?1:.45))}
 ].sort((a,b)=>b.weight-a.weight);
}
export function anticipatoryPosture(events=[]){
 const forecast=forecastThreat(events),hypotheses=competingHypotheses(events);
 if(!forecast.actionable)return {forecast,hypotheses,posture:"OBSERVE",irreversible_action:false};
 return {forecast,hypotheses,posture:"PREPARE_CONTAINMENT",irreversible_action:false,
  preparations:["WARM_SANDBOX","RESERVE_REPLICANTS","VERIFY_INTEGRITY","TIGHTEN_RATE_LIMIT"]};
}
