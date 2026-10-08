import test from 'node:test';import assert from 'node:assert/strict';
import {createVideoMission,buildRenderJobs,acceptRenderedAsset} from './attila-ai-video.js';
const mission=createVideoMission({workspaceId:'vinted-juanpalas',product:{title:'Affiche test',priceCents:2500},listingUrl:'https://www.vinted.fr/items/123-test',networks:['TIKTOK','YOUTUBE_SHORTS'],facts:['50 x 70 cm']});
test('creates platform-specific video variants',()=>{assert.equal(mission.agent,'ATTILA');assert.equal(mission.variants.length,2);assert.equal(mission.variants[0].ratio,'9:16')});
test('does not claim videos rendered without provider',()=>assert.equal(buildRenderJobs(mission)[0].status,'BLOCKED_NO_RENDERER'));
test('configured renderer creates render-ready jobs',()=>assert.equal(buildRenderJobs(mission,{providerConfigured:true})[0].status,'READY_FOR_RENDERER'));
test('render result requires verification',()=>assert.throws(()=>acceptRenderedAsset(buildRenderJobs(mission,{providerConfigured:true})[0],{assetUrl:'https://cdn.example/video.mp4',verified:false})));
