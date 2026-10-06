export function learningGate({samples=0,verifiedOutcomes=0,lift=0,confidence=0}={}){
 const pass=samples>=100&&verifiedOutcomes>=5&&lift>=0.10&&confidence>=0.80;
 return {
  pass,
  decision:pass?"ELIGIBLE_FOR_HUMAN_REVIEW":"KEEP_OBSERVING",
  dnaMutationAutomatic:false,
  publicChangeAutomatic:false
 };
}
