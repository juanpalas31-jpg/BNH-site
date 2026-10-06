export function prepareEggHandoff({eggId,branchId,guardianProofs=[],vaultReady=false}={}){
 if(!eggId||!branchId) throw new Error("egg_and_branch_required");
 return {
  eggId,branchId,
  guardianProofCount:guardianProofs.length,
  vaultReady,
  handoffReady:vaultReady&&guardianProofs.length>0,
  recipientIdentityStillRequired:true,
  consentStillRequired:true,
  guardianMayHatch:false,
  guardianMayChangeBranch:false
 };
}
