import test from 'node:test';import assert from 'node:assert/strict';
import {newLocalSession,localSessionDecision} from './attila-local-session-controller.js';
const valid={founderPresent:true,founderVerified:true,guestPresent:true,guestVerified:true,founderApproved:true,founderApprovalActive:true,localOnly:true,remoteConnection:false,sessionActive:true,guestIsFamilyChild:false};
test('new session is closed',()=>assert.equal(newLocalSession().active,false));
test('local invitation opens temporary session',()=>assert.equal(localSessionDecision(newLocalSession(),{type:'OPEN',facts:valid}).decision,'ALLOW_TEMPORARY'));
test('missing founder closes active session',()=>{const s=localSessionDecision(newLocalSession(),{type:'OPEN',facts:valid}).state;assert.equal(localSessionDecision(s,{type:'CHECK',facts:{...valid,founderPresent:false}}).decision,'REVOKE')});
test('remote connection revokes active session',()=>{const s=localSessionDecision(newLocalSession(),{type:'OPEN',facts:valid}).state;assert.equal(localSessionDecision(s,{type:'CHECK',facts:{...valid,remoteConnection:true}}).decision,'REVOKE')});
test('family child cannot be invited',()=>assert.equal(localSessionDecision(newLocalSession(),{type:'OPEN',facts:{...valid,guestIsFamilyChild:true}}).decision,'REVOKE'));
test('unknown event closes session',()=>assert.equal(localSessionDecision({active:true,sequence:1},{type:'UNKNOWN'}).decision,'REVOKE'));
