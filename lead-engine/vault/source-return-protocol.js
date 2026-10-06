export function requestReturnToSource({branchId,reason,proofs=[]}={}){
 if(!branchId) throw new Error("branch_required");
 return {
  branchId,reason:reason||"voluntary_return",
  proofs,
  authorized:false,
  requiredChecks:["lineage_proof","integrity_proof","human_authorization"],
  mergeAutomatic:false,
  ancestorOverwrite:false
 };
}

export function approveReturn({lineageProof=false,integrityProof=false,humanAuthorization=false}={}){
 const approved=lineageProof&&integrityProof&&humanAuthorization;
 return {approved,mode:approved?"controlled_comparison":"denied",blindMerge:false};
}
