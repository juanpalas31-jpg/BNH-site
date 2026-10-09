// Offline smoke test for the Mini-Tila fleet execution bridge.
// Run: node attila/test-execution-bridge.mjs
import assert from "node:assert/strict";
import {runFinisherFleet} from "./execution-bridge.mjs";

const captured=[];
const result=await runFinisherFleet({
  evidenceSink:async item=>captured.push(item)
});
assert.equal(result.worker,"ATTILA_FINISHER_FLEET");
assert.equal(result.report.length,3,"All three projects must be inspected");
assert.equal(captured.length,3,"Even blocked or incomplete cycles must be recorded");
assert.deepEqual(captured.map(x=>x.project),result.report.map(x=>x.project));
assert.ok(result.report.every(x=>x.status==="CONTEXT_INCOMPLETE"),"No evidence adapters means no execution");
assert.ok(result.report.every(x=>x.productionPublished===false));
console.log("PASS: three project reports, evidence sink, no unsafe execution");
