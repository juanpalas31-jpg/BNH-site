import crypto from "node:crypto";

const hash = value => crypto.createHash("sha256").update(String(value)).digest("hex").slice(0,24);

export function lineageFingerprint(egg) {
  return hash([egg.protocol, egg.parent_lineage, egg.generation].join("|"));
}

export function reunionAssessment(a,b) {
  const sameOrigin = Boolean(a?.parent_lineage && a.parent_lineage === b?.parent_lineage);
  const compatibleProtocol = String(a?.protocol||"").split("-")[0] === String(b?.protocol||"").split("-")[0];
  const distinctEggs = Boolean(a?.egg_id && b?.egg_id && a.egg_id !== b.egg_id);
  return {
    same_origin: sameOrigin,
    compatible_protocol: compatibleProtocol,
    distinct_eggs: distinctEggs,
    reunion_candidate: sameOrigin && compatibleProtocol && distinctEggs,
    authenticated_merge_required: true,
    automatic_merge: false,
    customer_data_merge: false
  };
}
