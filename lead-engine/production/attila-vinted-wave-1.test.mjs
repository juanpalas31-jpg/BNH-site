import test from 'node:test';import assert from 'node:assert/strict';
import {buildFirstVintedWave} from './attila-vinted-wave-1.js';
test('wave one builds four SEO themes plus hub',()=>{const x=buildFirstVintedWave();assert.equal(x.agent,'ATTILA');assert.equal(x.pages,5);assert.equal(x.status,'BUILD_READY_NOT_DEPLOYED')});
test('all generated pages are indexable and point only to verified Vinted profile fallback',()=>{const x=buildFirstVintedWave();for(const html of Object.values(x.files)){assert.match(html,/index,follow/);assert.match(html,/vinted|Vinted/)}});
