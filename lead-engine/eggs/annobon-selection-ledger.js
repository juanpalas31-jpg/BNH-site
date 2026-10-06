export function createSelectionRecord(input={}){
  return {
    egg_id:"SPIDER-EGG-ANNOBON-01",
    candidate_ref:input.candidate_ref||null,
    island_verified:input.island_verified===true,
    adult_verified:input.adult_verified===true,
    consent_verified:input.consent_verified===true,
    criteria_version:input.criteria_version||"baseline-0.1",
    evidence_refs:Array.isArray(input.evidence_refs)?input.evidence_refs:[],
    reviewer_refs:Array.isArray(input.reviewer_refs)?input.reviewer_refs:[],
    decision:input.decision||"pending",
    reason:input.reason||null,
    political_jurisdiction_irrelevant:true,
    raw_sensitive_profile_embedded:false
  };
}

export function selectionRecordReady(r={}){
  return Boolean(
    r.candidate_ref &&
    r.island_verified &&
    r.adult_verified &&
    r.consent_verified &&
    r.evidence_refs?.length &&
    r.reviewer_refs?.length &&
    ["approved","rejected"].includes(r.decision)
  );
}
