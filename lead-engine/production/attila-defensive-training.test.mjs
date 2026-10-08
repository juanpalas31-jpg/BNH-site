import test from 'node:test';import assert from 'node:assert/strict';
import {listDefensiveTraining,buildDefensiveSession,DEFENSIVE_TRAINING_POLICY} from './attila-defensive-training.js';
test('child curriculum excludes adult ethics',()=>{const items=listDefensiveTraining({age:11});assert.ok(items.some(x=>x.id==='verbal-deescalation'));assert.ok(!items.some(x=>x.id==='adult-protection-ethics'))});
test('adult curriculum includes protective ethics',()=>assert.ok(listDefensiveTraining({age:38,domain:'CLOSE_PROTECTION'}).some(x=>x.id==='adult-protection-ethics')));
test('blocks age-inappropriate modules',()=>assert.throws(()=>buildDefensiveSession({age:11,moduleId:'adult-protection-ethics'}),/MODULE_NOT_ALLOWED_FOR_AGE/));
test('sessions require supervision for minors',()=>assert.equal(buildDefensiveSession({age:11,moduleId:'safe-movement'}).supervision,'RESPONSIBLE_ADULT'));
test('restricts operational techniques',()=>assert.ok(DEFENSIVE_TRAINING_POLICY.restricted.includes('WEAPON_USE')));
