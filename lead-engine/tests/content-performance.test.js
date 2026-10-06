import assert from "node:assert/strict";
import test from "node:test";
import { rankClusters } from "../content/cluster-performance.js";
import { contentNextAction } from "../content/content-next-action.js";

test("business outcome can outrank raw traffic",()=>{
 const r=rankClusters([
  {cluster:"generic",views:10000,engaged:1000,form_submits:10,revenue:100},
  {cluster:"dpe",views:500,engaged:200,cta_clicks:60,form_submits:20,appointments:8,sales:2,revenue:5000}
 ]);
 assert.equal(r[0].cluster,"dpe");
});

test("low evidence never triggers reinforcement",()=>{
 const a=contentNextAction({cluster:"dpe",views:20,engaged:15,cta_clicks:5,form_submits:2,appointments:1},100);
 assert.equal(a.action,"observe");
 assert.equal(a.automatic_publish,false);
});

test("proven downstream outcomes become review candidate only",()=>{
 const a=contentNextAction({cluster:"dpe",views:500,engaged:200,cta_clicks:50,form_submits:20,appointments:5,sales:1,revenue:2000},100);
 assert.equal(a.action,"candidate_for_reinforcement");
 assert.equal(a.automatic_publish,false);
});
