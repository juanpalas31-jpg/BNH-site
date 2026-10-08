import test from 'node:test';import assert from 'node:assert/strict';
import {createVivarium,simulateVivariumStep,assessVivarium} from './attila-vivarium.js';
test('creates isolated sandbox',()=>{const s=createVivarium({workspaceId:'test'});assert.equal(s.policy.liveExecution,false);assert.equal(s.policy.privateMemoryAccess,false)});
test('experiments progress and deduplicate',()=>{const s=createVivarium({workspaceId:'test'});const x=simulateVivariumStep(s,{experimentId:'a',strategy:'EXPLORE'});assert.equal(x.state.generation,1);assert.equal(simulateVivariumStep(x.state,{experimentId:'a',strategy:'EXPLORE'}).outcome.status,'DUPLICATE_SKIPPED')});
test('energy remains bounded',()=>{let s=createVivarium({workspaceId:'test'});for(let i=0;i<20;i++)s=simulateVivariumStep(s,{experimentId:'e'+i,strategy:'REST'}).state;assert.equal(s.energy,100)});
test('recommends rest at low energy',()=>{const s={...createVivarium({workspaceId:'test'}),energy:12};assert.equal(assessVivarium(s).recommendation,'REST')});
test('rejects invalid signals',()=>assert.throws(()=>simulateVivariumStep(createVivarium({workspaceId:'test'}),{experimentId:'a',strategy:'EXPLORE',signal:100})));
