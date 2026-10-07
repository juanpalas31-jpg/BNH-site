const bool=v=>v===true;
const known=v=>v!==undefined&&v!==null&&v!=="";

export function assessEventReadiness(signal={}){
 const checks=[
  ["booth_online",bool(signal.booth_online),"Borne joignable"],
  ["app_online",bool(signal.app_online),"Application active"],
  ["camera_ready",bool(signal.camera_ready),"Appareil photo disponible"],
  ["printer_ready",bool(signal.printer_ready),"Imprimante disponible"],
  ["network_ready",bool(signal.network_ready),"Connexion disponible"],
  ["animation_ready",bool(signal.animation_ready),"Animation synchronisee"],
  ["queue_clear",Number(signal.pending_uploads||0)===0,"File d'envoi vide"]
 ].map(([id,pass,label])=>({id,label,pass,observed:known(signal[id])||id==="queue_clear"}));

 const missing=checks.filter(x=>!x.observed).map(x=>x.id);
 const failed=checks.filter(x=>x.observed&&!x.pass).map(x=>x.id);
 const critical=["booth_online","app_online","camera_ready"].some(id=>failed.includes(id));

 let verdict="GREEN";
 if(missing.length) verdict="ORANGE";
 if(failed.length) verdict=critical?"RED":"ORANGE";

 return {
  protocol:"ATTILA_PHOTOBOOTH_READINESS_V1",
  verdict,
  ready:verdict==="GREEN",
  checks,missing,failed,
  rule:"GREEN_REQUIRES_ALL_REQUIRED_SIGNALS_OBSERVED_AND_PASSING",
  generated_at:new Date().toISOString()
 };
}

export function prepareEventMission({booth_id,event_id="",animation_id="",owner_verified=false}={}){
 if(!owner_verified) return {ok:false,state:"OWNER_PROOF_REQUIRED"};
 if(!String(booth_id).trim()) return {ok:false,state:"BOOTH_ID_REQUIRED"};
 return {
  ok:true,
  mission:"PHOTOBOOTH_EVENT_PREP",
  booth_id:String(booth_id).trim(),
  event_id:String(event_id).trim(),
  animation_id:String(animation_id).trim(),
  sequence:["PING","READ_STATUS","SYNC","VERIFY_ANIMATION","VERIFY_CAMERA","VERIFY_PRINTER","VERIFY_NETWORK","VERIFY_QUEUE","ASSESS_READINESS"],
  automatic_destructive_action:false,
  physical_intervention_escalates_to_owner:true
 };
}
