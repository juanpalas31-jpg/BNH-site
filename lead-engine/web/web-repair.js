import { weakPoints } from "./thread-graph.js";

export function proposeWebRepairs(graph, performance=[]){
  const weak=weakPoints(graph);
  const perf=new Map(performance.map(x=>[x.id,x]));
  const proposals=[];

  for(const id of weak.orphans||[]) proposals.push({
    type:"connect_orphan",node:id,priority:"high",
    reason:"organic page has no usable thread",automatic_change:false
  });
  for(const id of weak.deadEnds||[]) proposals.push({
    type:"add_next_step",node:id,priority:"medium",
    reason:"visitor path ends without a useful next step",automatic_change:false
  });
  for(const [id,p] of perf){
    if((p.views||0)>=100 && (p.engagement_rate||0)>=0.2 && (p.cta_rate||0)<0.03)
      proposals.push({type:"review_contextual_cta",node:id,priority:"high",reason:"engagement_without_progression",automatic_change:false});
    if((p.views||0)>=100 && (p.cta_rate||0)>=0.05 && (p.lead_rate||0)<0.01)
      proposals.push({type:"inspect_funnel_friction",node:id,priority:"high",reason:"intent_without_lead",automatic_change:false});
  }
  return proposals;
}
