import assert from "node:assert/strict";
import test from "node:test";

import { eggChecksum, verifyEggChecksum } from "../eggs/egg-integrity.js";
import { lineageFingerprint, reunionAssessment } from "../eggs/lineage-reunion.js";
import { reconstructionPlan } from "../eggs/reconstruction-plan.js";

const eggA = {
  schema_version: 1,
  protocol: "SLP-draft-0.1",
  egg_id: "SPIDER-EGG-G1-A",
  generation: 1,
  parent_lineage: "SPIDER-ANCESTRAL-PAYKULLIANA",
  integrity: { checksum: "placeholder", signature: "placeholder" }
};

const eggB = {
  ...eggA,
  egg_id: "SPIDER-EGG-G1-B"
};

test("egg checksum ignores mutable integrity envelope", () => {
  const first = eggChecksum(eggA);
  const changedEnvelope = structuredClone(eggA);
  changedEnvelope.integrity.checksum = "different";
  changedEnvelope.integrity.signature = "different";
  assert.equal(eggChecksum(changedEnvelope), first);
  assert.equal(verifyEggChecksum(eggA, first).valid, true);
});

test("egg checksum detects payload mutation", () => {
  const expected = eggChecksum(eggA);
  const mutated = { ...eggA, generation: 99 };
  assert.equal(verifyEggChecksum(mutated, expected).valid, false);
});

test("sibling eggs can recognize a reunion candidate without auto merge", () => {
  const result = reunionAssessment(eggA, eggB);
  assert.equal(result.same_origin, true);
  assert.equal(result.reunion_candidate, true);
  assert.equal(result.authenticated_merge_required, true);
  assert.equal(result.automatic_merge, false);
  assert.equal(result.customer_data_merge, false);
  assert.equal(lineageFingerprint(eggA), lineageFingerprint(eggB));
});

test("unrelated lineage is rejected", () => {
  const stranger = { ...eggB, parent_lineage: "OTHER-LINEAGE" };
  assert.equal(reunionAssessment(eggA, stranger).reunion_candidate, false);
});

test("reconstruction plan stays capability-gated and non-consequential", () => {
  const plan = reconstructionPlan(eggA, {
    capabilities: ["filesystem", "cryptography", "runtime"]
  });
  assert.equal(plan.find(x => x.stage === "verify_integrity").ready, true);
  assert.equal(plan.find(x => x.stage === "initialize_local_spider").ready, true);
  assert.equal(plan.find(x => x.stage === "request_guardian_acceptance_if_required").ready, false);
  assert.equal(plan.every(x => x.consequential === false), true);
});
