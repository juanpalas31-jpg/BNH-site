/**
 * Spider Engine strategy fitness.
 * Turns aggregate outcomes into evidence-weighted strategy scores.
 * No visitor-level profiling, automatic contact or irreversible action.
 */

const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));

export function strategyFitness(row={}, options={}){
  const impressions=Math.max(0,Number(row.impressions||0));
  const qualified=Math.max(0,Number(row.qualified_leads||0));
  const appointments=Math.max(0,Number(row.appointments||0));
  const sales=Math.max(0,Number(row.sales||0));
  const revenue=Math.max(0,Number(row.revenue||0));
  const minEvidence=Math.max(1,Number(options.min_evidence||50));

  const qualificationRate=impressions?qualified/impressions:0;
  const appointmentRate=qualified?appointments/qualified:0;
  const saleRate=appointments?sales/appointments:0;
  const revenuePerQualified=qualified?revenue/qualified:0;

  // Confidence grows gradually: tiny samples must never dominate the organism.
  const confidence=clamp(impressions/minEvidence);
  const raw=
    clamp(qualificationRate/0.10)*0.30+
    clamp(appointmentRate/0.35)*0.25+
    clamp(saleRate/0.25)*0.30+
    clamp(revenuePerQualified/1000)*0.15;

  return {
    tenant_id:row.tenant_id,
    project_id:row.project_id,
    strategy:row.strategy,
    context_key:row.context_key||'default',
    evidence:impressions,
    confidence,
    qualification_rate:qualificationRate,
    appointment_rate:appointmentRate,
    sale_rate:saleRate,
    revenue_per_qualified:revenuePerQualified,
    fitness:raw*confidence,
    eligible_for_learning:impressions>=minEvidence
  };
}

export function rankStrategies(rows=[],options={}){
  return rows
    .map(r=>strategyFitness(r,options))
    .sort((a,b)=>b.fitness-a.fitness);
}

export function evolutionRecommendation(rows=[],options={}){
  const ranked=rankStrategies(rows,options);
  const proven=ranked.filter(x=>x.eligible_for_learning);
  if(!proven.length) return {action:'observe',reason:'insufficient_evidence',automatic_change:false,ranked};

  return {
    action:'review_for_reinforcement',
    strategy:proven[0].strategy,
    context_key:proven[0].context_key,
    fitness:proven[0].fitness,
    confidence:proven[0].confidence,
    reason:'best_evidence_weighted_outcome',
    automatic_change:false,
    ranked
  };
}
