/** Time Room offline safety checklist.
 * Documentation only. Do not treat booleans supplied by clients as evidence.
 */
export const TIME_ROOM_LOCAL_SECURITY_REQUIREMENTS=Object.freeze({
 admission:'LOCAL_TRUSTED_CONTROLLER_ONLY',
 identity:'SERVER_VERIFIED_NOT_CLIENT_ASSERTED',
 invitation:'FOUNDER_PHYSICALLY_PRESENT_AND_EXPLICITLY_APPROVES',
 guest:'TEMPORARY_SESSION_NO_STORED_GUEST_ACCESS',
 family:'CHILDREN_NOT_ELIGIBLE_AS_ORDINARY_GUESTS',
 network:'DEFAULT_DENY_INBOUND_AND_OUTBOUND_REMOTE_ACCESS',
 session:'REVOKE_GUEST_ON_FOUNDER_EXIT_OR_SENSOR_FAILURE',
 enforcement:'DOOR_AND_NETWORK_CONTROLLER_NOT_IMPLEMENTED',
 tests:'NOT_EXECUTED'
});
export function assessLocalSecurityReadiness(evidence={}){
 const checks=['trustedController','verifiedIdentity','localPresenceSensor','networkIsolation','revocationEnforced','familyRelationshipVerified'];
 const missing=checks.filter(k=>evidence[k]!==true);
 return {ready:false,declaredComplete:missing.length===0,missing,mode:missing.length?'DESIGN_ONLY':'REQUIRES_INDEPENDENT_VERIFICATION',reason:'NO_HARDWARE_ATTESTATION_OR_ENFORCEMENT'};
}
