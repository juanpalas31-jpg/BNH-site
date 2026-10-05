/**
 * Spider nervous system.
 * Fuses self-awareness, environment and physiology into one bounded decision cycle.
 * No consequential action is executed here: this produces an auditable plan.
 */
import { resolvePhenotype } from '../dna/phenotype-resolver.js';
import { reflexPlan, survivalPriority } from '../dna/reflex-layer.js';
import { homeostasisDecision } from '../health/homeostasis.js';
import { metabolicBudget } from '../health/metabolic-budget.js';
import { rhythmProfile } from '../health/rhythm.js';
import { selfModel, canExecute } from './proprioception.js';

export function nervousCycle(input={}){
  const self=selfModel(input.self||{});
  const homeostasis=homeostasisDecision(input.health||{});
  const phenotype=resolvePhenotype({
    ...(input.environment||{}),
    resource_pressure:homeostasis.response==='survival_mode'||input.environment?.resource_pressure
  });
  const reflex=reflexPlan(phenotype);
  const prioritized=survivalPriority(reflex);
  const metabolism=metabolicBudget({
    vitality_score:homeostasis.vitality.score,
    opportunity_score:Number(input.opportunity_score||0),
    evidence_confidence:Number(input.evidence_confidence||0),
    resource_pressure:Number(input.resource_pressure||0)
  });
  const rhythm=rhythmProfile({
    ...(input.rhythm||{}),
    vitality_score:homeostasis.vitality.score
  });

  const executable=prioritized.map(step=>{
    const requirements=(input.action_requirements||{})[step.action]||[];
    const gate=canExecute(self.capabilities,requirements);
    return {...step,requirements,capability_gate:gate};
  });

  return {
    cycle_version:1,
    self,
    homeostasis,
    phenotype,
    metabolism,
    rhythm,
    reflex:{...reflex,actions:executable},
    survival_first:homeostasis.vitality.status==='critical',
    automatic_consequential_action:false,
    generated_at:new Date().toISOString()
  };
}
