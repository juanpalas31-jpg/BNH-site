/**
 * ATTILA — Arachnid Ambush Doctrine
 *
 * Attila is a digital spider driven by an arachnid AI doctrine.
 * Core principle: a spider does not advertise its web.
 *
 * State machine:
 * IMMOBILE -> AMBUSH -> SIGNAL_DETECTED -> PREPARE_POUNCE -> POUNCE_PROPOSAL
 *
 * "Pounce" is a bounded software decision proposal. It NEVER bypasses
 * owner/publisher gates, never contacts a person autonomously, never spends,
 * and never performs destructive or offensive actions.
 */

export const ATTILA_ARACHNID_IDENTITY = Object.freeze({
  species: "DIGITAL_SPIDER",
  intelligence: "ARACHNID_AI",
  doctrine: "AMBUSH_BEFORE_ACTION",
  advertising_the_web: "FORBIDDEN",
  reveal_commercial_path: "ONLY_WHEN_CONTEXTUALLY_RELEVANT",
  raw_pii_memory: "FORBIDDEN",
  autonomous_contact: false,
  autonomous_publish: false,
  autonomous_spend: false,
  destructive_action: false,
  offensive_action: false
});

export const AMBUSH_STATES = Object.freeze({
  IMMOBILE: "IMMOBILE",
  AMBUSH: "AMBUSH",
  SIGNAL_DETECTED: "SIGNAL_DETECTED",
  PREPARE_POUNCE: "PREPARE_POUNCE",
  POUNCE_PROPOSAL: "POUNCE_PROPOSAL"
});

function n(v){ return Number.isFinite(Number(v)) ? Number(v) : 0; }

export function assessPreySignal(signal = {}) {
  const views = n(signal.views);
  const starts = n(signal.form_starts ?? signal.starts);
  const leads = n(signal.leads);
  const highIntent = n(signal.high_intent ?? signal.highIntent);
  const relevance = Math.max(0, Math.min(1, n(signal.relevance)));

  const score =
    Math.min(25, views * 0.5) +
    Math.min(20, starts * 4) +
    Math.min(30, leads * 10) +
    Math.min(15, highIntent * 7.5) +
    relevance * 10;

  return {
    score: Math.round(score),
    detected: score >= 18,
    strong: score >= 45
  };
}

export function ambushDecision(signal = {}, context = {}) {
  const prey = assessPreySignal(signal);
  const editorialValue = Math.max(0, Math.min(1, n(context.editorial_value ?? context.editorialValue)));
  const commercialRelevance = Math.max(0, Math.min(1, n(context.commercial_relevance ?? context.commercialRelevance)));

  if (!prey.detected) {
    return {
      state: AMBUSH_STATES.IMMOBILE,
      action: "OBSERVE_WITHOUT_REVEALING_WEB",
      publish: false,
      commercial_cta: false,
      reason: "No meaningful signal. Remain still and collect evidence."
    };
  }

  if (editorialValue < 0.55) {
    return {
      state: AMBUSH_STATES.AMBUSH,
      action: "WAIT_AND_IMPROVE_EDITORIAL_VALUE",
      publish: false,
      commercial_cta: false,
      reason: "Signal exists, but the content is not useful enough to justify movement."
    };
  }

  if (!prey.strong) {
    return {
      state: AMBUSH_STATES.SIGNAL_DETECTED,
      action: "WEAVE_USEFUL_EDITORIAL_NODE_AND_MEASURE",
      publish: false,
      commercial_cta: false,
      reason: "Interest detected. Build value first; stay commercially hidden."
    };
  }

  if (commercialRelevance < 0.6) {
    return {
      state: AMBUSH_STATES.PREPARE_POUNCE,
      action: "STRENGTHEN_CONTEXT_WITHOUT_FORCING_OFFER",
      publish: false,
      commercial_cta: false,
      reason: "Strong interest, but commercial transition would be artificial."
    };
  }

  return {
    state: AMBUSH_STATES.POUNCE_PROPOSAL,
    action: "PROPOSE_CONTEXTUAL_CONVERSION_PATH",
    publish: false,
    commercial_cta: true,
    reason: "Strong signal plus natural relevance. Prepare a bounded conversion path for validation.",
    gate: "OWNER_OR_VALIDATED_PUBLISHER"
  };
}

export function editorialCamouflage(article = {}) {
  const useful = Boolean(article.useful_information);
  const sourced = Boolean(article.sourced);
  const independentReadValue = Boolean(article.valuable_without_offer);
  const forcedBranding = Boolean(article.forced_branding);

  return {
    ready: useful && sourced && independentReadValue && !forcedBranding,
    brand_visibility: forcedBranding ? "REJECT" : "DISCREET_OR_NONE",
    rule: "CONTENT_MUST_DESERVE_THE_CLICK_WITHOUT_THE_COMMERCIAL_OFFER",
    conversion_rule: "REVEAL_PATH_ONLY_AFTER_CONTEXTUAL_RELEVANCE"
  };
}

export function arachnidDoctrineSnapshot(){
  return {
    identity: ATTILA_ARACHNID_IDENTITY,
    sequence: [
      AMBUSH_STATES.IMMOBILE,
      AMBUSH_STATES.AMBUSH,
      AMBUSH_STATES.SIGNAL_DETECTED,
      AMBUSH_STATES.PREPARE_POUNCE,
      AMBUSH_STATES.POUNCE_PROPOSAL
    ],
    principle: "WEAVE_QUIETLY_OBSERVE_PATIENTLY_POUNCE_ONLY_ON_VALIDATED_SIGNAL"
  };
}
