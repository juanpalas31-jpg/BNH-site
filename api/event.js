export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({ok:false});
 const webhook=process.env.BNH_SHEETS_WEBHOOK_URL;
 if(!webhook) return res.status(503).json({ok:false,error:'Analytics storage not configured'});
 try{
  const b=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});
  const payload={record_type:'event',schema_version:1,tenant_id:b.tenant_id||'bnh',project_id:b.project_id||'bnh-site',event_id:b.event_id||`EVT-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`,browser_timestamp:b.browser_timestamp||'',event:b.event||'',session_id:b.session_id||'',path:b.path||'',source:b.source||'',canal:b.canal||'',campagne:b.campagne||'',local_hour:b.local_hour,local_day:b.local_day,target:b.target||'',duration_sec:b.duration_sec||'',received_at:new Date().toISOString(),engine_version:'1'};
  const upstream=await fetch(webhook,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const result=await upstream.json().catch(()=>({}));
  if(!upstream.ok||result.ok!==true) throw new Error(result.error||'Storage rejected event');
  return res.status(200).json({ok:true,event_id:payload.event_id,tenant_id:payload.tenant_id,project_id:payload.project_id,schema_version:payload.schema_version});
 }catch(e){return res.status(500).json({ok:false,error:'Event relay failed'})}
}