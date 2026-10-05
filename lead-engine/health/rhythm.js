/**
 * Spider circadian / seasonal rhythm.
 * Adjusts observation and experimentation cadence to evidence and environment,
 * without inventing biological claims or forcing activity when signals are weak.
 */
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));

export function rhythmProfile(input={}){
  const activity=clamp(input.activity_level ?? 0);
  const conversion=clamp(input.conversion_signal ?? 0);
  const seasonality=clamp(input.seasonality_strength ?? 0);
  const health=clamp((input.vitality_score ?? 100)/100);

  let mode='baseline';
  if(health<0.6) mode='conservation';
  else if(activity<0.15 && seasonality>0.6) mode='diapause';
  else if(activity>0.7 && conversion>0.5) mode='active_window';
  else if(activity>0.35) mode='exploration_window';

  return {
    mode,
    cadence:{
      sensing:mode==='active_window'?'high':'normal',
      experiments:['conservation','diapause'].includes(mode)?'low':mode==='exploration_window'?'medium':'normal',
      mutation_review:mode==='active_window'?'normal':'slow'
    },
    preserve_core:true,
    automatic_consequential_action:false
  };
}

export function detectActivityWindow(hourly=[]){
  const valid=hourly
    .filter(x=>Number.isInteger(Number(x.hour)) && Number(x.hour)>=0 && Number(x.hour)<=23)
    .map(x=>({hour:Number(x.hour),signal:Math.max(0,Number(x.signal||0))}));
  if(!valid.length) return {peak_hours:[],confidence:0};

  const total=valid.reduce((s,x)=>s+x.signal,0);
  if(!total) return {peak_hours:[],confidence:0};

  const ranked=[...valid].sort((a,b)=>b.signal-a.signal);
  const peak=ranked.slice(0,Math.min(3,ranked.length));
  return {
    peak_hours:peak.map(x=>x.hour),
    confidence:clamp(peak.reduce((s,x)=>s+x.signal,0)/total)
  };
}
