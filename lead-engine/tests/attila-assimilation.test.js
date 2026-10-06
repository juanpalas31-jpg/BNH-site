import test from 'node:test';
import assert from 'node:assert/strict';
import { assimilateOutcome, foodMemory, nextHunt } from '../commercial/attila-assimilation.js';

test('sale without collection teaches but does not assimilate money',()=>{
 const x=assimilateOutcome({tenant_id:'bnh',project_id:'bnh-site',lead_id:'L1',outcome:'sale'});
 assert.equal(x.assimilated_revenue,0);
 assert.equal(x.explanation,'LEARNING_SIGNAL_ONLY');
});

test('collected payment becomes real nutrition',()=>{
 const x=assimilateOutcome({tenant_id:'bnh',project_id:'bnh-site',lead_id:'L2',outcome:'payment',amount:5000,realized_margin:1500});
 assert.equal(x.assimilated_revenue,5000);
 assert.equal(x.assimilated_margin,1500);
});

test('memory is isolated and tiny samples cannot dominate hunting',()=>{
 const m=foodMemory([
  {tenant_id:'bnh',project_id:'bnh-site',source:'seo',outcome:'payment',amount:1000,realized_margin:300},
  {tenant_id:'other',project_id:'other',source:'seo',outcome:'payment',amount:9000,realized_margin:5000}
 ]);
 assert.equal(m.length,2);
 const d=nextHunt(m,{min_samples:5});
 assert.equal(d.action,'EXPLORE');
 assert.ok(d.exploration_rate>=.05);
 assert.equal(d.automatic_change,false);
});
