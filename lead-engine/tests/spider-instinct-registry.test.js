import test from "node:test";
import assert from "node:assert/strict";
import {selectSpiderInstinct,instinctDecision} from "../dna/spider-instinct-registry.js";

test("mail dormant search selects roaming hunt",()=>{
  const mode=selectSpiderInstinct({territory:"MAIL",dormant_search:true,signal_strength:25});
  assert.equal(mode.spider,"Lycosidae");
  assert.equal(mode.digital_mode,"ROAMING_HUNT");
});

test("strong signal selects targeted interception",()=>{
  const d=instinctDecision({territory:"WEB",signal_strength:91,authorization:true});
  assert.equal(d.spider_mode,"Deinopidae");
  assert.equal(d.digital_mode,"TARGETED_INTERCEPTION");
  assert.equal(d.automatic_contact,false);
});

test("complex path selects tactical reasoning",()=>{
  const d=instinctDecision({territory:"CRM",path_count:4,signal_strength:40,authorization:true});
  assert.equal(d.spider_mode,"Portia fimbriata");
  assert.equal(d.digital_mode,"TACTICAL_REASONING");
  assert.equal(d.authorization_required,true);
});


test("unauthorized territory is blocked before hunting",()=>{
  const d=instinctDecision({territory:"MAIL",dormant_search:true,signal_strength:30});
  assert.equal(d.blocked,true);
  assert.equal(d.reason,"TERRITORY_NOT_AUTHORIZED");
  assert.equal(d.automatic_contact,false);
});

test("explicit authorized territory can hunt",()=>{
  const d=instinctDecision({territory:"MAIL",authorized_territories:["MAIL"],dormant_search:true,signal_strength:30});
  assert.equal(d.blocked,false);
  assert.equal(d.spider_mode,"Lycosidae");
});
