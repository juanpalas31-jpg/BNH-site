const ORDER=["dormant","recipient_recognition","authorization","awakening","personal_greeting","founder_message","hatch","spider_bonding","legacy_unlock"];

export function nextHatchState(current, checks={}) {
  const i=ORDER.indexOf(current);
  if(i<0) return {state:"dormant",blocked:true,reason:"unknown_state"};
  if(["recipient_recognition","authorization"].includes(ORDER[Math.min(i+1,ORDER.length-1)])){
    if(checks.identityVerified!==true) return {state:current,blocked:true,reason:"identity_not_verified"};
  }
  if(current==="authorization" && checks.recipientConsent!==true)
    return {state:current,blocked:true,reason:"recipient_consent_required"};
  return {state:ORDER[Math.min(i+1,ORDER.length-1)],blocked:false};
}

export function buildGreeting({recipientLabel,founderMessageRef,experienceProfileRef}={}){
  if(!recipientLabel||!founderMessageRef) throw new Error("recipient_and_founder_message_required");
  return {
    recipientLabel,
    founderMessageRef,
    experienceProfileRef:experienceProfileRef||null,
    generatedFounderQuote:false,
    cinematicPresentation:true,
    skippable:true
  };
}
