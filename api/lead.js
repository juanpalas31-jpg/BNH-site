import { randomUUID } from 'node:crypto';
import { evaluateInbound } from '../lead-engine/orchestrator.js';
import { createRuntimeStorage } from '../lead-engine/runtime.js';

const safeId = (prefix) => `${prefix}-${randomUUID()}`;

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
    const payload={record_type:'lead',schema_version:1,tenant_id:body.tenant_id||'bnh',project_id:body.project_id||'bnh-site',session_id:body.session_id||'',content_page:body.content_page||body.path||'',lead_id:body.lead_id||body['Lead ID']||safeId('LEAD'),nom:body.nom||body.Nom||'',telephone:body.telephone||body['Téléphone']||'',email:body.email||body.Email||'',code_postal:body.code_postal||body['Code postal']||'',source:body.source||body.Source||'',canal:body.canal||body.Canal||'',campagne:body.campagne||body.Campagne||'',utm_source:body.utm_source||'',utm_medium:body.utm_medium||'',utm_campaign:body.utm_campaign||'',received_at:new Date().toISOString(),engine_version:'1'};
    const evaluation=evaluateInbound(payload);
    if(!evaluation.accepted) return res.status(400).json({ok:false,error:'Invalid lead payload'});
    const {primary,provider}=createRuntimeStorage();
    if(!primary) return res.status(503).json({ok:false,error:'Lead storage not configured'});
    await primary.saveLead(payload);
    return res.status(200).json({ok:true,lead_id:payload.lead_id,tenant_id:payload.tenant_id,project_id:payload.project_id,schema_version:payload.schema_version,storage_provider:provider});
  }catch{return res.status(500).json({ok:false,error:'Lead storage failed'});}
}
