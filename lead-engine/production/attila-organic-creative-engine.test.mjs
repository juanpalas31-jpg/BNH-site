import test from 'node:test';import assert from 'node:assert/strict';
import {createOrganicCampaign,rankOrganicCreatives} from './attila-organic-creative-engine.js';
const base={workspaceId:'vinted-juanpalas',product:{title:'Affiche Pink Floyd',priceCents:3000},listingUrl:'https://www.vinted.fr/items/123-example',keywords:['pink floyd','affiche rock'],proof:['Format vérifié par le vendeur']};
test('creates unpaid multi-channel creative pack',()=>{const x=createOrganicCampaign(base);assert.equal(x.paidMedia,false);assert.equal(x.creatives.length,6);assert.equal(x.publication.automatic,false)});
test('rejects insecure destination',()=>assert.throws(()=>createOrganicCampaign({...base,listingUrl:'http://example.com'})));
test('does not invent proof',()=>{const x=createOrganicCampaign({...base,proof:[]});assert.deepEqual(x.creatives[0].claims,[])});
test('ranks verified outcomes before engagement',()=>{const x=rankOrganicCreatives([{id:'a',impressions:100,clicks:50,verifiedOrders:0},{id:'b',impressions:100,clicks:5,verifiedOrders:1}]);assert.equal(x[0].id,'b')});
