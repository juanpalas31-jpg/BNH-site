import { evaluateSession, prioritizeSessions } from '../orchestrator.js';
import { leadQuality } from './lead-quality.js';

function contactability(input = {}) {
  const consent = input.contact_consent === true;
  const hasPhone = Boolean(String(input.phone || '').trim());
  const hasEmail = Boolean(String(input.email || '').trim());
  return {
    consent,
    has_phone: hasPhone,
    has_email: hasEmail,
    callable: consent && hasPhone,
    contactable: consent && (hasPhone || hasEmail)
  };
}

export function buildCommercialOpportunity(session = {}, qualification = {}) {
  const engine = evaluateSession(session);
  const quality = leadQuality(qualification);
  const contact = contactability(qualification);

  return {
    tenant_id: session.tenant_id,
    project_id: session.project_id,
    session_id: session.session_id,
    engine_intent: engine.intent,
    engine_score: engine.score,
    hunt_strategy: engine.hunt?.strategy || 'observe',
    lead_quality_score: quality.score,
    lead_quality_band: quality.band,
    contact,
    commercial_status:
      contact.callable && quality.band === 'HIGH' ? 'CALL_PRIORITY' :
      contact.contactable && quality.band !== 'LOW' ? 'FOLLOW_UP' :
      'NURTURE',
    automatic_contact: false,
    human_action_required: true
  };
}

export function commercialDesk(entries = []) {
  const sessions = entries.map(x => x.session || {});
  const prioritized = prioritizeSessions(sessions);
  const opportunities = entries.map(x =>
    buildCommercialOpportunity(x.session || {}, x.qualification || {})
  );

  const rank = new Map(prioritized.queue.map((x, i) => [x.session_id, i]));
  opportunities.sort((a, b) => {
    const aRank = rank.has(a.session_id) ? rank.get(a.session_id) : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b.session_id) ? rank.get(b.session_id) : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return b.lead_quality_score - a.lead_quality_score;
  });

  return {
    opportunities,
    next_human_call:
      opportunities.find(x => x.commercial_status === 'CALL_PRIORITY') || null,
    automatic_contact: false
  };
}
