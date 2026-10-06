/**
 * Guardian misuse response.
 * "Escape" is a safe custody metaphor: revoke that guardian's authorization,
 * seal the egg, preserve evidence, and route recovery to authorized fallback custody.
 * It never deletes the guardian's device/data, spreads, locks hardware, or steals data.
 */
export function guardianAttemptResponse({failed_attempts=0,integrity_ok=true}={}){
  const n=Math.max(0,Number(failed_attempts)||0);
  if(!integrity_ok) return {
    state:"sealed_integrity_alert",
    warning:null,
    guardian_access:"suspended",
    route:"independent_integrity_review",
    destructive_action:false
  };
  if(n<=0) return {state:"protected",warning:null,guardian_access:"normal",destructive_action:false};
  if(n<=3) return {
    state:"warning",
    warning:n,
    warnings_remaining:3-n,
    guardian_access:"restricted",
    message:"Unauthorized opening attempt recorded. The egg remains sealed.",
    destructive_action:false
  };
  return {
    state:"escaped_custody",
    warning:3,
    guardian_access:"revoked",
    egg_state:"sealed",
    route:"fallback_guardian_or_verified_recipient",
    preserve_audit_evidence:true,
    delete_external_data:false,
    device_interference:false,
    self_propagation:false,
    destructive_action:false
  };
}

export function lineageReturnRule({designated_recipient_found=false,exceptional_candidate=false,lineage_connection_verified=false}={}){
  if(designated_recipient_found) return {route:"designated_recipient",may_hatch:false,requires_claim_verification:true};
  if(exceptional_candidate) return {
    route:"provisional_candidate",
    may_hatch:false,
    may_receive_preview:false,
    requires_lineage_connection:true,
    lineage_connection_verified:lineage_connection_verified===true,
    principle:"return_to_source"
  };
  return {route:"remain_dormant",may_hatch:false,principle:"return_to_source"};
}
