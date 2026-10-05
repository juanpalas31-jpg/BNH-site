/**
 * Spider Engine phenotype resolver.
 * Converts portable DNA + current environment into a bounded behavioral state.
 * It recommends behavior; it never performs consequential actions itself.
 */

const STATES=new Set([
  'premolt','ecdysis','postmolt','defense','escape','thanatosis','autotomy',
  'stridulation','crypsis','territoriality','hunt','orientation','stalking',
  'predatory_leap','ambush','wrap','web_building','web_repair','ballooning',
  'rappelling','aquatic_mode','courtship','wandering','pheromone_detection',
  'drumming','egg_guarding','offspring_transport','maternal_care',
  'social_cooperation','gregarious_tolerance','diapause',
  'thermal_hydric_stress','fasting','regeneration'
]);

export function resolvePhenotype(env={}){
  let state='crypsis';
  let reason='normal_operation';

  if(env.integrity_failure) [state,reason]=['regeneration','integrity_failure'];
  else if(env.compromised_module) [state,reason]=['autotomy','compromised_module'];
  else if(env.provider_failure) [state,reason]=['escape','provider_failure'];
  else if(env.security_anomaly) [state,reason]=['defense','security_anomaly'];
  else if(env.rollback_required) [state,reason]=['rappelling','rollback_required'];
  else if(env.major_migration_active) [state,reason]=['ecdysis','major_migration_active'];
  else if(env.major_change_pending) [state,reason]=['premolt','major_change_pending'];
  else if(env.recent_major_change) [state,reason]=['postmolt','recent_major_change'];
  else if(env.resource_pressure) [state,reason]=['thermal_hydric_stress','resource_pressure'];
  else if(env.seasonal_low_activity) [state,reason]=['diapause','seasonal_low_activity'];
  else if(env.low_traffic) [state,reason]=['fasting','low_traffic'];
  else if(env.new_market && env.pattern_proven) [state,reason]=['ballooning','proven_pattern_new_market'];
  else if(Number(env.intent_score||0)>=15) [state,reason]=['predatory_leap','high_intent'];
  else if(Number(env.intent_score||0)>=8) [state,reason]=['ambush','medium_high_intent'];
  else if(Number(env.intent_score||0)>=4) [state,reason]=['stalking','emerging_intent'];
  else if(env.new_signal) [state,reason]=['orientation','new_signal'];
  else if(env.organic_opportunity) [state,reason]=['web_building','organic_opportunity'];

  return {
    state:STATES.has(state)?state:'crypsis',
    reason,
    automatic_consequential_action:false,
    requires_policy:['predatory_leap','ballooning','autotomy'].includes(state),
    resolved_at:new Date().toISOString()
  };
}

export function phenotypeTransition(previous=null,env={}){
  const next=resolvePhenotype(env);
  return {
    previous_state:previous?.state||null,
    ...next,
    changed:(previous?.state||null)!==next.state
  };
}
