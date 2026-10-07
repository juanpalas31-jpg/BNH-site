import test from 'node:test';
import assert from 'node:assert/strict';
import {SPIDER_INSTINCTS, instinctDecision} from '../dna/spider-instinct-registry.js';

test('Salticidae carries tactical hunting repertoire',()=>{
 const s=SPIDER_INSTINCTS.SALTICIDAE_STALK;
 assert.equal(s.hunting_repertoire.length,18);
 for(const tactic of ['DECOY_PREY_VIBRATION','DETOUR','INTERCEPTION','SILK_SAFETY_LINE','ADAPTIVE_LURE']){
   assert.ok(s.hunting_repertoire.includes(tactic));
 }
 assert.equal(s.software_translation.constraints.includes('access bypass'),true);
});

test('authorized daytime active hunt exposes Salticidae mode without automatic contact',()=>{
 const d=instinctDecision({territory:'WEB',authorization:true,signal_strength:40,path_count:1});
 assert.equal(d.spider_mode,'Salticidae');
 assert.equal(d.digital_mode,'ACTIVE_HUNT');
 assert.equal(d.automatic_contact,false);
 assert.equal(d.authorized,true);
});
