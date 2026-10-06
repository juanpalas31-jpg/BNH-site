const REQUIRED=["power","compute","archive","ceremony","recovery"];

export function evaluateVaultContinuity(status={}){
 const missing=REQUIRED.filter(k=>status[k]!=="ready");
 return {
  ready:missing.length===0,
  missing,
  ceremonyAllowed:missing.length===0,
  degradedMode:missing.length>0,
  fallback:"authenticated_offline_recovery"
 };
}

export function continuityRule(){
 return {
  vaultMayFail:true,
  lineageMustSurvive:true,
  singlePointOfFailure:false,
  destructiveAutomaticActions:false
 };
}
