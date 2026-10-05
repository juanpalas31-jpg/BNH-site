const STRATEGIES={
  web:{name:'web',mode:'persistent_presence',action:'serve_relevant_content'},
  ambush:{name:'ambush',mode:'high_intent_wait',action:'surface_contextual_offer'},
  pursuit:{name:'pursuit',mode:'active_opportunity',action:'prioritize_for_review'},
  interception:{name:'interception',mode:'decision_moment',action:'surface_simulator_or_booking'},
  observe:{name:'observe',mode:'signal_collection',action:'learn_without_contact'}
};

export function selectHuntStrategy(signal={}){
  const score=Number(signal.score||0);
  const event=signal.event||signal.last_event||'';
  if(['form_submit','booking_intent'].includes(event)||score>=15) return STRATEGIES.interception;
  if(['simulator_complete','form_start'].includes(event)||score>=8) return STRATEGIES.ambush;
  if(signal.opportunity===true&&score>=4) return STRATEGIES.pursuit;
  if(['page_view','content_engaged','simulator_start'].includes(event)) return STRATEGIES.web;
  return STRATEGIES.observe;
}

export function strategyDecision(signal={}){
  const strategy=selectHuntStrategy(signal);
  return {strategy:strategy.name,mode:strategy.mode,recommended_action:strategy.action,automatic_contact:false};
}
