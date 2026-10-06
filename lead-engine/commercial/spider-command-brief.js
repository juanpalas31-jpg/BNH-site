import { attilaDecision } from './attila-feeding-engine.js';
import { foodMemory, nextHunt } from './attila-assimilation.js';
import { reviewMetrics } from '../observability/review-metrics.js';

export function commandBrief({threads=[],weakest=null,period='current',leads=[],outcomes=[],events=[],open_leads=0,capacity=1}={}){
 const top=[...threads].sort((a,b)=>Number(b.collectedRevenue??b.verifiedRevenue??0)-Number(a.collectedRevenue??a.verifiedRevenue??0))[0]||null;
 const memory=foodMemory(outcomes);
 const hunt=nextHunt(memory);
 const attila=attilaDecision({leads,open_leads,capacity});
 const reviews=reviewMetrics(events);
 const reviewAlert=reviews.unmatched_reviews>0?'REVIEW_LINKAGE_REQUIRED':reviews.scans>0&&reviews.reviews===0?'REVIEWS_PENDING':'OK';

 return {
  period,northStar:'collected_revenue_and_realized_margin_from_qualified_demand',
  topRevenueThread:top,weakestTransition:weakest,
  attila:{
   state:attila.hunger,hunt_mode:attila.hunt_mode,feed_quality_index:attila.feed_quality.fqi,
   assimilated_revenue:attila.feed_quality.assimilated_revenue,assimilated_margin:attila.feed_quality.assimilated_margin,
   priority_prey:attila.priority_prey,next_hunt:hunt,explanation:hunt.reason
  },
  reviews:{...reviews,status:reviewAlert},
  spider_pulse:{
   review_system:reviewAlert,
   duplicate_review_events:reviews.duplicate_events_ignored,
   unmatched_reviews:reviews.unmatched_reviews
  },
  priorities:[
   reviews.unmatched_reviews>0?'repair_review_linkage':null,
   attila.hunt_mode==='CONVERT_EXISTING'?'digest_and_convert_open_pipeline':'hunt_high_quality_demand',
   top?'protect_and_learn_from_top_thread':'collect_verified_outcomes',
   weakest?'repair_weakest_transition':'measure_full_funnel'
  ].filter(Boolean),
  guardrails:{avoid_vanity_traffic_optimization:true,automaticSpend:false,automaticPublication:false,automaticConsequentialContact:false}
 };
}
