/**
 * Privacy-safe Spider Engine learning core.
 * Signed value and collected value are intentionally separated.
 */
export function aggregatePerformance(records = []) {
  const buckets = new Map();
  for (const r of records) {
    const key=[r.tenant_id,r.project_id,r.source||'unknown',r.canal||'unknown',r.campagne||'unknown'].join('|');
    const b=buckets.get(key)||{tenant_id:r.tenant_id,project_id:r.project_id,source:r.source||'unknown',canal:r.canal||'unknown',campagne:r.campagne||'unknown',leads:0,rdv:0,sales:0,signed_revenue:0,collected_revenue:0,realized_margin:0};
    b.leads+=r.record_type==='lead'?1:0;
    b.rdv+=r.rdv?1:0;
    b.sales+=r.sale?1:0;
    b.signed_revenue+=Math.max(0,Number(r.ca_signe ?? r.signedRevenue ?? 0)||0);
    b.collected_revenue+=Math.max(0,Number(r.ca_encaisse ?? r.collectedRevenue ?? 0)||0);
    b.realized_margin+=Math.max(0,Number(r.marge_reelle ?? r.realizedMargin ?? 0)||0);
    buckets.set(key,b);
  }
  return [...buckets.values()].map(b=>({
    ...b,
    revenue:b.collected_revenue,
    rdv_rate:b.leads?b.rdv/b.leads:0,
    sale_rate:b.leads?b.sales/b.leads:0,
    signed_revenue_per_lead:b.leads?b.signed_revenue/b.leads:0,
    collected_revenue_per_lead:b.leads?b.collected_revenue/b.leads:0,
    margin_per_lead:b.leads?b.realized_margin/b.leads:0
  }));
}

export function rankThreads(metrics = [], minimumLeads = 5) {
  return metrics.filter(m=>m.leads>=minimumLeads).map(m=>{
    const collectedPerLead=Number(m.collected_revenue_per_lead ?? m.revenue_per_lead ?? 0);
    const marginPerLead=Number(m.margin_per_lead||0);
    return {...m,score:(m.sale_rate*.35)+(m.rdv_rate*.2)+(Math.min(collectedPerLead,1000)/1000*.25)+(Math.min(marginPerLead,500)/500*.2)};
  }).sort((a,b)=>b.score-a.score);
}
