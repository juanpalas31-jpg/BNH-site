/**
 * Spider pain / damage signals.
 * Converts operational injury into bounded avoidance memory.
 */
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));

export function damageSignal(input={}){
  const error=clamp(input.error_rate||0);
  const dataRisk=clamp(input.data_integrity_risk||0);
  const security=clamp(input.security_risk||0);
  const restoreRisk=clamp(input.restore_risk||0);
  const customerImpact=clamp(input.customer_impact||0);

  const severity=
    error*0.15+
    dataRisk*0.30+
    security*0.25+
    restoreRisk*0.20+
    customerImpact*0.10;

  return {
    severity,
    level:severity>=0.75?'critical':severity>=0.45?'high':severity>=0.2?'moderate':'low',
    avoid_repeat:severity>=0.45,
    survival_reflex:severity>=0.75,
    automatic_retaliation:false
  };
}

export function scarRecord({cause=null,context=null,damage={},lesson=null}={}){
  const signal=damageSignal(damage);
  return {
    kind:'operational_scar',
    cause,
    context,
    severity:signal.severity,
    lesson,
    reusable_as_structural_learning:Boolean(lesson)&&signal.avoid_repeat,
    contains_customer_data:false,
    created_at:new Date().toISOString()
  };
}
