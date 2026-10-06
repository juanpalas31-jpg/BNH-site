import { feedingValue } from './attila-feeding-engine.js';

const amount=v=>Math.max(0,Number(v)||0);

export function assimilateOutcome(input={}){
  const outcome=String(input.outcome||'').toLowerCase();
  const collected=['payment','collected'].includes(outcome)
    ? amount(input.collected_revenue ?? input.amount) : amount(input.collected_revenue);
  const margin=collected>0?amount(input.realized_margin):0;
  const progressed=['qualified','appointment','quote','sale','payment','collected'];
  const feed=feedingValue({
    intent_score:input.intent_score, urgency_score:input.urgency_score, fit_score:input.fit_score,
    reachability_score:input.reachability_score, contact_consent:input.contact_consent,
    qualified:progressed.includes(outcome),
    appointment:['appointment','quote','sale','payment','collected'].includes(outcome),
    quote:['quote','sale','payment','collected'].includes(outcome),
    sale:['sale','payment','collected'].includes(outcome),
    collected_revenue:collected, realized_margin:margin
  });
  return {
    tenant_id:input.tenant_id, project_id:input.project_id, lead_id:input.lead_id,
    source:input.source||'unknown', canal:input.canal||'unknown', campagne:input.campagne||'unknown',
    outcome, ...feed, learning_evidence:true, synthetic:false,
    explanation:collected>0?'REAL_VALUE_ASSIMILATED':'LEARNING_SIGNAL_ONLY'
  };
}

export function foodMemory(outcomes=[]){
  const buckets=new Map();
  for(const raw of outcomes){
    const o=assimilateOutcome(raw);
    const key=[o.tenant_id,o.project_id,o.source,o.canal,o.campagne].join('|');
    const b=buckets.get(key)||{tenant_id:o.tenant_id,project_id:o.project_id,source:o.source,canal:o.canal,campagne:o.campagne,samples:0,collected_revenue:0,realized_margin:0,nutrition_total:0};
    b.samples+=1; b.collected_revenue+=o.assimilated_revenue; b.realized_margin+=o.assimilated_margin; b.nutrition_total+=o.nutrition_score;
    buckets.set(key,b);
  }
  return [...buckets.values()].map(b=>({...b,average_nutrition:Number((b.nutrition_total/b.samples).toFixed(2)),margin_per_sample:b.samples?b.realized_margin/b.samples:0}));
}

export function nextHunt(memory=[],options={}){
  const minSamples=Math.max(3,Number(options.min_samples||5));
  const explorationRate=Math.max(.05,Math.min(.35,Number(options.exploration_rate||.15)));
  const proven=memory.filter(x=>x.samples>=minSamples).map(x=>({...x,hunt_value:(x.average_nutrition*.4)+Math.min(x.margin_per_sample/20,50)*.6})).sort((a,b)=>b.hunt_value-a.hunt_value);
  if(!proven.length) return {action:'EXPLORE',reason:'INSUFFICIENT_REAL_EVIDENCE',exploration_rate:explorationRate,target:null,automatic_change:false};
  return {action:'BALANCED_HUNT',reason:'REAL_OUTCOME_EVIDENCE',exploration_rate:explorationRate,target:proven[0],candidates:proven,automatic_change:false};
}
