import { validateInboundRecord } from './defense/runtime-guard.js';
import { detectOpportunity } from './senses/signal-engine.js';

export function evaluateInbound(record) {
  const guard = validateInboundRecord(record);
  if (!guard.ok) return { accepted: false, defense: guard };

  return {
    accepted: true,
    tenant_id: record.tenant_id,
    project_id: record.project_id,
    record_type: record.record_type,
    received_at: record.received_at || new Date().toISOString()
  };
}

export function evaluateSession(session) {
  const opportunity = detectOpportunity(session);
  return {
    phase: 'sense_understand_qualify',
    ...opportunity,
    autonomous_action_allowed: false,
    // Human/commercial action remains explicit until a policy authorizes automation.
    requires_policy: opportunity.intent === 'high'
  };
}
