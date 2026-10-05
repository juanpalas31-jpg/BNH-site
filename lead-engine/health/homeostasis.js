/**
 * Spider homeostasis.
 * Produces a compact vitality reading from aggregate operational signals.
 * This layer observes and recommends; it does not mutate production by itself.
 */
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));

export function vitality(signals={}){
  const availability=clamp(signals.availability_pct ?? 100);
  const integrity=clamp(signals.integrity_pct ?? 100);
  const restore=clamp(signals.restore_readiness_pct ?? 100);
  const ingestion=clamp(signals.ingestion_health_pct ?? 100);
  const security=clamp(signals.security_health_pct ?? 100);

  const score=
    availability*0.20+
    integrity*0.25+
    restore*0.20+
    ingestion*0.20+
    security*0.15;

  const status=score>=90?'healthy':score>=75?'watch':score>=50?'stressed':'critical';
  return {score:Number(score.toFixed(2)),status,components:{availability,integrity,restore,ingestion,security}};
}

export function homeostasisDecision(signals={}){
  const v=vitality(signals);
  const anomalies=Number(signals.anomaly_count||0);
  const queueDepth=Number(signals.queue_depth||0);

  let response='maintain';
  if(v.status==='critical') response='survival_mode';
  else if(v.status==='stressed') response='reduce_nonessential_activity';
  else if(v.status==='watch'||anomalies>0||queueDepth>100) response='increase_observation';

  return {
    vitality:v,
    response,
    priorities:response==='survival_mode'
      ? ['preserve_data','preserve_restore_path','isolate_failures','keep_core_ingestion']
      : response==='reduce_nonessential_activity'
        ? ['pause_experiments','protect_core_services','diagnose']
        : ['observe','learn','operate'],
    automatic_destructive_action:false,
    generated_at:new Date().toISOString()
  };
}
