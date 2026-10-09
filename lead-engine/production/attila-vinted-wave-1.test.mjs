import test from 'node:test';
import assert from 'node:assert/strict';
import {buildFirstVintedWave} from './attila-vinted-wave-1.js';
import {JUANPALAS_VINTED} from './attila-vinted-juanpalas-launch.js';

test('wave one generates exactly four themed pages plus hub, as an unshipped build',()=>{
  const x=buildFirstVintedWave();
  assert.equal(x.agent,'ATTILA');
  assert.equal(x.pages,5);
  assert.equal(x.status,'BUILD_READY_NOT_DEPLOYED');
  assert.deepEqual(Object.keys(x.files).sort(),[
    'vinted/index.html',
    'vinted/jazz/index.html',
    'vinted/jim-morrison/index.html',
    'vinted/marilyn-monroe/index.html',
    'vinted/pink-floyd/index.html'
  ]);
});

test('every generated HTML page is explicitly non-indexable in Preview',()=>{
  for(const [path,html] of Object.entries(buildFirstVintedWave().files)){
    assert.match(html,/<meta name="robots" content="noindex,nofollow,noarchive">/,path);
    assert.doesNotMatch(html,/<meta name="robots" content="index,follow">/,path);
    assert.match(html,/<html lang="fr">/,path);
  }
});

test('the only outbound Vinted destination is the verified profile fallback',()=>{
  const x=buildFirstVintedWave();
  assert.equal(x.destination,JUANPALAS_VINTED.profileUrl);
  const urls=Object.values(x.files).flatMap(html=>[...html.matchAll(/href="(https?:[^"]+)"/g)].map(m=>m[1]));
  assert.equal(urls.length,5);
  assert.ok(urls.every(url=>url===JUANPALAS_VINTED.profileUrl));
  assert.ok(Object.values(x.files).every(html=>!html.includes('/items/')));
});

test('Preview contains no scripts, trackers, price or inventory claims',()=>{
  const x=buildFirstVintedWave();
  assert.deepEqual(x,buildFirstVintedWave());
  for(const [path,html] of Object.entries(x.files)){
    assert.doesNotMatch(html,/<script\b|<iframe\b|utm_source=|gtag\(/i,path);
    assert.doesNotMatch(html,/\b\d+[,.]?\d*\s*€/i,path);
    assert.doesNotMatch(html,/\b(en stock|stock disponible|livraison garantie)\b/i,path);
  }
});
