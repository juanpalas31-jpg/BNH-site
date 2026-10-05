const WEIGHTS = Object.freeze({
  page_view: 1,
  content_engaged: 2,
  simulator_start: 4,
  simulator_complete: 7,
  form_start: 8,
  form_submit: 15,
  booking_intent: 12
});

export function scoreSession(events = []) {
  let score = 0;
  const seen = new Set();

  for (const e of events) {
    const type = e.event || e.type;
    score += WEIGHTS[type] || 0;
    seen.add(type);
  }

  return {
    score,
    intent: score >= 20 ? 'high' : score >= 10 ? 'medium' : 'low',
    signals: [...seen]
  };
}

export function detectOpportunity(session) {
  const result = scoreSession(session.events || []);
  return {
    session_id: session.session_id,
    tenant_id: session.tenant_id,
    project_id: session.project_id,
    ...result,
    recommended_action:
      result.intent === 'high' ? 'prioritize_followup' :
      result.intent === 'medium' ? 'continue_nurture' :
      'observe'
  };
}
