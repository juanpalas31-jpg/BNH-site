const STATUS_ORDER = Object.freeze({
  CALL_PRIORITY: 0,
  FOLLOW_UP: 1,
  NURTURE: 2
});

function safeText(value = '') {
  return String(value || '').trim();
}

export function huntingCard({ lead = {}, opportunity = {} } = {}) {
  return {
    lead_id: lead.lead_id || '',
    session_id: lead.session_id || opportunity.session_id || '',
    tenant_id: lead.tenant_id || opportunity.tenant_id || '',
    project_id: lead.project_id || opportunity.project_id || '',
    nom: safeText(lead.nom),
    telephone: safeText(lead.telephone),
    email: safeText(lead.email),
    code_postal: safeText(lead.code_postal),
    project: safeText(lead.project || lead.projet || lead.service),
    priority: opportunity.commercial_status || 'NURTURE',
    intent: opportunity.engine_intent || 'low',
    engine_score: Number(opportunity.engine_score || 0),
    quality_score: Number(opportunity.lead_quality_score || 0),
    callable: opportunity.contact?.callable === true,
    source: safeText(lead.source),
    canal: safeText(lead.canal),
    campagne: safeText(lead.campagne),
    utm_source: safeText(lead.utm_source),
    utm_medium: safeText(lead.utm_medium),
    utm_campaign: safeText(lead.utm_campaign),
    content_page: safeText(lead.content_page),
    received_at: lead.received_at || null,
    human_action_required: true,
    automatic_contact: false
  };
}

export function buildHuntingBoard(cards = []) {
  const rows = [...cards].sort((a, b) => {
    const status = (STATUS_ORDER[a.priority] ?? 99) - (STATUS_ORDER[b.priority] ?? 99);
    if (status !== 0) return status;
    const quality = Number(b.quality_score || 0) - Number(a.quality_score || 0);
    if (quality !== 0) return quality;
    return Number(b.engine_score || 0) - Number(a.engine_score || 0);
  });

  return {
    generated_at: new Date().toISOString(),
    totals: {
      all: rows.length,
      call_priority: rows.filter(x => x.priority === 'CALL_PRIORITY').length,
      follow_up: rows.filter(x => x.priority === 'FOLLOW_UP').length,
      nurture: rows.filter(x => x.priority === 'NURTURE').length
    },
    next_call: rows.find(x => x.priority === 'CALL_PRIORITY' && x.callable) || null,
    rows,
    automatic_contact: false
  };
}
