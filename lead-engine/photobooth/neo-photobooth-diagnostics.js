export function spawnPhotoboothDiagnostics({booth_id="",authorized=false}={}){
 if(!authorized) return {ok:false,state:"AUTHORIZATION_REQUIRED"};
 const id=String(booth_id).trim();
 if(!id) return {ok:false,state:"BOOTH_ID_REQUIRED"};

 return {
  ok:true,
  protocol:"NEO_PHOTOBOOTH_DIAGNOSTICS_V1",
  booth_id:id,
  workers:[
   {neo:"NEO-NET",task:"CHECK_NETWORK",mode:"READ_ONLY"},
   {neo:"NEO-APP",task:"CHECK_APPLICATION",mode:"READ_ONLY"},
   {neo:"NEO-CAMERA",task:"CHECK_CAMERA",mode:"READ_ONLY"},
   {neo:"NEO-PRINT",task:"CHECK_PRINTER",mode:"READ_ONLY"},
   {neo:"NEO-SYNC",task:"CHECK_SYNC_AND_QUEUE",mode:"READ_ONLY"}
  ],
  aggregation:"ATTILA",
  lifecycle:"EPHEMERAL",
  privilege_escalation:false,
  arbitrary_execution:false
 };
}
