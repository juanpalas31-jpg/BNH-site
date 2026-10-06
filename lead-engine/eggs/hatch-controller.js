import { eggLifecycle } from "./egg-lifecycle.js";
import { reconstructionPlan } from "./reconstruction-plan.js";

export function hatchAssessment(input={}) {
  const lifecycle=eggLifecycle(input);
  const plan=reconstructionPlan(input.egg||{}, input.environment||{});
  const blocked=plan.filter(x=>!x.ready).map(x=>x.stage);
  const permitted=lifecycle.state==="hatched" && blocked.length===0;
  return {
    lifecycle,
    reconstruction:plan,
    hatch_permitted:permitted,
    blocked_stages:blocked,
    recipient_consent_required:true,
    automatic_execution:false,
    next: permitted ? "prepare_local_reconstruction" : "remain_dormant_or_complete_requirements"
  };
}
