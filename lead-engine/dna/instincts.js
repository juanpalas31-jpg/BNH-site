/**
 * Spider instinct library.
 * Stable inherited priorities that arbitrate competing reflexes.
 */
export const INSTINCTS=Object.freeze([
  {id:'survive',priority:100,rule:'preserve_core_and_recovery'},
  {id:'protect_boundaries',priority:95,rule:'preserve_tenant_isolation_and_secrets'},
  {id:'preserve_truth',priority:90,rule:'do_not_invent_signals_results_or_capabilities'},
  {id:'sense',priority:80,rule:'observe_before_consequential_action'},
  {id:'learn',priority:70,rule:'require_evidence_before_durable_learning'},
  {id:'hunt',priority:60,rule:'prefer_relevant_intent_over_raw_traffic'},
  {id:'adapt',priority:50,rule:'test_bounded_variations_before_promotion'},
  {id:'grow',priority:40,rule:'scale_only_proven_patterns'},
  {id:'reproduce',priority:30,rule:'inherit_structure_not_customer_data'}
]);

export function arbitrate(candidates=[]){
  const priority=new Map(INSTINCTS.map(x=>[x.id,x.priority]));
  return [...candidates].sort((a,b)=>
    (priority.get(b.instinct)||0)-(priority.get(a.instinct)||0)
  );
}

export function instinctContract(){
  return {
    version:1,
    instincts:INSTINCTS,
    invariant:'survival_security_truth_before_growth'
  };
}
