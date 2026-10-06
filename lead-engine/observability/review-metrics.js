const key=e=>[
 e.tenant_id||'',e.project_id||'',e.event||'',
 e.qr_id||'',e.intervention_id||'',e.review_id||'',e.event_id||''
].join('|');

export function reviewMetrics(events=[]){
 const seen=new Set(),unique=[];
 let duplicates=0;
 for(const e of events){
  if(!['review_qr_scan','review_submitted','review_received'].includes(e?.event)) continue;
  const k=key(e);
  if(seen.has(k)){duplicates++;continue;}
  seen.add(k);unique.push(e);
 }
 const scans=unique.filter(e=>e.event==='review_qr_scan');
 const reviews=unique.filter(e=>e.event==='review_submitted'||e.event==='review_received');
 const scannedQr=new Set(scans.map(e=>e.qr_id).filter(Boolean));
 const reviewedQr=new Set(reviews.map(e=>e.qr_id).filter(Boolean));
 const matchedReviews=reviews.filter(e=>e.qr_id&&scannedQr.has(e.qr_id));
 const unmatchedReviews=reviews.length-matchedReviews.length;
 return {
  scans:scans.length,unique_qr_scanned:scannedQr.size,reviews:reviews.length,
  matched_reviews:matchedReviews.length,unmatched_reviews:unmatchedReviews,
  duplicate_events_ignored:duplicates,
  review_conversion_rate:scannedQr.size?reviewedQr.size/scannedQr.size:0
 };
}

export function reviewJourney(events=[],qrId){
 const rows=events.filter(e=>e?.qr_id===qrId).sort((a,b)=>Date.parse(a.received_at||0)-Date.parse(b.received_at||0));
 return {
  qr_id:qrId,
  intervention_id:rows.find(e=>e.intervention_id)?.intervention_id||null,
  client_id:rows.find(e=>e.client_id)?.client_id||null,
  scanned:rows.some(e=>e.event==='review_qr_scan'),
  reviewed:rows.some(e=>e.event==='review_submitted'||e.event==='review_received'),
  events:rows
 };
}
