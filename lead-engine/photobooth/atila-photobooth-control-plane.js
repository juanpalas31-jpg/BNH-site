const ALLOWED=new Set(["PING","SYNC","PLAY_ANIMATION","STOP_ANIMATION","REFRESH_GALLERY","REFRESH_QR","RESTART_APP"]);

const txt=(v,n=256)=>String(v??"").trim().slice(0,n);

export function registerBooth({booth_id,name="",owner_verified=false}={}){
 if(!owner_verified) return {ok:false,state:"OWNER_PROOF_REQUIRED"};
 const id=txt(booth_id,128);
 if(!id) return {ok:false,state:"BOOTH_ID_REQUIRED"};
 return {ok:true,booth:{id,name:txt(name,80),trust:"OWNER_REGISTERED",enabled:true}};
}

export function queueBoothCommand({booth,command,payload={},owner_verified=false}={}){
 if(!owner_verified) return {ok:false,state:"OWNER_PROOF_REQUIRED"};
 if(!booth?.enabled||booth.trust!=="OWNER_REGISTERED") return {ok:false,state:"UNTRUSTED_BOOTH"};
 const type=txt(command,40).toUpperCase();
 if(!ALLOWED.has(type)) return {ok:false,state:"COMMAND_NOT_ALLOWED"};
 const command_id=`pb-${Date.now()}-${Math.random().toString(36).slice(2,10)}`;
 return {
  ok:true,
  item:{
   command_id,booth_id:booth.id,type,payload,
   state:"QUEUED",created_at:new Date().toISOString(),
   expires_in_sec:300,requires_ack:true
  }
 };
}

export function acknowledgeBoothCommand({queued,device_id="",accepted=false,evidence={}}={}){
 if(!queued?.ok||queued.item?.state!=="QUEUED") return {ok:false,state:"INVALID_QUEUE_ITEM"};
 if(txt(device_id,128)!==queued.item.booth_id) return {ok:false,state:"DEVICE_MISMATCH"};
 return {
  ok:Boolean(accepted),
  command_id:queued.item.command_id,
  booth_id:queued.item.booth_id,
  state:accepted?"ACKNOWLEDGED":"REJECTED",
  evidence:{
   device_state:txt(evidence.device_state,80),
   message:txt(evidence.message,256),
   observed_at:txt(evidence.observed_at,64)
  }
 };
}

export const PHOTOBOOTH_CONTROL_POLICY=Object.freeze({
 outbound_only_to_registered_booths:true,
 owner_gate:true,
 ack_required:true,
 arbitrary_shell:false,
 arbitrary_file_execution:false,
 credential_extraction:false,
 allowed_commands:[...ALLOWED]
});
