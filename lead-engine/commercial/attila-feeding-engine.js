const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)||0));
const yes=v=>[true,1,"1","true","oui","yes"].includes(typeof v==="string"?v.toLowerCase():v);

export const ATTILA_FEED_STAGES=Object.freeze([
  "HUNGER","HUNT","DETECT","CAPTURE","QUALIFY","SCORE","PRIORITIZE",
  "CONVERT","ASSIMILATE","LEARN","ADAPT","HUNT_AGAIN"
]);

export function scoreLeadNutrition(lead={}){
  const intent=clamp(lead.intent_score ?? lead.intent ?? 0);
  const urgency=clamp(lead.urgency_score ?? lead.urgency ?? 0);
  const fit=clamp(lead.fit_score ?? lead.fit ?? 0);
  const reachable=clamp(lead.reachability_score ?? (lead.telephone||lead.email?70:0));
  const consent=yes(lead.contact_consent);
  const qualified=yes(lead.qualified);
  const appointment=yes(lead.appointment);
  const quote=yes(lead.quote);
  const sale=yes(lead.sale);
  const collected=Math.max(0,Number(lead.collected_revenue||0));
  const margin=Math.max(0,Number(lead.realized_margin||0));

  const capture=(intent*.25)+(urgency*.20)+(fit*.30)+(reachable*.15)+(consent?10:0);
  const progression=(qualified?10:0)+(appointment?15:0)+(quote?20:0)+(sale?30:0);
  const economic=Math.min(25,(collected/500)+(margin/250));
  const nutrition=clamp(capture*.55+progression+economic);

  return {
    nutrition_score:Number(nutrition.toFixed(2)),
    quality_band:nutrition>=80?"PREMIUM":nutrition>=60?"HIGH":nutrition>=40?"MEDIUM":"LOW",
    signals:{intent,urgency,fit,reachable,consent,qualified,appointment,quote,sale,collected_revenue:collected,realized_margin:margin},
    synthetic:false
  };
}

export function feedingValue(lead={}){
  const scored=scoreLeadNutrition(lead);
  // Money only counts after real collection; a click alone never counts as assimilation.
  const assimilated_revenue=Math.max(0,Number(lead.collected_revenue||0));
  const assimilated_margin=Math.max(0,Number(lead.realized_margin||0));
  return {...scored,assimilated_revenue,assimilated_margin,assimilated:assimilated_revenue>0||assimilated_margin>0};
}

export function capacityState({open_leads=0,capacity=1}={}){
  const cap=Math.max(1,Number(capacity)||1);
  const load=Math.max(0,Number(open_leads)||0)/cap;
  return {
    load:Number(load.toFixed(3)),
    state:load>=1?"SATURATED":load>=.8?"DIGESTING":"HUNGRY",
    acquisition_bias:load>=1?"CONVERT_EXISTING":load>=.8?"BALANCE":"HUNT"
  };
}

export function feedQualityIndex(leads=[]){
  if(!leads.length) return {fqi:0,count:0,assimilated_revenue:0,assimilated_margin:0};
  const rows=leads.map(feedingValue);
  const avg=rows.reduce((s,r)=>s+r.nutrition_score,0)/rows.length;
  return {
    fqi:Number(avg.toFixed(2)),
    count:rows.length,
    assimilated_revenue:rows.reduce((s,r)=>s+r.assimilated_revenue,0),
    assimilated_margin:rows.reduce((s,r)=>s+r.assimilated_margin,0)
  };
}

export function attilaDecision({leads=[],open_leads=0,capacity=1}={}){
  const quality=feedQualityIndex(leads);
  const capacity_status=capacityState({open_leads,capacity});
  const ranked=leads.map(lead=>({...lead,...feedingValue(lead)}))
    .sort((a,b)=>b.nutrition_score-a.nutrition_score);
  return {
    organism:"ATTILA",
    doctrine:"FEED_QUALIFY_CONVERT_ASSIMILATE_LEARN_HUNT_BETTER",
    stages:ATTILA_FEED_STAGES,
    hunger:capacity_status.state,
    hunt_mode:capacity_status.acquisition_bias,
    feed_quality:quality,
    priority_prey:ranked[0]||null,
    ranked_prey:ranked,
    rule:"QUALITY_AND_REAL_VALUE_OVER_RAW_VOLUME",
    automatic_contact:false,
    autonomous_high_risk_action:false
  };
}
