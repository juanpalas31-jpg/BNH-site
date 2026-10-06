import assert from "node:assert/strict";
import test from "node:test";
import { buildThreadGraph } from "../web/thread-graph.js";
import { proposeWebRepairs } from "../web/web-repair.js";
import { attributeFunnel,summarizeAttribution } from "../observability/funnel-attribution.js";

test("Spider proposes repair but never changes web automatically",()=>{
 const g=buildThreadGraph([{id:"dpe"},{id:"bilan"}],[{from:"dpe",to:"bilan"}]);
 const p=proposeWebRepairs(g,[{id:"dpe",views:500,engagement_rate:.4,cta_rate:.01,lead_rate:.005}]);
 assert.ok(p.some(x=>x.type==="review_contextual_cta"&&x.automatic_change===false));
});

test("organic DPE journey is attributable through sale and revenue",()=>{
 const sessions=attributeFunnel([
  {session_id:"s1",cluster:"dpe",article:"dpe-g-f-e",type:"article_view"},
  {session_id:"s1",type:"content_engaged"},
  {session_id:"s1",type:"assessment_cta_click"},
  {session_id:"s1",type:"form_submit"},
  {session_id:"s1",type:"appointment"},
  {session_id:"s1",type:"sale",revenue:3200}
 ]);
 const sum=summarizeAttribution(sessions);
 assert.equal(sum.dpe.sales,1);
 assert.equal(sum.dpe.revenue,3200);
 assert.equal(sessions[0].last_stage,"sale");
});
