const ROLES=["OBSERVER","ANALYST","DECOY","CHECKER","SENTINEL","PLANNER"];
const TACTICS=["ISOLATE","STARVE","DECOY","RESET","ADAPT","OBSERVE"];
export function diversifyGeneration(replicants=[]){
 return replicants.map((r,i)=>({...r,role:ROLES[i%ROLES.length],
  strategy_bias:TACTICS[(i+(r.generation||0))%TACTICS.length],
  diversity_slot:i%6,shared_failure_domain:false}));
}
export function diversityHealth(nodes=[]){
 const roles=new Set(nodes.map(n=>n.role)).size;
 const biases=new Set(nodes.map(n=>n.strategy_bias)).size;
 const n=Math.max(1,nodes.length);
 const score=Math.min(1,(roles+biassesafe(biases))/(Math.min(6,n)*2));
 return {score,roles,biases,healthy:score>=.5};
}
function biassesafe(v){return Number.isFinite(v)?v:0;}
export function enforceDiversity(nodes=[]){
 const d=diversityHealth(nodes);
 return d.healthy?{nodes,diversity:d,reseed:false}:
  {nodes:diversifyGeneration(nodes),diversity:d,reseed:true};
}
