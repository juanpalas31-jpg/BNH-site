// Evidence-based PRE-FLIGHT gate for Mini-Tila finishers.
// Source references are traceability hints, not cryptographic verification.
function githubReference(source) {
  return typeof source?.reference === "string" && source.reference.startsWith("https://github.com/") &&
    (source.reference.includes("/blob/") || source.reference.includes("/commit/"));
}
export function verifyFinisherPreflight(preflight) {
  const sources = Array.isArray(preflight?.memory?.sources) ? preflight.memory.sources : [];
  const project = preflight?.project;
  const scoped = sources.filter(source => source.project === project);
  const hasRepo = scoped.some(source => source.kind === "REPOSITORY_CODE" && githubReference(source));
  const hasDecisions = scoped.some(source => source.kind === "VALIDATED_DECISIONS" && source.validated === true && githubReference(source));
  const hasEvidence = scoped.some(source => ["TEST_EVIDENCE", "DEPLOYMENT_EVIDENCE"].includes(source.kind) && githubReference(source));
  const hasTheme = typeof preflight?.intent?.theme === "string" && preflight.intent.theme.trim().length > 0;
  const hasRequirements = Array.isArray(preflight?.audit?.required) && preflight.audit.required.length > 0;
  const reasons = [];
  if (!preflight?.ready || preflight?.phase !== "PRE_FLIGHT") reasons.push("PREFLIGHT_NOT_READY");
  if (!hasRepo) reasons.push("REPOSITORY_SOURCE_MISSING");
  if (!hasDecisions) reasons.push("VALIDATED_DECISIONS_MISSING");
  if (!hasEvidence) reasons.push("TEST_OR_DEPLOYMENT_EVIDENCE_MISSING");
  if (!hasTheme) reasons.push("VALIDATED_THEME_MISSING");
  if (!hasRequirements) reasons.push("ACCEPTANCE_REQUIREMENTS_MISSING");
  return Object.freeze({allowed: reasons.length === 0, reasons, project});
}
