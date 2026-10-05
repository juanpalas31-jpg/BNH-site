/**
 * Spider organ registry: explicit body plan for the digital organism.
 */
export const ORGANS=Object.freeze({
  eyes:{module:'senses/signal-engine.js',function:'external_signal_detection'},
  proprioception:{module:'senses/proprioception.js',function:'self_capability_awareness'},
  nervous_system:{module:'senses/nervous-system.js',function:'decision_cycle'},
  instincts:{module:'dna/instincts.js',function:'priority_arbitration'},
  metabolism:{module:'health/metabolic-budget.js',function:'resource_allocation'},
  homeostasis:{module:'health/homeostasis.js',function:'vitality_regulation'},
  rhythm:{module:'health/rhythm.js',function:'temporal_adaptation'},
  memory:{module:'memory/consolidation.js',function:'learning_consolidation'},
  hunting:{module:'hunt/strategy-selector.js',function:'strategy_selection'},
  evolution:{module:'evolution/strategy-fitness.js',function:'fitness_selection'},
  mutation_guard:{module:'evolution/mutation-guard.js',function:'mutation_control'},
  regeneration:{module:'regeneration/restore-check.js',function:'recovery'},
  reproduction:{module:'reproduction/structural-learning.js',function:'structural_inheritance'}
});

export function bodyPlan(){
  return Object.entries(ORGANS).map(([organ,x])=>({organ,...x}));
}
export function missingOrgans(available=[]){
  const set=new Set(available);
  return Object.keys(ORGANS).filter(x=>!set.has(x));
}
