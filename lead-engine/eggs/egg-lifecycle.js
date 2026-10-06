const ORDER=["dormant","integrity_verified","lineage_verified","claim_pending","claim_verified","legacy_ready","hatched"];

export function eggLifecycle(input={}){
  const checks={
    integrity:input.integrity_verified===true,
    lineage:input.lineage_verified===true,
    claim:input.claim_verified===true,
    recipient_consent:input.recipient_consent===true
  };
  let state="dormant";
  if(checks.integrity) state="integrity_verified";
  if(checks.integrity&&checks.lineage) state="lineage_verified";
  if(checks.integrity&&checks.lineage&&input.claim_started===true) state="claim_pending";
  if(checks.integrity&&checks.lineage&&checks.claim) state="claim_verified";
  if(checks.integrity&&checks.lineage&&checks.claim&&input.legacy_capsule_available===true) state="legacy_ready";
  if(checks.integrity&&checks.lineage&&checks.claim&&checks.recipient_consent) state="hatched";
  return {state,rank:ORDER.indexOf(state),checks,automatic_hatching:false};
}
