import assert from "node:assert/strict";
import test from "node:test";
import { routeContentIntent } from "../content/intent-router.js";
import { dpeFunnelSignal } from "../content/dpe-funnel.js";

test("high-intent local owner is routed to assessment without auto contact",()=>{
 const r=routeContentIntent({intent:"high_intent_owner",engaged:true,owner:true,local:true});
 assert.equal(r.band,"high");
 assert.equal(r.destination,"bilan_residentiel_gratuit");
 assert.equal(r.automatic_contact,false);
});

test("DPE funnel keeps regulatory and promise safeguards",()=>{
 const s=dpeFunnelSignal({type:"assessment_cta_click",intent:"regulatory_information",owner:true,local:true,article:"dpe-obligatoire"});
 assert.equal(s.accepted,true);
 assert.equal(s.claims_policy.bnh_assessment_is_regulatory_dpe,false);
 assert.equal(s.claims_policy.dpe_gain_guaranteed,false);
});

test("unknown event is rejected",()=>assert.equal(dpeFunnelSignal({type:"magic"}).accepted,false));
