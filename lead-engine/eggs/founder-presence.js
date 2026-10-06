export function selectFounderPresence(capabilities=[],manifest={}){
 const c=new Set(capabilities);
 const authenticated=manifest.authenticatedSource===true;
 if(!authenticated) return {mode:"blocked",reason:"founder_source_not_authenticated"};
 if(c.has("holographic_spatial")) return {mode:"holographic_spatial",fallback:false};
 if(c.has("ar_vr")) return {mode:"ar_vr",fallback:true};
 if(c.has("screen_audio")) return {mode:"screen_spatial_audio",fallback:true};
 return {mode:"audio_text_safe",fallback:true};
}

export function founderPresencePolicy(){
 return Object.freeze({
  recipientSpecific:true,
  inventedFounderStatements:false,
  syntheticReconstructionRequiresAuthorization:true,
  syntheticMaterialDisclosed:true,
  preserveOriginalCapture:true
 });
}
