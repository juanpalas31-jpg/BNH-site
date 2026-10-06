import assert from "node:assert/strict";
import test from "node:test";
import { commercialFeedbackLoop } from "../web/commercial-feedback-loop.js";
import { mapJourneyToStrategyOutcome,validateOutcome } from "../web/strategy-outcome-mapper.js";

test("Spider ranks revenue-producing qualified path above vanity traffic",()=>{
 const r=commercialFeedbackLoop([
  {cluster:"generic",views:8000,engaged:900,cta_clicks:50,form_submits:8,appointments:2,sales:0,revenue:0},
  {cluster:"dpe",views:600,engaged:260,cta_clicks:80,form_submits:24,appointments:10,sales:3,revenue:7200}
 ]);
 assert.equal(r.ranking[0].cluster,"dpe");
 assert.equal(r.safeguards.automatic_publication,false);
});

test("measured journey maps cleanly to strategy outcome",()=>{
 const o=mapJourneyToStrategyOutcome({cluster:"dpe",views:600,form_submits:24,appointments:10,sales:3,revenue:7200});
 assert.equal(o.strategy_id,"dpe");
 assert.equal(o.synthetic,false);
 assert.equal(validateOutcome(o).valid,true);
});

test("impossible funnel counts are rejected",()=>{
 const o=mapJourneyToStrategyOutcome({cluster:"dpe",views:10,form_submits:20,appointments:2,sales:1,revenue:10});
 assert.equal(validateOutcome(o).valid,false);
});
