const ALLOWED = new Set(["communication","learning","interface","ritual","visual_identity"]);

export function buildRecipientPhenotype(preferences = {}) {
  const phenotype = {};
  for (const [key, value] of Object.entries(preferences)) {
    if (ALLOWED.has(key)) phenotype[key] = value;
  }
  return {
    phenotype,
    source: "private_consent_based_profile",
    changesAncestralLineage: false,
    embedsPrivateProfile: false
  };
}
