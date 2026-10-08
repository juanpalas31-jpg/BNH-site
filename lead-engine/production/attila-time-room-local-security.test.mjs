import test from 'node:test';
import assert from 'node:assert/strict';
import {assessLocalSecurityReadiness} from './attila-time-room-local-security.js';
test('missing safeguards means not ready',()=>{
 const result=assessLocalSecurityReadiness({});
 assert.equal(result.ready,false);
 assert.equal(result.missing.length,6);
});
test('partial safeguards still mean not ready',()=>{
 const result=assessLocalSecurityReadiness({trustedController:true,networkIsolation:true});
 assert.equal(result.ready,false);
 assert.ok(result.missing.includes('verifiedIdentity'));
});
test('all declarations require independent verification',()=>{
 const result=assessLocalSecurityReadiness({
  trustedController:true,verifiedIdentity:true,localPresenceSensor:true,
  networkIsolation:true,revocationEnforced:true,familyRelationshipVerified:true
 });
 assert.equal(result.mode,'REQUIRES_INDEPENDENT_VERIFICATION');
});
