import test from 'node:test';import assert from 'node:assert/strict';
import {createBrain,think} from './attila-brain.js';
const brain=createBrain({ownerId:'owner_test',workspaceId:'vinted-juanpalas'});
test('brain delegates organic campaign creation to Attila creative engine',()=>{
 const x=think(brain,{ownerId:'owner_test',workspaceId:'vinted-juanpalas',organ:'ORGANIC_CREATIVE',intent:'CREATE_CAMPAIGN',payload:{product:{title:'Affiche test',priceCents:2000},listingUrl:'https://www.vinted.fr/items/123-test',keywords:['affiche']}});
 assert.equal(x.accepted,true);assert.equal(x.decision,'ORGANIC_CAMPAIGN_DRAFTED');assert.equal(x.result.agent,'ATTILA');assert.equal(x.result.paidMedia,false);
});
test('brain ranks supplied campaign outcomes',()=>{
 const x=think(brain,{ownerId:'owner_test',workspaceId:'vinted-juanpalas',organ:'ORGANIC_CREATIVE',intent:'RANK_RESULTS',payload:{metrics:[{id:'a',impressions:10,clicks:1,verifiedOrders:0}]}});
 assert.equal(x.decision,'ORGANIC_RESULTS_RANKED');assert.equal(x.result[0].id,'a');
});
