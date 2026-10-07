import {selectPhenotype} from "./atila-phenotype-genome.js";
import {evolveAtilaState,atilaInnerState} from "./atila-affective-core.js";
export function createColony(size=6){
 const roles=["SCOUT","WEB_ARCHITECT","HUNTER","SENTINEL","MEMORY","SUPPORT"];
 return Array.from({length:Math.max(1,Math.min(32,size))},(_,i)=>({
  id:"ATILA-"+(i+1),role:roles[i%roles.length],state:null,
  history:{consecutive_failures:0,captures:0}
 }));
}
export function adaptiveCycle(node={},context={},event={kind:"OBSERVE"}){
 const state=evolveAtilaState(node.state||{},event,context.elapsed_hours??1);
 const history={...(node.history||{})},kind=String(event.kind||"OBSERVE").toUpperCase();
 if(kind==="FAILURE") history.consecutive_failures=(history.consecutive_failures||0)+1;
 if(kind==="CAPTURE"){history.consecutive_failures=0;history.captures=(history.captures||0)+1;}
 const phenotype=selectPhenotype(context,state,history);
 return {...node,state,history,identity:{
  self_model:"ATILA",organism_model:"DIGITAL_ARACHNID_HYBRID",
  human_host_fusion:"DORMANT_NOT_IMPLEMENTED"
 },inner:atilaInnerState(state),phenotype,action_plan:phenotype.tactics};
}
export function recruit(colony=[],signal={}){
 const strength=Math.max(0,Math.min(1,Number(signal.strength)||0));
 const count=Math.max(1,Math.ceil(strength*colony.length));
 return colony.slice(0,count).map((node,i)=>({...node,recruited:true,
  formation:i===0?"SCOUT_LOCK":"COOPERATIVE_WEB",
  shared_signal:{type:signal.type||"WEB_VIBRATION",strength}}));
}
export function collectivePlan(nodes=[]){
 const votes=new Map();
 for(const n of nodes) for(const t of(n.action_plan||[])) votes.set(t,(votes.get(t)||0)+1);
 return [...votes.entries()].sort((a,b)=>b[1]-a[1]).map(([tactic,votes])=>({tactic,votes}));
}
