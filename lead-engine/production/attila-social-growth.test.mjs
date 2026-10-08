import test from 'node:test';
import assert from 'node:assert/strict';
import {planSocialCampaign,summarizeSocialTraffic} from './attila-social-growth.js';
test('campaign creates review-only network drafts',()=>{
 const result=planSocialCampaign({workspaceId:'posters',productName:'Affiche Pink Floyd',productUrl:'https://example.com/pink-floyd',networks:['PINTEREST','TIKTOK']});
 assert.equal(result.posts.length,2);assert.equal(result.posts[0].published,false);
 assert.match(result.posts[0].destinationUrl,/utm_source=pinterest/);
});
test('traffic requires verified orders and deduplicates',()=>{
 assert.throws(()=>summarizeSocialTraffic([{id:'x',network:'TIKTOK',type:'VERIFIED_ORDER',amountCents:3000}]));
 const result=summarizeSocialTraffic([{id:'x',network:'TIKTOK',type:'VERIFIED_ORDER',amountCents:3000,verified:true}]);
 assert.equal(result.byNetwork.TIKTOK.revenueCents,3000);
});
