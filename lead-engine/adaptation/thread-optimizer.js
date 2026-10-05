export function proposeThreadAdjustments(metrics = [], options = {}) {
  const minLeads = Number(options.min_leads || 20);
  const proposals = [];

  for (const m of metrics) {
    if (Number(m.leads || 0) < minLeads) continue;

    const saleRate = Number(m.sale_rate || 0);
    const rdvRate = Number(m.rdv_rate || 0);

    if (rdvRate < 0.08) {
      proposals.push({
        tenant_id: m.tenant_id, project_id: m.project_id,
        source: m.source, canal: m.canal, campagne: m.campagne,
        hypothesis: 'qualification_or_cta_friction',
        recommended_test: 'test_cta_or_simulator_path',
        automatic_change: false
      });
    } else if (saleRate < 0.03) {
      proposals.push({
        tenant_id: m.tenant_id, project_id: m.project_id,
        source: m.source, canal: m.canal, campagne: m.campagne,
        hypothesis: 'lead_quality_or_offer_mismatch',
        recommended_test: 'review_offer_and_qualification',
        automatic_change: false
      });
    }
  }

  return proposals;
}

export function canPromoteExperiment(experiment) {
  return Boolean(
    experiment &&
    experiment.control_samples >= 30 &&
    experiment.variant_samples >= 30 &&
    experiment.variant_conversion_rate > experiment.control_conversion_rate &&
    experiment.reviewed === true
  );
}
