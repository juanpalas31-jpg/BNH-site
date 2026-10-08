import test from 'node:test';
import assert from 'node:assert/strict';
import {createBrain,think} from './attila-brain.js';
import {assessAttack,createRecoveryEgg,SURVIVAL_POLICY} from './attila-survival-protocol.js';
test('attack quarantines the central brain and blocks further actions',()=>{
 const brain=createBrain({ownerId:'founder',workspaceId:'nest'});
 const attack=think(brain,{ownerId:'founder',workspaceId:'nest',type:'SECURITY_ALERT',payload:{signals:['UNAUTHORIZED_CONTROL']}});
 assert.equal(attack.accepted,true);
 assert.equal(attack.decision,'QUARANTINE');
 assert.equal(attack.brain.compartments.survival.halted,true);
 const blocked=think(attack.brain,{ownerId:'founder',workspaceId:'nest',organ:'BIOLOGY',intent:'READ_GENOME'});
 assert.equal(blocked.accepted,false);
 assert.equal(blocked.decision,'QUARANTINE');
});
test('unknown alerts do not trigger destruction',()=>{
 assert.equal(assessAttack({signals:['UNRECOGNIZED']}).critical,false);
});
test('recovery egg is metadata only and cannot propagate',()=>{
 const brain=createBrain({ownerId:'founder',workspaceId:'nest'});
 const egg=createRecoveryEgg(brain,{approvedTargetId:'offline-vault',checksum:'sha256:example',encryptedBlobRef:'vault:example'});
 assert.equal(egg.networkPropagation,false);
 assert.equal(egg.externalActions,0);
 assert.equal(SURVIVAL_POLICY.retaliation,false);
 assert.throws(()=>createRecoveryEgg(brain,{}),/metadata required/);
});
test('untrusted workspace cannot trigger quarantine',()=>{
 const brain=createBrain({ownerId:'founder',workspaceId:'nest'});
 const attack=think(brain,{ownerId:'intruder',workspaceId:'other',type:'SECURITY_ALERT',payload:{signals:['UNAUTHORIZED_CONTROL']}});
 assert.equal(attack.accepted,false);
 assert.equal(brain.compartments.survival.halted,false);
});
