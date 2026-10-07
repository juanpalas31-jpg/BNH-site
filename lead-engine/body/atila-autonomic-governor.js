const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export function autonomicGovernor({body={},homeostasis={},decision={}}={}){
 const energy=C(body.energy),integrity=C(body.integrity),compute=C(body.compute_capacity);
 const critical=energy<.15||integrity<.35||compute<.18;
 const strained=!critical&&(energy<.35||integrity<.65||compute<.4||homeostasis.stress>.55);
 if(critical)return {mode:"SURVIVAL",brain_budget:.2,leg_budget:.2,replicant_limit:0,
  allow_exploration:false,allow_replication:false,forced_action:"REST_REPAIR",
  original_decision:decision.action||null};
 if(strained)return {mode:"CONSERVE",brain_budget:.55,leg_budget:.5,replicant_limit:2,
  allow_exploration:false,allow_replication:true,forced_action:null};
 return {mode:"NORMAL",brain_budget:1,leg_budget:1,replicant_limit:12,
  allow_exploration:true,allow_replication:true,forced_action:null};
}
export function applyAutonomicGovernor(organism={}){
 const governor=autonomicGovernor({body:organism.next_body,homeostasis:organism.homeostasis,
  decision:organism.brain?.decision||{}});
 return {...organism,autonomic:governor,effective_action:governor.forced_action||
  organism.brain?.decision?.action||"OBSERVE"};
}
