export function registerSourceAnchor({anchorId,role,proofRef,locationRef}={}){
 if(!anchorId||!role) throw new Error("anchor_id_and_role_required");
 return {
   anchorId, role,
   proofRef:proofRef||null,
   locationRef:locationRef||"PRIVATE_OFF_REPO",
   authoritativeFor:["origin_verification","reconstruction_reference"],
   authoritativeForLegalOwnership:false,
   publicLocationAllowed:false
 };
}
