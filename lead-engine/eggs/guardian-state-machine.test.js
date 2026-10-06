import test from 'node:test';
import assert from 'node:assert/strict';
import { applyGuardianEvent, GuardianTransitionError, initialGuardianState, verifyReceiptChain } from './guardian-state-machine.js';

const at = sequence => `2036-01-0${sequence}T00:00:00.000Z`;

test('completes a guardian mission only with independent evidence and consent', () => {
  let state = initialGuardianState({ eggId: 'SPIDER-EGG-G1-A', missionId: 'mission-test' });
  const receipts = [];
  const step = (event, evidence) => {
    const result = applyGuardianEvent(state, event, evidence, { timestamp: at(state.sequence + 1) });
    state = result.state;
    receipts.push(result.receipt);
    return result;
  };

  step('accept', { guardian_consent: true });
  step('custody_confirmed', { custody_receipt_verified: true, independent_verifiers: 2 });
  step('authorized_recipient_found', { recipient_authorization_candidate: true });
  step('independent_verification_passed', { recipient_authorized: true, egg_integrity_verified: true, independent_verifiers: 2 });
  step('recipient_accepts', { recipient_consent: true });
  const final = step('reward_review_passed', { mission_receipt_verified: true, independent_review_passed: true, legal_release_authorized: true });

  assert.equal(state.state, 'reward_capsule_eligible');
  assert.equal(final.effects.disclose_reward_capsule, true);
  assert.equal(final.effects.transfer_money, false);
  assert.equal(state.automatic_payment_authorized, false);
  assert.equal(verifyReceiptChain(receipts), true);
});

test('refusal activates fallback without revealing a reward', () => {
  const state = initialGuardianState({ eggId: 'SPIDER-EGG-G1-B', missionId: 'decline-test' });
  const result = applyGuardianEvent(state, 'decline', { reason_code: 'voluntary_refusal' }, { timestamp: at(1) });
  assert.equal(result.state.state, 'fallback_guardian');
  assert.equal(result.effects.activate_fallback, true);
  assert.equal(result.state.reward_disclosed, false);
});

test('rejects verification without two independent verifiers', () => {
  const pending = { ...initialGuardianState({ eggId: 'SPIDER-EGG-G1-A' }), state: 'transmission_pending' };
  assert.throws(
    () => applyGuardianEvent(pending, 'independent_verification_passed', { recipient_authorized: true, egg_integrity_verified: true, independent_verifiers: 1 }),
    error => error instanceof GuardianTransitionError && error.code === 'INDEPENDENT_VERIFICATION_INSUFFICIENT'
  );
});

test('detects a modified audit receipt', () => {
  const start = initialGuardianState({ eggId: 'SPIDER-EGG-G1-A', missionId: 'tamper-test' });
  const { receipt } = applyGuardianEvent(start, 'accept', { guardian_consent: true }, { timestamp: at(1) });
  assert.equal(verifyReceiptChain([receipt]), true);
  assert.equal(verifyReceiptChain([{ ...receipt, event: 'decline' }]), false);
});
