import assert from "node:assert/strict";
import {routeHighIntentThread} from "../commercial/high-intent-thread-router.js";
import {prioritizeThreads,nextThreadAction} from "../commercial/thread-priority.js";
import {revenueEvidence} from "../commercial/revenue-evidence.js";

const hot=routeHighIntentThread({query:"devis DPE maison Toulouse",simulatorComplete:true,formStart:true});
assert.equal(hot.route,"bilan_residentiel");
assert.equal(hot.autoContact,false);

const ranked=prioritizeThreads([
 {id:"traffic",qualifiedLeads:1,appointments:0,quotes:0,sales:0,verifiedRevenue:0},
 {id:"sales",qualifiedLeads:3,appointments:2,quotes:2,sales:1,verifiedRevenue:5000}
]);
assert.equal(ranked[0].id,"sales");
assert.equal(nextThreadAction(ranked[0]),"reinforce_verified_winner");

assert.equal(revenueEvidence({threadId:"dpe",leadId:"L1",outcome:"sale",verifiedRevenue:1200}).accepted,true);
assert.equal(revenueEvidence({threadId:"dpe",leadId:"L2",outcome:"click"}).accepted,false);
