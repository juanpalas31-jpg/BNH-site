import { humanToSpider } from "./human-to-spider.js";

export const CHAT_CHANNELS=Object.freeze({
 OWNER_DIRECT:"ATTILA_DIRECT",
 PUBLIC_OPTIONAL:"ATTILA_PUBLIC_OPTIONAL"
});

export function openAttilaDirect({owner_verified=false,session_id=""}={}){
 if(!owner_verified) return {ok:false,state:"OWNER_PROOF_REQUIRED"};
 return {ok:true,channel:CHAT_CHANNELS.OWNER_DIRECT,session_id:String(session_id||"direct"),jarvis_in_response_loop:false,audit_visible:true};
}

export function ownerMessage({session,message,context={}}={}){
 if(!session?.ok||session.channel!==CHAT_CHANNELS.OWNER_DIRECT) return {ok:false,state:"DIRECT_SESSION_REQUIRED"};
 const spider=humanToSpider({message,context,actor:"OWNER"});
 return {
  ok:true,
  channel:session.channel,
  speaker:"OWNER",
  recipient:"ATTILA",
  spider,
  response_contract:{
   voice:"ATTILA",
   human_language:true,
   jarvis_interference:false,
   preserve_audit_history:true,
   obey_owner_and_security_gates:true
  }
 };
}

export function publicChatOption({enabled=false}={}){
 return {
  channel:CHAT_CHANNELS.PUBLIC_OPTIONAL,
  enabled:Boolean(enabled),
  default_enabled:false,
  owner_privileges:false,
  private_memory_access:false,
  administrative_actions:false
 };
}
