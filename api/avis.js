// BNH QR review gateway.
// A QR may carry ?intervention_id=...&client_id=...&qr_id=...
// No customer identity is required for redirect; identifiers are opaque linkage keys.
const clean=(v,max=100)=>String(v||'').trim().replace(/[^a-zA-Z0-9_.:-]/g,'').slice(0,max);
const scanId=()=>globalThis.crypto?.randomUUID?.()||('scan-'+Date.now()+'-'+Math.random().toString(36).slice(2,10));

export default async function handler(req,res){
 if(req.method!=='GET') return res.status(405).json({ok:false,error:'Method not allowed'});
 const reviewUrl=process.env.BNH_REVIEW_URL;
 if(!reviewUrl) return res.status(503).send('Review destination not configured');

 const interventionId=clean(req.query?.intervention_id);
 const clientId=clean(req.query?.client_id);
 const qrId=clean(req.query?.qr_id);
 const eventId=scanId();
 const webhook=process.env.BNH_SHEETS_WEBHOOK_URL;

 if(webhook){
  const payload={
   record_type:'event',tenant_id:'bnh',project_id:'bnh-site',
   event_id:eventId,event:'review_qr_scan',session_id:'',
   intervention_id:interventionId,client_id:clientId,qr_id:qrId,
   path:'/api/avis',source:'qr_avis',canal:'qr',campagne:'avis_clients',
   target:'google_review',received_at:new Date().toISOString()
  };
  try{
   await fetch(webhook,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  }catch(_){/* review access stays non-blocking */}
 }
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Robots-Tag','noindex');
 return res.redirect(302,reviewUrl);
}
