// Bamak Event read-only integration: reuses the existing photobooth adapter contract.
// Never sends commands to devices. A real adapter must be injected by an authorized caller.
// Read-only access requires getStatus only; command methods are deliberately not required.

const safeText=(value,max=128)=>String(value??"").slice(0,max);
export async function inspectBamakBooths({adapter,boothIds=[],authorized=false}={}){
 if(authorized!==true) return Object.freeze({project:"bamak-event",status:"AUTHORIZATION_REQUIRED",booths:[]});
 if(typeof adapter?.getStatus!=="function") return Object.freeze({project:"bamak-event",status:"ADAPTER_INCOMPLETE",missing:["getStatus"],booths:[]});
 if(!Array.isArray(boothIds)) return Object.freeze({project:"bamak-event",status:"INVALID_BOOTH_IDS",booths:[]});
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
 const summary={total:booths.length,reachable:booths.filter(b=>b.reachable).length,unreachable:booths.filter(b=>!b.reachable).length};
 return Object.freeze({project:"bamak-event",status:"READ_ONLY",booths,summary,commandsSent:0,productionChanged:false});
}
