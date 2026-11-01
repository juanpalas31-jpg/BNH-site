// Bamak Event read-only integration: reuses the existing photobooth adapter contract.
// Never sends commands to devices. A real adapter must be injected by an authorized caller.
import {validatePhotoboothAdapter} from "../lead-engine/photobooth/photobooth-adapter-interface.js";

const safeText=(value,max=128)=>String(value??"").slice(0,max);
export async function inspectBamakBooths({adapter,boothIds=[],authorized=false}={}){
 if(!authorized) return Object.freeze({project:"bamak-event",status:"AUTHORIZATION_REQUIRED",booths:[]});
 const validation=validatePhotoboothAdapter(adapter);
 if(!validation.ok) return Object.freeze({project:"bamak-event",status:"ADAPTER_INCOMPLETE",missing:validation.missing,booths:[]});
 const ids=[...new Set(boothIds.filter(id=>typeof id==="string"&&id.trim()).map(id=>id.trim()))].slice(0,100);
 const booths=[];
 for(const id of ids){
  try{
   const state=await adapter.getStatus(id);
   booths.push({id:safeText(id),reachable:state?.reachable===true,deviceState:safeText(state?.deviceState||state?.state||"UNKNOWN"),lastSeen:safeText(state?.lastSeen||state?.last_seen||"")});
  }catch(error){
   booths.push({id:safeText(id),reachable:false,deviceState:"STATUS_ERROR"});
  }
 }
 return Object.freeze({project:"bamak-event",status:"READ_ONLY",booths,commandsSent:0,productionChanged:false});
}
