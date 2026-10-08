import test from 'node:test';import assert from 'node:assert/strict';
import {draftVoiceArchive,planPodcastExcerpt} from './spider-engine-memory.js';
const base={workspaceId:'family',recordingId:'voice_001',recordedAt:'2026-10-08T18:00:00+02:00',sha256:'a'.repeat(64),mediaType:'audio/mp4',durationSeconds:90,participants:[{slot:'PARENT',role:'ADULT'},{slot:'CHILD_A',role:'MINOR'}]};
test('missing consent blocks archival use and podcast',()=>{const a=draftVoiceArchive(base);assert.equal(a.archiveAllowed,false);assert.equal(a.podcastAllowed,false);assert.equal(planPodcastExcerpt(a,{startSeconds:0,endSeconds:30,editorApproved:true}).published,false)});
test('podcast needs separate consent from all participants',()=>{const a=draftVoiceArchive({...base,consent:{PARENT:{archive:true,podcast:true},CHILD_A:{archive:true,podcast:false}}});assert.equal(a.archiveAllowed,true);assert.equal(a.podcastAllowed,false)});
test('draft never stores media or publishes',()=>{const a=draftVoiceArchive({...base,consent:{PARENT:{archive:true,podcast:true},CHILD_A:{archive:true,podcast:true}}});assert.equal(a.originalObjectKey,null);assert.equal(planPodcastExcerpt(a,{startSeconds:2,endSeconds:20,editorApproved:true}).published,false)});
test('reject invalid hash',()=>assert.throws(()=>draftVoiceArchive({...base,sha256:'bad'})));
