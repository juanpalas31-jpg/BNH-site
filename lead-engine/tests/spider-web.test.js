import assert from "node:assert/strict";
import test from "node:test";
import { buildThreadGraph, weakPoints } from "../web/thread-graph.js";
import { threadValue, compareThreads } from "../web/thread-value.js";

test("web graph detects dead ends and invalid threads",()=>{
 const g=buildThreadGraph([{id:"guide"},{id:"simulator"},{id:"form"},{id:"orphan"}],[
  {from:"guide",to:"simulator"},{from:"simulator",to:"form"},{from:"ghost",to:"form"}
 ]);
 assert.equal(g.invalid_threads,1);
 const weak=weakPoints(g);
 assert.ok(weak.some(x=>x.id==="form"&&x.dead_end));
 assert.ok(weak.some(x=>x.id==="orphan"&&x.orphan));
});

test("thread value measures business outcomes, not traffic alone",()=>{
 const a=threadValue({visits:100,qualified:20,appointments:8,sales:2,revenue:4000});
 assert.equal(a.qualification_rate,.2);
 assert.equal(a.revenue_per_visit,40);
 const ranked=compareThreads([
  {id:"noise",metrics:{visits:1000,qualified:5,revenue:100}},
  {id:"intent",metrics:{visits:100,qualified:20,revenue:4000}}
 ]);
 assert.equal(ranked[0].id,"intent");
});
