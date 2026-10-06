import { buildCommercialOpportunity } from '../commercial/opportunity-desk.js';

const yes = value => [true, 1, '1', 'true', 'oui'].includes(
  typeof value === 'string' ? value.toLowerCase() : value
);

export function evaluateBnhOpportunity(body = {}) {
  const events = [...(Array.isArray(body.events) ? body.events : [])];
  if (yes(body.simulator_complete)) events.push({ event: 'simulator_complete' });
  events.push({ event: 'form_submit' });
  if (yes(body.booking_intent)) events.push({ event: 'booking_intent' });

  const opportunity = buildCommercialOpportunity({
    session_id: body.session_id || body.lead_id || '',
    tenant_id: 'bnh',
    project_id: 'bnh-site',
    events
  }, {
    serviceArea: yes(body.service_area),
    owner: yes(body.owner),
    projectIdentified: Boolean(body.project || body.projet || body.service),
    timelineKnown: Boolean(body.timeline || body.delai),
    simulatorComplete: yes(body.simulator_complete),
    requestedAssessment: yes(body.requested_assessment),
    contact_consent: yes(body.contact_consent),
    phone: body.telephone || '',
    email: body.email || ''
  });

  return {
    ...opportunity,
    attribution: {
      source: body.source || '',
      canal: body.canal || '',
      campagne: body.campagne || '',
      utm_source: body.utm_source || '',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
      content_page: body.content_page || body.path || ''
    }
  };
}
