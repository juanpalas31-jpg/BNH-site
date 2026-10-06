export function mapJourneyToStrategyOutcome(journey={}){
  const impressions=Math.max(0,Number(journey.views)||0);
  const qualified=Math.max(0,Number(journey.qualified_leads ?? journey.form_submits)||0);
  const appointments=Math.max(0,Number(journey.appointments)||0);
  const sales=Math.max(0,Number(journey.sales)||0);
  const revenue=Math.max(0,Number(journey.revenue)||0);
  return {
    tenant_id:journey.tenant_id||"bnh",
    project_id:journey.project_id||"bnh-site",
    strategy_id:journey.strategy_id||journey.cluster||"unknown",
    period_start:journey.period_start||null,
    period_end:journey.period_end||null,
    impressions,
    qualified_leads:qualified,
    appointments,
    sales,
    revenue,
    source:"measured_funnel_attribution",
    synthetic:false
  };
}

export function validateOutcome(outcome={}){
  const errors=[];
  if(!outcome.strategy_id||outcome.strategy_id==="unknown") errors.push("strategy_id_required");
  if(outcome.synthetic!==false) errors.push("real_data_only");
  for(const k of ["impressions","qualified_leads","appointments","sales","revenue"])
    if(!Number.isFinite(Number(outcome[k]))||Number(outcome[k])<0) errors.push(`${k}_invalid`);
  if(Number(outcome.qualified_leads)>Number(outcome.impressions)) errors.push("qualified_exceeds_impressions");
  if(Number(outcome.appointments)>Number(outcome.qualified_leads)) errors.push("appointments_exceed_qualified");
  if(Number(outcome.sales)>Number(outcome.appointments)) errors.push("sales_exceed_appointments");
  return {valid:errors.length===0,errors};
}
