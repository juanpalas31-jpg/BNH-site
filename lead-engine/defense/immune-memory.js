/**
 * Spider immune memory.
 * Recognizes repeated operational threats by privacy-safe fingerprints and
 * recommends escalating defenses without hack-back or destructive retaliation.
 */
import { createHash } from 'node:crypto';

const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));

export function threatFingerprint(threat={}){
  const safe=[
    threat.kind||'unknown',
    threat.route||'unknown',
    threat.failure_class||'unknown',
    threat.provider||'unknown'
  ].join('|');
  return createHash('sha256').update(safe).digest('hex').slice(0,24);
}

export function immuneResponse(threat={},history=[],options={}){
  const fingerprint=threatFingerprint(threat);
  const previous=history.filter(x=>x.fingerprint===fingerprint);
  const recurrence=previous.length;
  const severity=clamp(threat.severity||0);
  const memoryStrength=clamp((recurrence+1)/Math.max(1,Number(options.memory_threshold||3)));

  let response='observe';
  if(severity>=0.75) response='isolate_and_alert';
  else if(recurrence>=2||severity>=0.45) response='tighten_limits_and_alert';
  else if(severity>=0.2) response='increase_observation';

  return {
    fingerprint,
    recurrence,
    severity,
    memory_strength:memoryStrength,
    response,
    actions:{
      rate_limit:['tighten_limits_and_alert','isolate_and_alert'].includes(response),
      isolate:response==='isolate_and_alert',
      preserve_evidence:severity>=0.2,
      alert:['tighten_limits_and_alert','isolate_and_alert'].includes(response)
    },
    hack_back:false,
    automatic_destructive_action:false
  };
}

export function antibodyRecord(threat={},response={}){
  return {
    kind:'immune_memory',
    fingerprint:response.fingerprint||threatFingerprint(threat),
    threat_kind:threat.kind||'unknown',
    response:response.response||'observe',
    contains_pii:false,
    created_at:new Date().toISOString()
  };
}
