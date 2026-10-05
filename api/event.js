import { randomUUID } from 'node:crypto';
import { evaluateInbound } from '../lead-engine/orchestrator.js';
import { createRuntimeStorage } from '../lead-engine/runtime.js';

const safeId=(prefix)=>`${prefix}-${randomUUID()}`;

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  try{
    const b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
    const payload={record_type:'event',schema_version:1,tenant_id:b.tenant_id||'bnh',project_id:b.project_id||'bnh-site',event_id:b.event_id||safeId('EVT'),browser_timestamp:b.browser_timestamp||'',event:b.event||'',session_id:b.session_id||'',path:b.path||'',source:b.source||'',canal:b.canal||'',campagne:b.campagne||'',local_hour:b.local_hour,local_day:b.local_day,target:b.target||'',duration_sec:b.duration_sec||'',received_at:new Date().toISOString(),engine_version:'1'};
    const evaluation=evaluateInbound(payload);
    if(!evaluation.accepted) return res.status(400).json({ok:false,error:'Invalid event payload'});
    const {primary,provider}=createRuntimeStorage();
    if(!primary) return res.status(503).json({ok:false,error:'Analytics storage not configured'});
    await primary.saveEvent(payload);
    return res.status(200).json({ok:true,event_id:payload.event_id,tenant_id:payload.tenant_id,project_id:payload.project_id,schema_version:payload.schema_version,storage_provider:provider});
  }catch{return res.status(500).json({ok:false,error:'Event storage failed'});}
}
