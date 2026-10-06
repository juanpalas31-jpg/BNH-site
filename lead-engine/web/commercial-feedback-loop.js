import { rankClusters } from "../content/cluster-performance.js";
import { contentNextAction } from "../content/content-next-action.js";

export function commercialFeedbackLoop(rows=[], options={}){
  const minViews=Number(options.minViews)||100;
  const ranked=rankClusters(rows);
  return {
    generated_at:new Date().toISOString(),
    objective:"qualified_business_outcomes_over_raw_traffic",
    ranking:ranked,
    recommendations:ranked.map(row=>contentNextAction(row,minViews)),
    safeguards:{
      synthetic_history:false,
      automatic_publication:false,
      automatic_contact:false,
      automatic_budget_change:false,
      human_review_required:true
    }
  };
}
