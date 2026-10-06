import { assimilateOutcome } from './attila-assimilation.js';

const allowed=['qualified','appointment','quote','sale','payment','collected'];

export function revenueEvidence(input={}){
 const required=['threadId','leadId','outcome'];
 const missing=required.filter(k=>!input[k]);
 if(missing.length) return {accepted:false,missing};
 const outcome=String(input.outcome).toLowerCase();
 if(!allowed.includes(outcome)) return {accepted:false,reason:'invalid_outcome'};

 const signedRevenue=outcome==='sale'?Math.max(0,Number(input.signedRevenue ?? input.verifiedRevenue ?? 0)):0;
 const collectedRevenue=['payment','collected'].includes(outcome)
   ? Math.max(0,Number(input.collectedRevenue ?? input.verifiedRevenue ?? 0)):0;
 const realizedMargin=collectedRevenue>0?Math.max(0,Number(input.realizedMargin||0)):0;

 const assimilation=assimilateOutcome({
   tenant_id:input.tenant_id, project_id:input.project_id, lead_id:input.leadId,
   source:input.source, canal:input.canal, campagne:input.campagne, outcome,
   collected_revenue:collectedRevenue, realized_margin:realizedMargin,
   intent_score:input.intent_score, urgency_score:input.urgency_score,
   fit_score:input.fit_score, reachability_score:input.reachability_score,
   contact_consent:input.contact_consent
 });

 return {
  accepted:true, threadId:input.threadId, leadId:input.leadId, outcome,
  signedRevenue, collectedRevenue, realizedMargin,
  verifiedRevenue:collectedRevenue,
  assimilation,
  synthetic:false
 };
}
