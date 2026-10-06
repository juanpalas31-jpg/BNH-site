export function proposeThreadAdjustments(metrics=[],options={}){
 const minLeads=Number(options.min_leads||20), proposals=[];
 for(const m of metrics){
  if(Number(m.leads||0)<minLeads) continue;
  const saleRate=Number(m.sale_rate||0),rdvRate=Number(m.rdv_rate||0);
  const collectedPerLead=Number(m.collected_revenue_per_lead||0);
  const marginPerLead=Number(m.margin_per_lead||0);
  let hypothesis=null,recommended_test=null;
  if(rdvRate<.08){hypothesis='qualification_or_cta_friction';recommended_test='test_cta_or_simulator_path';}
  else if(saleRate<.03){hypothesis='lead_quality_or_offer_mismatch';recommended_test='review_offer_and_qualification';}
  else if(collectedPerLead<=0){hypothesis='signed_value_not_converting_to_cash';recommended_test='review_payment_and_collection_path';}
  else if(marginPerLead<=0){hypothesis='revenue_without_verified_margin';recommended_test='verify_costs_and_margin_capture';}
  if(hypothesis) proposals.push({
    tenant_id:m.tenant_id,project_id:m.project_id,source:m.source,canal:m.canal,campagne:m.campagne,
    hypothesis,recommended_test,evidence:{leads:Number(m.leads||0),rdv_rate:rdvRate,sale_rate:saleRate,collected_revenue_per_lead:collectedPerLead,margin_per_lead:marginPerLead},
    automatic_change:false
  });
 }
 return proposals;
}

export function canPromoteExperiment(experiment){
 return Boolean(experiment&&experiment.control_samples>=30&&experiment.variant_samples>=30&&
 experiment.variant_conversion_rate>experiment.control_conversion_rate&&experiment.reviewed===true);
}
