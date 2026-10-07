import test from "node:test";
import assert from "node:assert/strict";
import { computeAttilaState, translateAttila, attillaCommand } from "../communication/spider-language-protocol.js";

test("high danger forces retreat regardless of hunger", () => {
  const s = computeAttilaState({ hoursSinceCapture: 200, targetGapPct: 100, availableCapacityPct: 100, legalRisk: 100, anomalyRisk: 100, uncertainty: 100 });
  assert.equal(s.mode, "RETREAT");
  assert.equal(s.signal.label, "DANGER");
});

test("strong legitimate opportunity becomes prey/strike recommendation, never automatic contact", () => {
  const s = computeAttilaState({ signalStrength: 95, urgency: 95, fit: 95, estimatedValue: 90, legalRisk: 0 });
  assert.equal(s.mode, "STRIKE_RECOMMENDED");
  const t = translateAttila(s, { captures: 0, verifiedRevenue: 0 });
  assert.equal(t.telemetry.captures, 0);
  assert.equal(t.telemetry.verifiedRevenue, 0);
  assert.equal(t.truth, "computed_internal_state_not_sentience");
});

test("human commands translate into bounded intents", () => {
  assert.equal(attillaCommand("Attila, ressenti ?"), "REPORT_STATE");
  assert.equal(attillaCommand("Attila chasse"), "HUNT");
  assert.equal(attillaCommand("Attila rentre au Repaire"), "RETURN_TO_LAIR");
  assert.equal(attillaCommand("Pourquoi tu as abandonné cette piste ?"), "EXPLAIN_DECISION");
});
