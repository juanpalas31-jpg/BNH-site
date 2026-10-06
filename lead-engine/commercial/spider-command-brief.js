export function commandBrief({threads=[],weakest=null,period="current"}={}){
 const top=[...threads].sort((a,b)=>Number(b.verifiedRevenue||0)-Number(a.verifiedRevenue||0))[0]||null;
 return {
  period,
  northStar:"verified_revenue_from_qualified_organic_demand",
  topRevenueThread:top,
  weakestTransition:weakest,
  priorities:[
   top?"protect_and_learn_from_top_thread":"collect_verified_outcomes",
   weakest?"repair_weakest_transition":"measure_full_funnel",
   "avoid_vanity_traffic_optimization"
  ],
  automaticSpend:false,
  automaticPublication:false
 };
}
