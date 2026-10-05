// Lead relay: Google Sheets webhook is configured via BNH_SHEETS_WEBHOOK_URL in Vercel.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  const webhook = process.env.BNH_SHEETS_WEBHOOK_URL;
  if (!webhook) return res.status(503).json({ ok:false, error:'Lead storage not configured' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const payload = {
      record_type: 'lead',
      schema_version: 1,
      tenant_id: body.tenant_id || 'bnh',
      project_id: body.project_id || 'bnh-site',
      session_id: body.session_id || '',
      content_page: body.content_page || body.path || '',
      lead_id: body.lead_id || body['Lead ID'] || '',
      nom: body.nom || body.Nom || '',
      telephone: body.telephone || body['Téléphone'] || '',
      email: body.email || body.Email || '',
      code_postal: body.code_postal || body['Code postal'] || '',
      source: body.source || body.Source || '',
      canal: body.canal || body.Canal || '',
      campagne: body.campagne || body.Campagne || '',
      utm_source: body.utm_source || '',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
      received_at: new Date().toISOString()
    };

    const upstream = await fetch(webhook, {
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify(payload)
    });
    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.ok !== true) throw new Error(result.error || 'Storage webhook rejected request');
    return res.status(200).json({ ok:true, lead_id:payload.lead_id });
  } catch (e) {
    return res.status(500).json({ ok:false, error:'Lead relay failed' });
  }
}
