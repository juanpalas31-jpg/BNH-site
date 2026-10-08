import test from 'node:test';
import assert from 'node:assert/strict';
import {validateMission} from './attila-mission-schema.js';
const base={id:'job1',workspaceId:'family',action:'VERIFY_INTEGRITY',payload:{expectedSha256:'a'.repeat(64),actualSha256:'b'.repeat(64)}};
test('allows supported metadata-only integrity mission',()=>assert.equal(validateMission(base,'family'),true));
test('rejects unexpected private content fields',()=>assert.throws(()=>validateMission({...base,transcript:'private'},'family'),/INVALID_MISSION_SCHEMA/));
test('rejects private content inside payload',()=>assert.throws(()=>validateMission({...base,payload:{...base.payload,childName:'private'}},'family'),/INVALID_MISSION_PAYLOAD/));
test('rejects mismatched workspace',()=>assert.throws(()=>validateMission(base,'other'),/INVALID_MISSION_SCHEMA/));
test('rejects unexpected consent metadata',()=>assert.throws(()=>validateMission({id:'job2',workspaceId:'family',action:'CHECK_ACCESS',payload:{actor:{id:'parent',workspaceId:'family',role:'PARENT_GUARDIAN'},resource:{id:'r1',workspaceId:'family',classification:'CHILD_PRIVATE'},operation:'READ',authenticated:true,consents:{CHILD_A:{podcast:true,notes:'private'}}}},'family'),/INVALID_CONSENT_METADATA/));
