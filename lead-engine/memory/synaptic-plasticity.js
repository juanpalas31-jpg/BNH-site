/**
 * Spider synapse layer.
 * Learns bounded associations between aggregate signals and outcomes.
 * It changes recommendation strength, never policy or immutable DNA.
 */
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));

export function synapticWeight(edge={},options={}){
  const observations=Math.max(0,Number(edge.observations||0));
  const successes=Math.max(0,Number(edge.successes||0));
  const minEvidence=Math.max(10,Number(options.min_evidence||50));
  const prior=Math.max(1,Number(options.prior_strength||10));
  const priorRate=clamp(options.prior_rate??0.1);

  // Beta-style shrinkage prevents tiny samples from creating extreme weights.
  const posterior=(successes+prior*priorRate)/(observations+prior);
  const confidence=clamp(observations/minEvidence);
  return {
    from:edge.from||'unknown_signal',
    to:edge.to||'unknown_outcome',
    observations,
    successes,
    posterior_rate:posterior,
    confidence,
    weight:posterior*confidence,
    plastic:edge.immutable!==true
  };
}

export function reinforce(edge={},outcome={},options={}){
  if(edge.immutable===true) return {...edge,changed:false,reason:'immutable_edge'};
  const next={
    ...edge,
    observations:Math.max(0,Number(edge.observations||0))+1,
    successes:Math.max(0,Number(edge.successes||0))+(outcome.success===true?1:0)
  };
  return {...next,changed:true,metrics:synapticWeight(next,options)};
}

export function pruneSynapses(edges=[],options={}){
  const minObservations=Math.max(20,Number(options.min_observations||100));
  const minWeight=Math.max(0,Number(options.min_weight||0.02));
  return edges.map(e=>{
    const m=synapticWeight(e,options);
    return {
      ...e,
      metrics:m,
      prune_candidate:e.immutable!==true && m.observations>=minObservations && m.weight<minWeight,
      automatic_prune:false
    };
  });
}
