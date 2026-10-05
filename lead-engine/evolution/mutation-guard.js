/**
 * Evolution guard: prevents Spider Engine from confusing noise with learning.
 * A mutation is only reviewable after enough evidence, stability and measurable lift.
 */
const num=v=>Number(v||0);

export function evaluateMutation(candidate={}, options={}){
  const minSamples=Math.max(20,num(options.min_samples||100));
  const minLift=Math.max(0,num(options.min_lift||0.10));
  const minConfidence=Math.min(1,Math.max(0,num(options.min_confidence||0.80)));

  const controlSamples=num(candidate.control_samples);
  const variantSamples=num(candidate.variant_samples);
  const controlFitness=num(candidate.control_fitness);
  const variantFitness=num(candidate.variant_fitness);
  const confidence=num(candidate.confidence);
  const lift=controlFitness>0?(variantFitness-controlFitness)/controlFitness:0;

  const reasons=[];
  if(controlSamples<minSamples||variantSamples<minSamples) reasons.push('insufficient_samples');
  if(confidence<minConfidence) reasons.push('insufficient_confidence');
  if(lift<minLift) reasons.push('insufficient_lift');
  if(candidate.cross_tenant_data===true) reasons.push('tenant_isolation_violation');
  if(candidate.requires_deception===true) reasons.push('policy_violation');

  const reviewable=reasons.length===0;
  return {
    mutation_id:candidate.mutation_id||null,
    reviewable,
    decision:reviewable?'human_review_required':'keep_observing',
    lift,
    confidence,
    reasons,
    automatic_promotion:false,
    automatic_contact:false
  };
}

export function selectSurvivors(candidates=[],options={}){
  return candidates
    .map(c=>({...c,evaluation:evaluateMutation(c,options)}))
    .filter(c=>c.evaluation.reviewable)
    .sort((a,b)=>b.evaluation.lift-a.evaluation.lift);
}
