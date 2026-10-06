import { validateInboundRecord } from './defense/runtime-guard.js';
import { detectOpportunity } from './senses/signal-engine.js';
import { strategyDecision } from './hunt/strategy-selector.js';
import { buildOpportunityQueue } from './hunt/opportunity-queue.js';

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
  const events = session.events || [];
  const last = events.at(-1) || {};
  const strategy = strategyDecision({
    ...opportunity,
    event: last.event || last.type || '',
    last_event: last.event || last.type || '',
    opportunity: opportunity.intent === 'high' || opportunity.intent === 'medium'
  });

  return {
    phase: 'sense_understand_hunt_qualify',
    ...opportunity,
    hunt: strategy,
    autonomous_action_allowed: false,
    automatic_contact: false,
    requires_policy: opportunity.intent === 'high'
  };
}

export function prioritizeSessions(sessions = []) {
  const evaluated = sessions.map(evaluateSession);
  const queue = buildOpportunityQueue(evaluated);
  return {
    evaluated,
    queue,
    next: queue[0] || null,
    automatic_contact: false
  };
}
