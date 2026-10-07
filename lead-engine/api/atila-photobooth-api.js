const COMMANDS=new Set(["PING","SYNC","PLAY_ANIMATION","STOP_ANIMATION","REFRESH_GALLERY","REFRESH_QR"]);

const clean=s=>String(s??"").trim().slice(0,256);

export function createPhotoboothCommand({booth_id="",command="",payload={},owner_verified=false}={}){
 const type=clean(command).toUpperCase();
 if(!owner_verified) return {ok:false,state:"OWNER_PROOF_REQUIRED"};
 if(!clean(booth_id)) return {ok:false,state:"BOOTH_ID_REQUIRED"};
 if(!COMMANDS.has(type)) return {ok:false,state:"COMMAND_NOT_ALLOWED"};

 return {
  ok:true,
  protocol:"ATTILA_PHOTOBOOTH_V1",
  target:{type:"PHOTOBOOTH",id:clean(booth_id)},
  command:type,
  payload:sanitizePayload(payload),
  created_at:new Date().toISOString(),
  requires_device_ack:true,
  destructive:false
 };
}

export function acceptPhotoboothAck({command,ack={}}={}){
 if(!command?.ok||command.protocol!=="ATTILA_PHOTOBOOTH_V1") return {ok:false,state:"INVALID_COMMAND"};
 return {
  ok:Boolean(ack.accepted),
  booth_id:command.target.id,
  command:command.command,
  device_state:clean(ack.state||"UNKNOWN"),
  message:clean(ack.message),
  executed_at:clean(ack.executed_at),
  evidence_id:clean(ack.evidence_id)
 };
}

function sanitizePayload(input){
 const x=input&&typeof input==="object"?input:{};
 return {
  animation_id:clean(x.animation_id),
  asset_url:clean(x.asset_url),
  duration_ms:Number.isFinite(Number(x.duration_ms))?Math.max(0,Math.min(Number(x.duration_ms),300000)):0,
  gallery_id:clean(x.gallery_id),
  qr_target:clean(x.qr_target)
 };
}

export const PHOTOBOOTH_API_CONTRACT=Object.freeze({
 version:"ATTILA_PHOTOBOOTH_V1",
 endpoints:[
  {method:"GET",path:"/api/atila/photobooth/:boothId/status"},
  {method:"POST",path:"/api/atila/photobooth/:boothId/command"},
  {method:"POST",path:"/api/atila/photobooth/:boothId/ack"}
 ],
 auth:"OWNER_OR_REGISTERED_DEVICE",
 device_ack_required:true,
 commands:[...COMMANDS]
});
