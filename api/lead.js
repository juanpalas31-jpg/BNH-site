import { randomUUID } from 'node:crypto';
import { evaluateInbound } from '../lead-engine/orchestrator.js';
import { createRuntimeStorage } from '../lead-engine/runtime.js';
import { evaluateBnhOpportunity } from '../lead-engine/adapters/bnh-opportunity-adapter.js';
import { huntingCard } from '../lead-engine/commercial/hunting-board.js';

const safeId = (prefix) => `${prefix}-${randomUUID()}`;
const text=(v,max=160)=>String(v||'').trim().replace(/[<>]/g,'').slice(0,max);
const email=v=>text(v,254).toLowerCase();
const phone=v=>text(v,40).replace(/[^0-9+(). -]/g,'');
const postal=v=>text(v,10).replace(/[^0-9]/g,'').slice(0,5);

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
    const payload={record_type:'lead',schema_version:1,tenant_id:body.tenant_id||'bnh',project_id:body.project_id||'bnh-site',session_id:body.session_id||'',content_page:body.content_page||body.path||'',lead_id:body.lead_id||body['Lead ID']||safeId('LEAD'),nom:text(body.nom||body.Nom,120),telephone:phone(body.telephone||body['Téléphone']),email:email(body.email||body.Email),code_postal:postal(body.code_postal||body['Code postal']),source:text(body.source||body.Source,120),canal:text(body.canal||body.Canal,80),campagne:text(body.campagne||body.Campagne,120),utm_source:text(body.utm_source||body['UTM source'],120),utm_medium:text(body.utm_medium||body['UTM medium'],80),utm_campaign:text(body.utm_campaign||body['UTM campaign'],120),received_at:new Date().toISOString(),engine_version:'1'};
    if(!payload.nom||!payload.telephone||!/^[0-9]{5}$/.test(payload.code_postal)) return res.status(400).json({ok:false,error:'Missing or invalid required lead fields'});
    const evaluation=evaluateInbound(payload);
    if(!evaluation.accepted) return res.status(400).json({ok:false,error:'Invalid lead payload'});
    const {primary,provider}=createRuntimeStorage();
    if(!primary) return res.status(503).json({ok:false,error:'Lead storage not configured'});
    await primary.saveLead(payload);
    const commercial=payload.tenant_id==='bnh'&&payload.project_id==='bnh-site'
      ? evaluateBnhOpportunity({...body,...payload})
      : null;
    const hunting_card=commercial?huntingCard({lead:{...body,...payload},opportunity:commercial}):null;
    return res.status(200).json({ok:true,lead_id:payload.lead_id,tenant_id:payload.tenant_id,project_id:payload.project_id,schema_version:payload.schema_version,storage_provider:provider,commercial,hunting_card});
  }catch{return res.status(500).json({ok:false,error:'Lead storage failed'});}
}
