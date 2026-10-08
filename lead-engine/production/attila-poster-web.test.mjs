import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPosterLanding,validateMarketplaceLink} from './attila-poster-web.js';
test('rejects unsafe destination',()=>assert.throws(()=>validateMarketplaceLink('VINTED','https://example.com/item')));
test('generates unindexed draft with marketplace checkout',()=>{
 const p=buildPosterLanding({workspaceId:'posters',title:'Pink Floyd The Wall',description:'Affiche de collection',priceCents:3000,platform:'VINTED',listingUrl:'https://www.vinted.fr/items/123',stockConfirmed:true});
 assert.equal(p.status,'DRAFT_NOT_DEPLOYED');assert.match(p.files['index.html'],/noindex,nofollow/);assert.match(p.files['index.html'],/www.vinted.fr\/items\/123/);
});
