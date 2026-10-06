export function publicationGate(input={}){
 const checks={
  usefulContent:input.usefulContent===true,
  claimsSourced:input.claimsSourced===true,
  noFakeUrgency:input.noFakeUrgency===true,
  noGuaranteedSavings:input.noGuaranteedSavings===true,
  canonicalReady:input.canonicalReady===true,
  internalLinksReady:input.internalLinksReady===true,
  measurementReady:input.measurementReady===true,
  humanReviewed:input.humanReviewed===true
 };
 const failed=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
 return {publishable:failed.length===0,failed,automaticPublication:false};
}
