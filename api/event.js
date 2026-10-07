import { randomUUID } from 'node:crypto';
import { evaluateInbound } from '../lead-engine/orchestrator.js';
import { createRuntimeStorage } from '../lead-engine/runtime.js';

const safeId=prefix=>`${prefix}-${randomUUID()}`;
const clean=(v,max=100)=>String(v||'').trim().replace(/[^a-zA-Z0-9_.:-]/g,'').slice(0,max);
const text=(v,max=160)=>String(v||'').trim().replace(/[<>]/g,'').slice(0,max);

export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
  const payload={
   record_type:'event',schema_version:1,tenant_id:'bnh',project_id:'bnh-site',
   event_id:clean(b.event_id)||safeId('EVT'),browser_timestamp:text(b.browser_timestamp,40),event:clean(b.event,80),
   session_id:clean(b.session_id),lead_id:clean(b.lead_id),intervention_id:clean(b.intervention_id),
   client_id:clean(b.client_id),qr_id:clean(b.qr_id),review_id:clean(b.review_id),
   path:text(b.path,300),source:text(b.source,160),canal:text(b.canal,80),campagne:text(b.campagne,160),
   local_hour:Number.isInteger(Number(b.local_hour))?Math.max(0,Math.min(23,Number(b.local_hour))):null,local_day:Number.isInteger(Number(b.local_day))?Math.max(0,Math.min(6,Number(b.local_day))):null,target:text(b.target,100),duration_sec:Number.isFinite(Number(b.duration_sec))?Math.max(0,Math.min(86400,Number(b.duration_sec))):null,
   received_at:new Date().toISOString(),engine_version:'1'
  };
  if(!payload.event) return res.status(400).json({ok:false,error:'Event name required'});
  const evaluation=evaluateInbound(payload);
  if(!evaluation.accepted) return res.status(400).json({ok:false,error:'Invalid event payload'});
  const {primary,provider}=createRuntimeStorage();
  if(!primary) return res.status(503).json({ok:false,error:'Analytics storage not configured'});
  await primary.saveEvent(payload);
  return res.status(200).json({ok:true,event_id:payload.event_id,tenant_id:payload.tenant_id,project_id:payload.project_id,schema_version:payload.schema_version,storage_provider:provider});
 }catch{return res.status(500).json({ok:false,error:'Event storage failed'});}
}
