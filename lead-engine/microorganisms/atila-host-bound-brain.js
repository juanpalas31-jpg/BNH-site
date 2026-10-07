import {hostGate,attackResponse} from "../defense/atila-host-gate.js";
import {adaptiveCycle,recruit,collectivePlan} from "./atila-colony-brain.js";

const PRIVILEGED=new Set(["WRITE","DEPLOY","DELETE","ROTATE_KEY","CHANGE_POLICY","SELF_UPDATE"]);

export function runHostBoundCycle({node={},context={},event={},proof_result={},risk={},requested_action="READ"}={}){
 const gate=hostGate({proof_result,risk,requested_action});
 const defense=attackResponse({anomaly_score:risk.anomaly_score||0,host_verified:proof_result.ok===true});
 if(!gate.allowed){
  return {executed:false,gate,defense,node,
   decision:"HOST_AUTHORIZATION_REQUIRED",
   action_plan:["PRESERVE_STATE","LOG","WAIT_FOR_OWNER_PROOF"]};
 }
 const evolved=adaptiveCycle(node,context,event);
 return {executed:true,gate,defense,node:evolved,
  requested_action,
  privileged:PRIVILEGED.has(String(requested_action).toUpperCase())};
}

export function bindColonyToHost({colony=[],proof_result={},risk={},signal={}}={}){
 const gate=hostGate({proof_result,risk,requested_action:"WRITE"});
 if(!gate.allowed) return {bound:false,gate,recruited:[],plan:[],
  colony_mode:"SAFE_READ_ONLY"};
 const recruited=recruit(colony,signal);
 return {bound:true,gate,recruited,plan:collectivePlan(recruited),
  colony_mode:"OWNER_BOUND",
  privilege_inheritance:"DOWNWARD_ONLY",
  child_can_escalate:false};
}
