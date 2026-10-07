export function validatePhotoboothAdapter(adapter={}){
 const required=["getStatus","sendCommand","getAcknowledgement"];
 const missing=required.filter(k=>typeof adapter[k]!=="function");
 return {ok:missing.length===0,missing};
}

export async function executeThroughAdapter({adapter,queued}={}){
 const check=validatePhotoboothAdapter(adapter);
 if(!check.ok) return {ok:false,state:"ADAPTER_INCOMPLETE",missing:check.missing};
 if(!queued?.ok) return {ok:false,state:"VALIDATED_COMMAND_REQUIRED"};

 const status=await adapter.getStatus(queued.item.booth_id);
 if(!status?.reachable) return {ok:false,state:"BOOTH_UNREACHABLE",status};

 const sent=await adapter.sendCommand(queued.item);
 if(!sent?.accepted) return {ok:false,state:"SERVER_REJECTED_COMMAND",sent};

 const ack=await adapter.getAcknowledgement(queued.item.command_id);
 return {ok:Boolean(ack?.accepted),state:ack?.accepted?"EXECUTED":"ACK_PENDING",status,sent,ack};
}

/*
 The concrete adapter is intentionally absent until the owner's real
 photobooth protocol is observed. Do not guess URLs, tokens or payloads.
*/
