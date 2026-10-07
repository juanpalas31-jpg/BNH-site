/**
 * Durable-memory boundary for Attila.
 * Only aggregate operational state is allowed through this boundary.
 * Raw visitor/lead records, names, emails, phones, messages and arbitrary
 * request payloads are deliberately not copied.
 */
const STATES=new Set(["IMMOBILE","AMBUSH","SIGNAL_DETECTED","PREPARE_POUNCE","POUNCE_PROPOSAL"]);
const num=v=>Math.max(0,Number(v)||0);
const text=v=>String(v||"").slice(0,120);

function cleanBuckets(source={}){
 const out={};
 for(const [key,v] of Object.entries(source||{}).slice(0,100)){
  out[text(key)]={views:num(v?.views),starts:num(v?.starts),leads:num(v?.leads),highIntent:num(v?.highIntent)};
 }
 return out;
}

export function sanitizeAttilaState(input={}){
 const posture=STATES.has(input.posture)?input.posture:"IMMOBILE";
 return {
  schema_version:2,
  identity:"ATTILA_ARACHNID_AI",
  posture,
  posture_since:text(input.posture_since),
  updated_at:text(input.updated_at||new Date().toISOString()),
  counters:{events:num(input.events ?? input.counters?.events),leads:num(input.leads ?? input.counters?.leads)},
  by_intent:cleanBuckets(input.by_intent),
  by_path:cleanBuckets(input.by_path),
  last_hunt:input.last_hunt?{
   at:text(input.last_hunt.at),
   target_intent:text(input.last_hunt?.plan?.target_intent),
   action:text(input.last_hunt?.plan?.action),
   arachnid_state:text(input.last_hunt?.plan?.arachnid_state)
  }:null,
  privacy:{raw_pii:false,raw_events:false,raw_leads:false}
 };
}

export function validateAttilaState(input={}){
 const s=sanitizeAttilaState(input);
 return {ok:STATES.has(s.posture)&&s.privacy.raw_pii===false,state:s};
}
