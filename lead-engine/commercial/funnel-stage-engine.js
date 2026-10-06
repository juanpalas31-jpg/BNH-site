const ORDER=["organic_entry","content_engaged","simulator_start","simulator_complete","form_start","qualified_lead","appointment","quote","sale"];

export function funnelStageIndex(stage){return ORDER.indexOf(stage);}

export function validateJourney(stages=[]){
 let last=-1;
 for(const stage of stages){
  const i=funnelStageIndex(stage);
  if(i<0||i<last) return {valid:false,stage};
  last=i;
 }
 return {valid:true,lastStage:stages.at(-1)||null};
}

export function weakestTransition(metrics={}){
 const pairs=ORDER.slice(0,-1).map((from,i)=>{
  const to=ORDER[i+1],a=Number(metrics[from]||0),b=Number(metrics[to]||0);
  return {from,to,rate:a>0?b/a:null};
 }).filter(x=>x.rate!==null);
 return pairs.sort((a,b)=>a.rate-b.rate)[0]||null;
}
