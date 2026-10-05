/**
 * Privacy-safe Spider Engine learning core.
 * Learns from aggregate acquisition outcomes, never by copying tenant customer data.
 */
export function aggregatePerformance(records = []) {
  const buckets = new Map();

  for (const r of records) {
    const key = [r.tenant_id, r.project_id, r.source || 'unknown', r.canal || 'unknown', r.campagne || 'unknown'].join('|');
    const b = buckets.get(key) || {
      tenant_id: r.tenant_id,
      project_id: r.project_id,
      source: r.source || 'unknown',
      canal: r.canal || 'unknown',
      campagne: r.campagne || 'unknown',
      leads: 0, rdv: 0, sales: 0, revenue: 0
    };
    b.leads += r.record_type === 'lead' ? 1 : 0;
    b.rdv += r.rdv ? 1 : 0;
    b.sales += r.sale ? 1 : 0;
    b.revenue += Number(r.ca_signe || 0) || 0;
    buckets.set(key, b);
  }

  return [...buckets.values()].map(b => ({
    ...b,
    rdv_rate: b.leads ? b.rdv / b.leads : 0,
    sale_rate: b.leads ? b.sales / b.leads : 0,
    revenue_per_lead: b.leads ? b.revenue / b.leads : 0
  }));
}

export function rankThreads(metrics = [], minimumLeads = 5) {
  return metrics
    .filter(m => m.leads >= minimumLeads)
    .map(m => ({
      ...m,
      score: (m.sale_rate * 0.5) + (m.rdv_rate * 0.3) + (Math.min(m.revenue_per_lead, 1000) / 1000 * 0.2)
    }))
    .sort((a, b) => b.score - a.score);
}
