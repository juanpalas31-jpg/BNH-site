import { createHash, randomUUID } from 'node:crypto';

const TRANSITIONS = Object.freeze({
  mission_offered: { accept: 'accepted', decline: 'fallback_guardian', no_response: 'fallback_guardian' },
  accepted: { custody_confirmed: 'custody_active', withdrawal: 'fallback_guardian' },
  custody_active: { authorized_recipient_found: 'transmission_pending', guardian_unavailable: 'fallback_guardian' },
  transmission_pending: { independent_verification_passed: 'transmission_verified', verification_failed: 'custody_active' },
  transmission_verified: { recipient_accepts: 'mission_complete', recipient_declines: 'custody_active' },
  mission_complete: { reward_review_passed: 'reward_capsule_eligible' }
});

export class GuardianTransitionError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'GuardianTransitionError';
    this.code = code;
  }
}

const truthy = value => value === true;
const count = value => Math.max(0, Math.floor(Number(value) || 0));
const canonical = value => JSON.stringify(value, Object.keys(value).sort());

function requireEvidence(state, event, evidence = {}) {
  if (state === 'mission_offered' && event === 'accept' && !truthy(evidence.guardian_consent)) {
    throw new GuardianTransitionError('GUARDIAN_CONSENT_REQUIRED', 'Guardian consent is required.');
  }
  if (state === 'accepted' && event === 'custody_confirmed') {
    if (!truthy(evidence.custody_receipt_verified) || count(evidence.independent_verifiers) < 2) {
      throw new GuardianTransitionError('CUSTODY_EVIDENCE_INSUFFICIENT', 'Custody requires a verified receipt and two independent verifiers.');
    }
  }
  if (state === 'custody_active' && event === 'authorized_recipient_found' && !truthy(evidence.recipient_authorization_candidate)) {
    throw new GuardianTransitionError('RECIPIENT_CANDIDATE_REQUIRED', 'A recipient authorization candidate is required.');
  }
  if (state === 'transmission_pending' && event === 'independent_verification_passed') {
    const valid = truthy(evidence.recipient_authorized) && truthy(evidence.egg_integrity_verified) && count(evidence.independent_verifiers) >= 2;
    if (!valid) throw new GuardianTransitionError('INDEPENDENT_VERIFICATION_INSUFFICIENT', 'Recipient, egg integrity and two independent verifiers are required.');
  }
  if (state === 'transmission_verified' && event === 'recipient_accepts' && !truthy(evidence.recipient_consent)) {
    throw new GuardianTransitionError('RECIPIENT_CONSENT_REQUIRED', 'Recipient consent is required.');
  }
  if (state === 'mission_complete' && event === 'reward_review_passed') {
    const valid = truthy(evidence.mission_receipt_verified) && truthy(evidence.independent_review_passed) && truthy(evidence.legal_release_authorized);
    if (!valid) throw new GuardianTransitionError('REWARD_REVIEW_INSUFFICIENT', 'Reward capsule eligibility requires verified completion, independent review and legal authorization.');
  }
}

function sanitizeEvidence(evidence = {}) {
  const allowed = [
    'guardian_consent', 'custody_receipt_verified', 'independent_verifiers',
    'recipient_authorization_candidate', 'recipient_authorized', 'egg_integrity_verified',
    'recipient_consent', 'mission_receipt_verified', 'independent_review_passed',
    'legal_release_authorized', 'reason_code'
  ];
  return Object.fromEntries(allowed.filter(key => key in evidence).map(key => [key, evidence[key]]));
}

function receiptHash(receipt) {
  return createHash('sha256').update(canonical(receipt)).digest('hex');
}

export function initialGuardianState({ eggId, missionId = randomUUID() } = {}) {
  if (!eggId) throw new GuardianTransitionError('EGG_ID_REQUIRED', 'eggId is required.');
  return Object.freeze({
    schema_version: 1,
    mission_id: missionId,
    egg_id: eggId,
    state: 'mission_offered',
    sequence: 0,
    last_receipt_hash: null,
    reward_disclosed: false,
    automatic_payment_authorized: false
  });
}

export function applyGuardianEvent(current, event, evidence = {}, options = {}) {
  if (!current || !current.state) throw new GuardianTransitionError('INVALID_STATE', 'A current guardian state is required.');
  const next = TRANSITIONS[current.state]?.[event];
  if (!next) throw new GuardianTransitionError('TRANSITION_NOT_ALLOWED', `Event ${event} is not allowed from ${current.state}.`);
  requireEvidence(current.state, event, evidence);

  const timestamp = options.timestamp || new Date().toISOString();
  const receipt = {
    schema_version: 1,
    mission_id: current.mission_id,
    egg_id: current.egg_id,
    sequence: current.sequence + 1,
    from: current.state,
    event,
    to: next,
    evidence: sanitizeEvidence(evidence),
    previous_hash: current.last_receipt_hash,
    timestamp
  };
  const hash = receiptHash(receipt);
  const rewardEligible = next === 'reward_capsule_eligible';

  return {
    state: Object.freeze({
      ...current,
      state: next,
      sequence: receipt.sequence,
      last_receipt_hash: hash,
      reward_disclosed: rewardEligible,
      automatic_payment_authorized: false
    }),
    receipt: Object.freeze({ ...receipt, hash }),
    effects: Object.freeze({
      activate_fallback: next === 'fallback_guardian',
      disclose_reward_capsule: rewardEligible,
      transfer_money: false,
      interfere_with_device: false
    })
  };
}

export function verifyReceiptChain(receipts = []) {
  let previous = null;
  for (let index = 0; index < receipts.length; index += 1) {
    const { hash, ...unsigned } = receipts[index];
    if (unsigned.sequence !== index + 1 || unsigned.previous_hash !== previous || receiptHash(unsigned) !== hash) return false;
    previous = hash;
  }
  return true;
}

export const guardianTransitions = TRANSITIONS;
