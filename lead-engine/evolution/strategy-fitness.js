/**
 * Evidence-weighted Spider Engine strategy fitness.
 * Economic fitness uses collected revenue and realized margin, never traffic alone.
 */
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));

export function strategyFitness(row={},options={}){
 const impressions=Math.max(0,Number(row.impressions||0));
 const qualified=Math.max(0,Number(row.qualified_leads||0));
 const appointments=Math.max(0,Number(row.appointments||0));
 const sales=Math.max(0,Number(row.sales||0));
 const collected=Math.max(0,Number(row.collected_revenue ?? row.revenue ?? 0));
 const margin=Math.max(0,Number(row.realized_margin||0));
 const minEvidence=Math.max(1,Number(options.min_evidence||50));

 const qualificationRate=impressions?qualified/impressions:0;
 const appointmentRate=qualified?appointments/qualified:0;
 const saleRate=appointments?sales/appointments:0;
 const collectedPerQualified=qualified?collected/qualified:0;
 const marginPerQualified=qualified?margin/qualified:0;
 const confidence=clamp(impressions/minEvidence);

 const raw=
   clamp(qualificationRate/.10)*.20+
   clamp(appointmentRate/.35)*.20+
   clamp(saleRate/.25)*.20+
   clamp(collectedPerQualified/1000)*.20+
   clamp(marginPerQualified/500)*.20;

 return {
  tenant_id:row.tenant_id,project_id:row.project_id,strategy:row.strategy,
  context_key:row.context_key||'default',evidence:impressions,confidence,
  qualification_rate:qualificationRate,appointment_rate:appointmentRate,sale_rate:saleRate,
  collected_revenue_per_qualified:collectedPerQualified,margin_per_qualified:marginPerQualified,
  fitness:raw*confidence,eligible_for_learning:impressions>=minEvidence
 };
}

export function rankStrategies(rows=[],options={}){
 return rows.map(r=>strategyFitness(r,options)).sort((a,b)=>b.fitness-a.fitness);
}

export function evolutionRecommendation(rows=[],options={}){
 const ranked=rankStrategies(rows,options);
 const proven=ranked.filter(x=>x.eligible_for_learning);
 if(!proven.length) return {action:'observe',reason:'insufficient_evidence',automatic_change:false,exploration_required:true,ranked};
 return {
  action:'review_for_reinforcement',strategy:proven[0].strategy,context_key:proven[0].context_key,
  fitness:proven[0].fitness,confidence:proven[0].confidence,
  reason:'best_real_economic_outcome',automatic_change:false,exploration_required:true,ranked
 };
}
