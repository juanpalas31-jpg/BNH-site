// Spider Language Protocol (SLP) — Attila <-> human
// Internal states are computed signals, not claims of biological sentience.

export const ATTILA_SIGNALS = Object.freeze({
  CALM:        { glyph: "···○···", label: "CALME", meaning: "Peu de vibrations. J'observe." },
  TRAIL:       { glyph: "··•→•··", label: "PISTE", meaning: "Signal détecté. Je vérifie." },
  PREY:        { glyph: "••→●←••", label: "PROIE", meaning: "Opportunité commerciale sérieuse détectée." },
  STRIKE:      { glyph: "⚡●⚡", label: "ATTAQUE", meaning: "Priorité élevée. Action recommandée maintenant." },
  CAPTURE:     { glyph: "●✓", label: "CAPTURE", meaning: "Prospect qualifié obtenu." },
  FOOD:        { glyph: "€→●", label: "NOURRITURE", meaning: "Valeur commerciale réelle et vérifiée obtenue." },
  DANGER:      { glyph: "▲▲▲", label: "DANGER", meaning: "Risque ou anomalie. Réduire l'exposition." },
  RETREAT:     { glyph: "←···", label: "RETRAIT", meaning: "Piste abandonnée ou différée." },
  VIGILANCE:   { glyph: "◉◉", label: "VIGILANCE", meaning: "Plusieurs vibrations simultanées." },
  DIGEST:      { glyph: "○Z", label: "DIGESTION", meaning: "Capacité occupée. Analyse des résultats." }
});

const clamp = n => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));

export function computeAttilaState(input = {}) {
  const {
    hoursSinceCapture = 0, targetGapPct = 100, availableCapacityPct = 100,
    signalStrength = 0, urgency = 0, fit = 0, estimatedValue = 0,
    legalRisk = 0, anomalyRisk = 0, uncertainty = 0, costRisk = 0,
    pipelineLoad = 0, verifiedValuePct = 0
  } = input;

  const hunger = clamp(
    0.35 * clamp(hoursSinceCapture / 72 * 100) +
    0.35 * clamp(targetGapPct) +
    0.30 * clamp(availableCapacityPct)
  );
  const excitement = clamp(
    0.35 * clamp(signalStrength) + 0.25 * clamp(urgency) +
    0.25 * clamp(fit) + 0.15 * clamp(estimatedValue)
  );
  const danger = clamp(
    0.35 * clamp(legalRisk) + 0.25 * clamp(anomalyRisk) +
    0.25 * clamp(uncertainty) + 0.15 * clamp(costRisk)
  );
  const satiety = clamp(0.60 * clamp(pipelineLoad) + 0.40 * clamp(verifiedValuePct));

  let mode = "HUNT";
  let signal = ATTILA_SIGNALS.CALM;
  if (danger >= 70) { mode = "RETREAT"; signal = ATTILA_SIGNALS.DANGER; }
  else if (satiety >= 80) { mode = "DIGEST"; signal = ATTILA_SIGNALS.DIGEST; }
  else if (excitement >= 80) { mode = "STRIKE_RECOMMENDED"; signal = ATTILA_SIGNALS.STRIKE; }
  else if (excitement >= 60) { mode = "QUALIFY"; signal = ATTILA_SIGNALS.PREY; }
  else if (signalStrength >= 25) { mode = "TRACK"; signal = ATTILA_SIGNALS.TRAIL; }
  else if (hunger >= 60) { mode = "HUNT"; signal = ATTILA_SIGNALS.VIGILANCE; }

  return Object.freeze({ hunger, excitement, danger, satiety, mode, signal });
}

export function translateAttila(state, facts = {}) {
  const s = state?.signal ?? ATTILA_SIGNALS.CALM;
  const captures = Math.max(0, Number(facts.captures) || 0);
  const verifiedRevenue = Math.max(0, Number(facts.verifiedRevenue) || 0);
  return {
    spider: s.glyph,
    human: `${s.label} — ${s.meaning}`,
    telemetry: {
      hunger: Math.round(state?.hunger ?? 0),
      excitement: Math.round(state?.excitement ?? 0),
      danger: Math.round(state?.danger ?? 0),
      satiety: Math.round(state?.satiety ?? 0),
      mode: state?.mode ?? "HUNT",
      captures,
      verifiedRevenue
    },
    truth: "computed_internal_state_not_sentience"
  };
}

export function attillaCommand(command = "") {
  const normalized = String(command).trim().toLowerCase();
  if (/ressenti|etat|état/.test(normalized)) return "REPORT_STATE";
  if (/où.*proie|ou.*proie|piste/.test(normalized)) return "REPORT_PREY";
  if (/chasse|feu/.test(normalized)) return "HUNT";
  if (/rentre|repaire|repos/.test(normalized)) return "RETURN_TO_LAIR";
  if (/pourquoi|abandon/.test(normalized)) return "EXPLAIN_DECISION";
  return "UNKNOWN";
}
