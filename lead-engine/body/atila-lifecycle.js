import {createBodyState,runBodyCycle} from "./atila-digital-organism.js";
import {applyAutonomicGovernor} from "./atila-autonomic-governor.js";

export function live({cycles=10,initial={},environment}={}){
 let body=createBodyState(initial);const history=[];
 for(let i=0;i<Math.max(1,Math.min(1000,cycles));i++){
  const env=typeof environment==="function"?environment(i,body):environment||{};
  const cycle=applyAutonomicGovernor(runBodyCycle({body,signals:env.signals||[],
   inputs:env.inputs||[],context:env.context||{},history:env.history||{}}));
  history.push({cycle:cycle.cycle,effective_action:cycle.effective_action,
   energy:cycle.next_body.energy,integrity:cycle.next_body.integrity,
   compute_capacity:cycle.next_body.compute_capacity,waste:cycle.next_body.waste,
   stress:cycle.homeostasis.stress,autonomic_mode:cycle.autonomic.mode});
  body=cycle.next_body;
 }
 return {identity:"ATILA_LIVING_LOOP_SIMULATION",cycles:history.length,final_body:body,history,
  biological_life_claim:false,autonomous_external_action:false};
}
