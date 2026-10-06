import assert from "node:assert/strict";
import {attributeRevenue,aggregateThreadRevenue} from "../commercial/revenue-attribution.js";
import {bottleneckAction} from "../commercial/bottleneck-controller.js";
import {cashEngine} from "../commercial/cash-engine.js";

const a=attributeRevenue({saleId:"S1",leadId:"L1",threadId:"dpe",amount:2400,verified:true});
const b=attributeRevenue({saleId:"S2",leadId:"L2",threadId:"pac",amount:1000,verified:true});
assert.equal(aggregateThreadRevenue([a,b])[0].threadId,"dpe");
assert.equal(bottleneckAction({from:"qualified_lead",to:"appointment"}).action,"improve_booking_path");

const cash=cashEngine({verifiedRevenue:10000,directCosts:2000,reinvestmentCap:.2});
assert.equal(cash.contribution,8000);
assert.equal(cash.maxSuggestedReinvestment,1600);
assert.equal(cash.propertyCapitalCandidate,6400);
assert.equal(cash.automaticTransfer,false);
