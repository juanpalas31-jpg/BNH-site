import { clusterPerformance } from "./cluster-performance.js";

export function contentNextAction(row={},minViews=100){
  const p=clusterPerformance(row);
  if(p.views<minViews) return {cluster:p.cluster,action:"observe",reason:"insufficient_evidence",automatic_publish:false};
  if(p.engagement_rate<0.15) return {cluster:p.cluster,action:"review_search_intent",reason:"low_engagement",automatic_publish:false};
  if(p.cta_rate<0.05) return {cluster:p.cluster,action:"review_contextual_cta",reason:"engaged_but_low_cta",automatic_publish:false};
  if(p.lead_rate<0.01) return {cluster:p.cluster,action:"review_funnel_friction",reason:"clicks_but_few_leads",automatic_publish:false};
  if(p.appointments>0 || p.sales>0) return {cluster:p.cluster,action:"candidate_for_reinforcement",reason:"downstream_outcomes",automatic_publish:false};
  return {cluster:p.cluster,action:"keep_observing",reason:"no_downstream_evidence_yet",automatic_publish:false};
}
