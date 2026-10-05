/**
 * Spider reflex layer.
 * Maps phenotype states to safe, bounded operational recommendations.
 * Reflexes preserve the organism first; consequential actions stay policy-gated.
 */
const REFLEXES={
  premolt:['create_snapshot','verify_restore_path','pause_nonessential_mutations'],
  ecdysis:['isolate_migration','freeze_nonessential_changes','verify_integrity'],
  postmolt:['observe_health','compare_baseline','delay_major_mutations'],
  defense:['rate_limit','isolate_suspicious_input','preserve_audit_evidence'],
  escape:['open_circuit','queue_safe_work','use_verified_fallback'],
  thanatosis:['pause_nonessential_outbound','continue_sensing'],
  autotomy:['isolate_module','preserve_core','prepare_replacement'],
  stridulation:['emit_structured_alert','append_audit_record'],
  crypsis:['minimize_exposure','continue_sensing'],
  hunt:['score_opportunity','select_strategy'],
  orientation:['collect_context','update_intent_score'],
  stalking:['serve_relevant_information','wait_for_stronger_signal'],
  predatory_leap:['surface_simulator_or_booking','record_outcome'],
  ambush:['wait_for_intent','surface_contextual_offer'],
  wrap:['normalize_lead','deduplicate','route_to_storage'],
  web_building:['create_useful_asset','connect_internal_threads','measure_asset'],
  web_repair:['repair_or_consolidate_asset','preserve_learnings'],
  ballooning:['bootstrap_isolated_tenant','copy_structural_dna_only'],
  rappelling:['restore_verified_snapshot','verify_integrity'],
  diapause:['reduce_experiments','preserve_health_checks'],
  thermal_hydric_stress:['prioritize_core_services','degrade_gracefully'],
  fasting:['preserve_state','run_bounded_exploration','avoid_false_learning'],
  regeneration:['rebuild_from_dna','restore_snapshot','verify_checksum']
};

const POLICY_GATED=new Set([
  'autotomy','predatory_leap','ballooning','rappelling','regeneration'
]);

export function reflexPlan(phenotype={}){
  const state=phenotype.state||'crypsis';
  const actions=REFLEXES[state]||['continue_sensing'];
  return {
    state,
    actions:actions.map(action=>({
      action,
      mode:'recommendation',
      automatic_consequential_action:false
    })),
    policy_required:POLICY_GATED.has(state),
    generated_at:new Date().toISOString()
  };
}

export function survivalPriority(plan={}){
  const survival=new Set([
    'create_snapshot','verify_restore_path','preserve_core','open_circuit',
    'queue_safe_work','restore_verified_snapshot','rebuild_from_dna',
    'restore_snapshot','verify_checksum','prioritize_core_services'
  ]);
  return [...(plan.actions||[])].sort((a,b)=>
    Number(survival.has(b.action))-Number(survival.has(a.action))
  );
}
