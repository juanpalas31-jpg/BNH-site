const REQUIRED=["identityVerified","milestoneReached","integrityVerified","recipientConsent"];

export function directHatch(context={}){
  const missing=REQUIRED.filter(k=>context[k]!==true);
  if(missing.length) return {mode:"sealed",missing,next:"wait"};
  const founderAvailable=context.founderAvailable===true;
  return {
    mode:"ceremony_ready",
    opening:founderAvailable?"founder_live_or_prepared":"founder_prepared",
    sequence:["boot","lineage_check","recipient_greeting","founder_message","reveal","bonding"],
    adaptiveMedia:true,
    skipAndPause:true
  };
}
