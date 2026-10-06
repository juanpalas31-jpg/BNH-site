import { evaluateSession, prioritizeSessions } from '../orchestrator.js';
import { leadQuality } from './lead-quality.js';
import { scoreLeadNutrition } from './attila-feeding-engine.js';

function contactability(input = {}) {
  const consent = input.contact_consent === true;
  const hasPhone = Boolean(String(input.phone || '').trim());
  const hasEmail = Boolean(String(input.email || '').trim());
  return { consent, has_phone:hasPhone, has_email:hasEmail, callable:consent&&hasPhone, contactable:consent&&(hasPhone||hasEmail) };
}

export function buildCommercialOpportunity(session = {}, qualification = {}) {
  const engine=evaluateSession(session), quality=leadQuality(qualification), contact=contactability(qualification);
  const nutrition=scoreLeadNutrition({
    intent_score:engine.score, urgency_score:qualification.urgency_score||0, fit_score:quality.score,
    reachability_score:contact.callable?100:contact.contactable?65:0, contact_consent:contact.consent,
    qualified:quality.band==='HIGH', appointment:qualification.appointment, quote:qualification.quote,
    sale:qualification.sale, collected_revenue:qualification.collected_revenue, realized_margin:qualification.realized_margin
  });
  return {
    tenant_id:session.tenant_id, project_id:session.project_id, session_id:session.session_id,
    engine_intent:engine.intent, engine_score:engine.score, hunt_strategy:engine.hunt?.strategy||'observe',
    lead_quality_score:quality.score, lead_quality_band:quality.band,
    attila_nutrition_score:nutrition.nutrition_score, attila_quality_band:nutrition.quality_band, contact,
    commercial_status:contact.callable&&quality.band==='HIGH'?'CALL_PRIORITY':contact.contactable&&quality.band!=='LOW'?'FOLLOW_UP':'NURTURE',
    automatic_contact:false, human_action_required:true
  };
}

export function commercialDesk(entries = []) {
  const prioritized=prioritizeSessions(entries.map(x=>x.session||{}));
  const opportunities=entries.map(x=>buildCommercialOpportunity(x.session||{},x.qualification||{}));
  const rank=new Map(prioritized.queue.map((x,i)=>[x.session_id,i]));
  opportunities.sort((a,b)=>{
    const ar=rank.has(a.session_id)?rank.get(a.session_id):Number.MAX_SAFE_INTEGER;
    const br=rank.has(b.session_id)?rank.get(b.session_id):Number.MAX_SAFE_INTEGER;
    return ar!==br?ar-br:b.attila_nutrition_score-a.attila_nutrition_score;
  });
  return {opportunities,next_human_call:opportunities.find(x=>x.commercial_status==='CALL_PRIORITY')||null,automatic_contact:false};
}
