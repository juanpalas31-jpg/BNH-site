export function generationRoom({recipientBranch,eraCapabilities={},privateProfileRef=null}={}){
 if(!recipientBranch) throw new Error("recipient_branch_required");
 return {
  recipientBranch,
  privateProfileRef,
  physicalRoom:"shared",
  presentation:"recipient_specific",
  eraCapabilities,
  founderArmor:"ARMOR-G0-FOUNDER",
  recipientArmorState:"UNWRITTEN",
  revealAncestorBeforeWorkspace:true,
  preserveSiblingSurprise:true,
  noPredeterminedAdultIdentity:true
 };
}
