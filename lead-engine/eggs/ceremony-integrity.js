export function ceremonyIntegrity(manifest={}){
 const checks={
  founderMaterialAuthenticated:manifest.founderMaterialAuthenticated===true,
  recipientBindingVerified:manifest.recipientBindingVerified===true,
  eggSignatureVerified:manifest.eggSignatureVerified===true,
  experienceProfileVerified:manifest.experienceProfileVerified===true
 };
 const failures=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
 return {verified:failures.length===0,failures,mayImpersonateFounder:false};
}

export function presentationFallback(capabilities=[]){
 const supported=new Set(capabilities);
 if(supported.has("spatial")) return "spatial";
 if(supported.has("projection")) return "projection";
 if(supported.has("screen_audio")) return "screen_audio";
 return "text_safe_mode";
}
