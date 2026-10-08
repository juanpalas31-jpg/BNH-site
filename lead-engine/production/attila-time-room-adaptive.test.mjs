import test from 'node:test';import assert from 'node:assert/strict';
import {planTimeRoomSession,chooseAssistance} from './attila-time-room-adaptive.js';
test('plans child brain exercises within time budget',()=>{const x=planTimeRoomSession({age:7,availableMinutes:25,space:'DESK'});assert.ok(x.plannedMinutes<=25);assert.ok(x.activities.length>0);assert.ok(x.activities.every(a=>a.space==='DESK'));assert.equal(x.supervision,'ADULT_PRESENT')});
test('physical room allows movement',()=>assert.ok(planTimeRoomSession({age:11,availableMinutes:60,space:'CLEAR_SPACE',domains:['MOVEMENT','COORDINATION']}).activities.length>0));
test('rubiks cube progressively removes hints',()=>{assert.equal(chooseAssistance({successfulAttempts:0,failedAttempts:3}),'DEMONSTRATION');assert.equal(chooseAssistance({successfulAttempts:6}),'INDEPENDENT')});
test('rejects impossible time',()=>assert.throws(()=>planTimeRoomSession({age:11,availableMinutes:300}),/INVALID_SESSION_PREFERENCES/));
test('adult can train in desk mode',()=>{const x=planTimeRoomSession({age:38,availableMinutes:20,domains:['RUBIKS_CUBE']});assert.ok(x.activities.some(a=>a.domain==='RUBIKS_CUBE'));assert.equal(x.supervision,'OPTIONAL')});
