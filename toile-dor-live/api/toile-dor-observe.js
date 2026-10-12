const allowed = new Set(['page_view', 'vinted_click']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const clean = (x, n = 120) => typeof x === 'string' ? x.slice(0,n).replace(/[<>\u0000-\u001f]/g,'') : '';
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  if(req.method !== 'POST') return res.status(405).json({ok:false});
  const origin=req.headers.origin||'';
  try { if(origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ok:false}); } catch { return res.status(403).json({ok:false}); }
  const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});
  if(Buffer.byteLength(raw)>2048) return res.status(413).json({ok:false});
  let d; try { d=JSON.parse(raw); } catch { return res.status(400).json({ok:false}); }
  if(!allowed.has(d.event_type)||!uuid.test(d.visitor_id||'')||!uuid.test(d.session_id||'')) return res.status(400).json({ok:false});
  let destination='';
  if(d.event_type==='vinted_click') { try { const u=new URL(d.destination); if(u.protocol!=='https:'||!['vinted.fr','www.vinted.fr'].includes(u.hostname)) throw Error(); destination=u.href; } catch { return res.status(400).json({ok:false}); } }
  const base=process.env.TOILE_DOR_SUPABASE_URL;
  if(base!=='https://dhvwntwpacjxtuhsmmdr.supabase.co') return res.status(503).json({ok:false,error:'historical_collector_not_configured'});
  const row={event_type:d.event_type,page_path:clean(d.page_path||'/',300),referrer_host:clean(d.referrer_host,160),campaign_source:d.test_event===true?'__test__:'+clean(d.test_id||'verification',60):clean(d.campaign_source,80),visitor_id:d.visitor_id,session_id:d.session_id,destination};
  try {
    const response=await fetch(base+'/functions/v1/toile-dor-events',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://toile-dor-preview.vercel.app'},body:JSON.stringify(row),signal:AbortSignal.timeout(10000)});
    return response.ok?res.status(202).json({ok:true,test_event:d.test_event===true}):res.status(502).json({ok:false,error:'historical_storage_failed',upstream_status:response.status});
  } catch { return res.status(502).json({ok:false,error:'historical_storage_unreachable'}); }
};
