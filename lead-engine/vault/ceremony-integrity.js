export function verifyCeremonyInputs(input={}){
 const checks={
  recipientVerified:input.recipientVerified===true,
  consentConfirmed:input.consentConfirmed===true,
  eggIntegrityValid:input.eggIntegrityValid===true,
  founderMediaAuthenticated:input.founderMediaAuthenticated===true,
  correctBranch:input.correctBranch===true
 };
 const failures=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
 return {
  passed:failures.length===0,
  failures,
  mayBegin:failures.length===0,
  bypassAllowed:false
 };
}

export function replayPolicy(){
 return {firstAwakeningUnique:true,replayClearlyMarked:true,historyMayNotBeRewritten:true};
}
