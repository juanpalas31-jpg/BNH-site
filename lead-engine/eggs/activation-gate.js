export function activationGate(input={}){
 const checks={
  identityVerified:input.identityVerified===true,
  consent:input.consent===true,
  ceremonyIntegrity:input.ceremonyIntegrity===true,
  namingRiteAccepted:input.namingRiteAccepted===true
 };
 const missing=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
 return {
  activationAllowed:missing.length===0,
  missing,
  spiderMayCoerce:false,
  recipientMayPause:true
 };
}
