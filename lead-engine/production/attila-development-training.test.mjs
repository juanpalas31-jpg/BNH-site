import test from 'node:test';import assert from 'node:assert/strict';
import {DEVELOPMENT_EXERCISES,DEVELOPMENT_POLICY,listDevelopmentExercises,createDevelopmentSession} from './attila-development-training.js';
test('contains 24 educational exercises',()=>assert.equal(DEVELOPMENT_EXERCISES.length,24));
test('supports child age filtering',()=>{assert.ok(listDevelopmentExercises({age:7}).length>0);assert.ok(listDevelopmentExercises({age:11,domain:'LITERACY'}).length>0)});
test('creates child session without personal data',()=>{const s=createDevelopmentSession({age:7,domain:'PSYCHOMOTOR',limit:3});assert.equal(s.supervision,'ADULT_PRESENT');assert.equal(s.personalDataStored,false);assert.equal(s.exercises.length,3)});
test('rejects invalid age and domains',()=>{assert.throws(()=>listDevelopmentExercises({age:-1}));assert.throws(()=>listDevelopmentExercises({age:7,domain:'MEDICAL_DIAGNOSIS'}))});
test('does not claim clinical validation',()=>{assert.equal(DEVELOPMENT_POLICY.clinicalDevice,false);assert.ok(DEVELOPMENT_EXERCISES.every(e=>e.clinicalValidation===false))});
