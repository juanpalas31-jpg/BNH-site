import {routeVibration} from "../senses/atila-web-nervous-system.js";
import {spawnReplicantSwarm} from "../defense/neo-atila-swarm-defense.js";
export function reflexArc(signal={}){
 const route=routeVibration(signal);
 if(route.route==="DROP")return {route,action:"IGNORE_NOISE",autonomic:true};
 if(route.route==="NEO_LOCAL"){
  const swarm=spawnReplicantSwarm({signal:{severity:route.score,scope:.12,confidence:.72},max:3});
  return {route,action:"LOCAL_INSPECTION",swarm,autonomic:true};
 }
 if(route.route==="NEO_SWARM"){
  const swarm=spawnReplicantSwarm({signal:{severity:route.score*.7,scope:.2,confidence:.82},max:6});
  return {route,action:"SWARM_CONTAINMENT_PREP",swarm,autonomic:true};
 }
 return {route,action:"WAKE_ATILA_IMMUNE_SYSTEM",swarm:null,autonomic:false};
}
export function reflexBudget({energy=.8,active_replicants=0}={}){
 const max=Math.max(1,Math.floor(12*Math.max(.15,Math.min(1,energy))));
 return {max_replicants:max,available:Math.max(0,max-active_replicants),
  exhausted:active_replicants>=max};
}
