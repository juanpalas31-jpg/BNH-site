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
 assert.match(html,/name="contact_consent" value="true"/);
 assert.match(html,/name="requested_assessment" value="true"/);
 assert.match(html,/id="lead-session-id"/);
 assert.match(html,/utm_source/);
 assert.match(html,/utm_medium/);
 assert.match(html,/utm_campaign/);
});
