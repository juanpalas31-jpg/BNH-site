/**
 * Toile d'Or observation collector (Vercel Serverless Function).
 * Configure TOILE_DOR_SUPABASE_URL and TOILE_DOR_SUPABASE_SERVICE_ROLE_KEY
 * as server-only environment variables. Never expose the service key in HTML.
 * Database: apply attila/observation_schema.sql to a dedicated project/schema.
 */
const allowed = new Set(["page_view", "vinted_outbound_click"]);
const posters = new Set(["freud", "bob-marley"]);
const clean = (x, n=120) => typeof x === "string" ? x.slice(0,n).replace(/[<>\u0000-\u001f]/g,"") : "";
export default async function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  if(req.method !== "POST") { res.setHeader("Allow","POST"); return res.status(405).json({ok:false}); }
  const origin = req.headers.origin || "";
  const host = req.headers.host || "";
  if(origin) {
    try { if(new URL(origin).host !== host) return res.status(403).json({ok:false}); }
    catch { return res.status(403).json({ok:false}); }
  }
  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body||{});
  if(Buffer.byteLength(raw)>2048) return res.status(413).json({ok:false});
  let data;
  try { data=JSON.parse(raw); } catch { return res.status(400).json({ok:false}); }
  if(!allowed.has(data.event)) return res.status(400).json({ok:false});
  if(data.event==="vinted_outbound_click"&&!posters.has(data.poster)) return res.status(400).json({ok:false});
  const url=process.env.TOILE_DOR_SUPABASE_URL;
  const key=process.env.TOILE_DOR_SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) return res.status(503).json({ok:false,error:"collector_not_configured"});
  const record={
    event_name:data.event,
    poster:data.event==="vinted_outbound_click"?data.poster:null,
    source:clean(data.utm_source,80),
    medium:clean(data.utm_medium,80),
    campaign:clean(data.utm_campaign,80),
    referrer_host:clean(data.referrer_host,160),
    test_event:data.test_event===true
  };
  try {
    const response=await fetch(url.replace(/\/$/,"")+"/rest/v1/toile_dor_events",{
      method:"POST",
      headers:{"apikey":key,"Authorization":"Bearer "+key,"Content-Type":"application/json","Prefer":"return=minimal"},
      body:JSON.stringify(record),
      signal:AbortSignal.timeout(5000)
    });
    if(!response.ok) return res.status(502).json({ok:false,error:"storage_failed"});
    return res.status(202).json({ok:true});
  } catch { return res.status(502).json({ok:false,error:"storage_unreachable"}); }
}
