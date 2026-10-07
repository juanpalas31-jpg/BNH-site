import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../../index.html',import.meta.url),'utf8');

test('BNH funnel captures in Spider Engine before external relay',()=>{
 assert.match(html,/fetch\('\/api\/lead'/);
 assert.match(html,/if\(!r\.ok\|\|!j\.ok\)throw/);
 assert.ok(html.indexOf("fetch('/api/lead'") < html.lastIndexOf("f.submit()"));
});

test('BNH confirmation follows active deployment origin',()=>{
 assert.match(html,/id="lead-next"/);
 assert.match(html,/location\.origin\+'\/merci\.html'/);
 assert.doesNotMatch(html,/name="_next" value="https:\/\/bnh-site\.vercel\.app\/merci\.html"/);
});

test('BNH lead carries consent, assessment intent and session attribution',()=>{
 assert.match(html,/required type="checkbox" name="contact_consent" value="true"/);
 assert.match(html,/name="requested_assessment" value="true"/);
 assert.match(html,/id="lead-session-id"/);
 assert.match(html,/id="lead-content-page"/);
 assert.match(html,/set\('lead-content-page',location\.pathname\)/);
 assert.match(html,/utm_source/);
 assert.match(html,/utm_medium/);
 assert.match(html,/utm_campaign/);
});


test('BNH API endpoints enforce tenant isolation',()=>{
 const lead=fs.readFileSync(new URL('../../api/lead.js',import.meta.url),'utf8');
 const event=fs.readFileSync(new URL('../../api/event.js',import.meta.url),'utf8');
 assert.match(lead,/tenant_id:'bnh',project_id:'bnh-site'/);
 assert.doesNotMatch(lead,/tenant_id:body\.tenant_id\|\|'bnh'/);
 assert.match(event,/tenant_id:'bnh',project_id:'bnh-site'/);
 assert.doesNotMatch(event,/tenant_id:b\.tenant_id\|\|'bnh'/);
});


test('BNH conversion event is emitted only after persisted lead capture',()=>{
 const apiCheck="if(!r.ok||!j.ok)throw";
 const captured="event:'lead_captured'";
 assert.match(html,/event:'lead_captured'/);
 assert.doesNotMatch(html,/send\('form_submit'\)/);
 assert.ok(html.indexOf(apiCheck) < html.indexOf(captured));
 assert.ok(html.indexOf(captured) < html.lastIndexOf("f.submit()"));
});


test('BNH lead API rejects missing contact consent server-side',()=>{
 const lead=fs.readFileSync(new URL('../../api/lead.js',import.meta.url),'utf8');
 assert.match(lead,/contact_consent/);
 assert.match(lead,/if\(!consent\) return res\.status\(400\)\.json\(\{ok:false,error:'Contact consent required'\}\)/);
});
