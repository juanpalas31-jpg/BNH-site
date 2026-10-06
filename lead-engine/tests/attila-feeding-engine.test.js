import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreLeadNutrition,feedQualityIndex,capacityState,attilaDecision} from '../commercial/attila-feeding-engine.js';

test('Attila values qualified real commercial food over empty volume',()=>{
 const weak=scoreLeadNutrition({intent_score:20,fit_score:20,urgency_score:10});
 const strong=scoreLeadNutrition({intent_score:90,fit_score:95,urgency_score:85,telephone:'0600000000',contact_consent:true,qualified:true,appointment:true,quote:true,sale:true,collected_revenue:5000,realized_margin:1500});
 assert.ok(strong.nutrition_score>weak.nutrition_score);
 assert.equal(strong.synthetic,false);
});

test('revenue is assimilated only when actually collected',()=>{
 const q=feedQualityIndex([{qualified:true,quote:true,collected_revenue:0},{sale:true,collected_revenue:3200,realized_margin:900}]);
 assert.equal(q.assimilated_revenue,3200);
 assert.equal(q.assimilated_margin,900);
});

test('Attila digests instead of over-hunting when commercial capacity is saturated',()=>{
 assert.equal(capacityState({open_leads:10,capacity:10}).acquisition_bias,'CONVERT_EXISTING');
 const d=attilaDecision({leads:[{intent_score:80,fit_score:90}],open_leads:10,capacity:10});
 assert.equal(d.hunt_mode,'CONVERT_EXISTING');
 assert.equal(d.automatic_contact,false);
});

test('Attila ranks the best prey first without inventing outcomes',()=>{
 const d=attilaDecision({leads:[
  {id:'noise',intent_score:15,fit_score:10},
  {id:'quality',intent_score:90,fit_score:90,urgency_score:80,telephone:'0600000000',contact_consent:true,qualified:true}
 ]});
 assert.equal(d.priority_prey.id,'quality');
 assert.equal(d.priority_prey.assimilated_revenue,0);
});
