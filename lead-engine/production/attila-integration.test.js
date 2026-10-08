import test from 'node:test';
import assert from 'node:assert/strict';
import {createBrain,think} from './attila-brain.js';
import {hatchVivarium,vivariumTick} from './attila-digital-vivarium.js';
import {runCognitiveCycle} from './attila-autonomy-loop.js';
import {planSilk,SILK_ARCHITECTURES} from './attila-silk-cognition.js';
test('chimera identity is in the central brain',()=>{
 const b=createBrain({ownerId:'creator',workspaceId:'family'});
 assert.equal(b.compartments.identity.species,'DIGITAL_ARANEAE_CHIMERA');
 assert.ok(b.compartments.identity.genome.ancestry.length>=10);
});
test('biology decisions are processed by central brain',()=>{
 const b=createBrain({ownerId:'creator',workspaceId:'family'});
 const r=think(b,{ownerId:'creator',workspaceId:'family',organ:'BIOLOGY',intent:'PLAN_SILK',payload:{terrain:'OPEN'}});
 assert.equal(r.accepted,true);
 assert.equal(r.result.build,false);
});
test('different silk plans and free hunting',()=>{
 assert.equal(planSilk({terrain:'VERTICAL'}).kind,'ORB');
 assert.equal(planSilk({target:'MOTH'}).kind,'BOLAS');
 assert.equal(planSilk({terrain:'OPEN'}).build,false);
 assert.equal(planSilk({risk:0.9}).strategy,'RETREAT');
 assert.ok(Object.keys(SILK_ARCHITECTURES).length>=8);
});
test('vivarium carries garage origin and brain across ticks',()=>{
 const a=hatchVivarium({ownerId:'creator',workspaceId:'family'});
 assert.equal(a.origin,'CREATORS_GARAGE_DIGITAL_TWIN');
 const b=vivariumTick(a).state;
 assert.equal(b.ageTicks,1);
 assert.ok(b.webs.length>=1);
 assert.equal(b.brain.compartments.identity.species,'DIGITAL_ARANEAE_CHIMERA');
});
test('workspace boundary prevents state reuse',()=>{
 const a=createBrain({ownerId:'creator',workspaceId:'family'});
 assert.throws(()=>runCognitiveCycle({ownerId:'intruder',workspaceId:'other',previousBrain:a}),/Workspace mismatch/);
});
test('no financial orders permitted',()=>{
 const b=createBrain({ownerId:'creator',workspaceId:'family'});
 const r=think(b,{ownerId:'creator',workspaceId:'family',organ:'FINANCE',intent:'LIVE_TRADE'});
 assert.equal(r.accepted,false);
 assert.equal(r.decision,'HUMAN_AUTHORIZATION_REQUIRED');
});
