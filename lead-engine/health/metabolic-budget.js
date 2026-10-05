/**
 * Spider metabolic budget.
 * Allocates bounded effort according to vitality, evidence and opportunity.
 * Prevents the organism from spending scarce resources everywhere at once.
 */
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));

export function metabolicBudget(input={}){
  const vitality=clamp((input.vitality_score ?? 100)/100);
  const opportunity=clamp(input.opportunity_score ?? 0);
  const evidence=clamp(input.evidence_confidence ?? 0);
  const pressure=clamp(input.resource_pressure ?? 0);

  const survival=clamp((1-vitality)*0.7+pressure*0.5);
  const sensing=clamp(0.20+(1-evidence)*0.35);
  const learning=clamp(vitality*evidence*0.35);
  const hunting=clamp(vitality*opportunity*0.45);
  const growth=clamp(vitality*evidence*opportunity*0.30*(1-pressure));

  const raw={survival,sensing,learning,hunting,growth};
  const total=Object.values(raw).reduce((a,b)=>a+b,0)||1;
  const allocation=Object.fromEntries(
    Object.entries(raw).map(([k,v])=>[k,Number((v/total).toFixed(4))])
  );

  return {
    allocation,
    dominant:Object.entries(allocation).sort((a,b)=>b[1]-a[1])[0][0],
    constraints:{
      paid_ads_required:false,
      destructive_action:false,
      automatic_consequential_contact:false
    }
  };
}

export function shouldEnterConservationMode(input={}){
  return Number(input.vitality_score ?? 100)<60 || Number(input.resource_pressure||0)>=0.8;
}
