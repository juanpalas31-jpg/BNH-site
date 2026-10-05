// QR review gateway: records an anonymous scan before redirecting to the configured review page.
// Configure BNH_REVIEW_URL in Vercel with the exact public "leave a review" URL.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok:false, error:'Method not allowed' });

  const reviewUrl = process.env.BNH_REVIEW_URL;
  if (!reviewUrl) return res.status(503).send('Review destination not configured');

  const webhook = process.env.BNH_SHEETS_WEBHOOK_URL;
  const now = new Date();

  // Tracking must never block the customer from reaching the review page.
  if (webhook) {
    const payload = {
      record_type:'event',
      event:'review_qr_scan',
      session_id:'',
      path:'/api/avis',
      source:'qr_avis',
      canal:'qr',
      campagne:'avis_clients',
      local_hour:'',
      local_day:'',
      target:'google_review',
      duration_sec:'',
      received_at:now.toISOString()
    };
    try {
      await fetch(webhook, {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify(payload)
      });
    } catch (_) {
      // Deliberately non-blocking: review journey continues even if analytics is temporarily unavailable.
    }
  }

  res.setHeader('Cache-Control','no-store');
  return res.redirect(302, reviewUrl);
}
