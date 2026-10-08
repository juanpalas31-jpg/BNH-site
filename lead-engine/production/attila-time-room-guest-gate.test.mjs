import test from 'node:test';import assert from 'node:assert/strict';
import {decideLocalGuestEntry as admit,shouldTerminateGuestSession as terminate} from './attila-time-room-guest-gate.js';
const valid={founderPresent:true,founderVerified:true,guestPresent:true,guestVerified:true,founderApproved:true,localOnly:true,remoteConnection:false,sessionActive:true};
test('admits a verified guest physically with founder',()=>assert.equal(admit(valid).action,'ADMIT_SUPERVISED_LOCAL_GUEST'));
test('rejects remote connection',()=>assert.equal(admit({...valid,remoteConnection:true}).allowed,false));
test('rejects guest when founder absent',()=>assert.equal(admit({...valid,founderPresent:false}).allowed,false));
test('rejects without explicit invitation',()=>assert.equal(admit({...valid,founderApproved:false}).allowed,false));
test('rejects missing local-only assurance',()=>assert.equal(admit({...valid,localOnly:false}).allowed,false));
test('terminates when founder leaves',()=>assert.equal(terminate({founderPresent:false,founderVerified:true,founderApprovalActive:true}),true));
test('terminates when network access appears',()=>assert.equal(terminate({founderPresent:true,founderVerified:true,founderApprovalActive:true,remoteConnection:true}),true));

test('family child cannot enter via guest invitation',()=>assert.equal(admit({...valid,guestIsFamilyChild:true}).allowed,false));
