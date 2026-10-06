export function legacyHealth(input={}){
 const dimensions={
  dnaReadable:input.dnaReadable===true,
  eggsVerified:input.eggsVerified===true,
  founderMediaVerified:input.founderMediaVerified===true,
  offlineRecoveryTested:input.offlineRecoveryTested===true,
  formatsCurrent:input.formatsCurrent===true,
  guardianChainReviewed:input.guardianChainReviewed===true
 };
 const score=Object.values(dimensions).filter(Boolean).length/Object.keys(dimensions).length;
 return {
  dimensions,
  score:Number(score.toFixed(2)),
  state:score===1?"healthy":score>=0.67?"attention":"at_risk",
  automaticMutation:false
 };
}
