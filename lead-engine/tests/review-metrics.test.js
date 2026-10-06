import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewMetrics,reviewJourney} from '../observability/review-metrics.js';

test('QR review metrics link scan to review and ignore duplicate event',()=>{
 const events=[
  {tenant_id:'bnh',project_id:'bnh-site',event:'review_qr_scan',event_id:'E1',qr_id:'Q1',intervention_id:'I1',client_id:'C1',received_at:'2026-10-07T10:00:00Z'},
  {tenant_id:'bnh',project_id:'bnh-site',event:'review_qr_scan',event_id:'E1',qr_id:'Q1',intervention_id:'I1',client_id:'C1',received_at:'2026-10-07T10:00:00Z'},
  {tenant_id:'bnh',project_id:'bnh-site',event:'review_received',event_id:'E2',review_id:'R1',qr_id:'Q1',intervention_id:'I1',client_id:'C1',received_at:'2026-10-07T10:05:00Z'}
 ];
 const m=reviewMetrics(events);
 assert.equal(m.scans,1);assert.equal(m.reviews,1);assert.equal(m.matched_reviews,1);
 assert.equal(m.duplicate_events_ignored,1);assert.equal(m.review_conversion_rate,1);
 const j=reviewJourney(events,'Q1');
 assert.equal(j.intervention_id,'I1');assert.equal(j.client_id,'C1');assert.equal(j.scanned,true);assert.equal(j.reviewed,true);
});

test('unmatched review is visible instead of silently attached',()=>{
 const m=reviewMetrics([{tenant_id:'bnh',project_id:'bnh-site',event:'review_received',event_id:'E9',review_id:'R9',qr_id:'Q9'}]);
 assert.equal(m.unmatched_reviews,1);
});
