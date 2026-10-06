export function generationRecord({generationId,parentId,eggId,armorId,createdAt}={}){
 if(!generationId) throw new Error("generation_id_required");
 return {
  generationId,
  parentId:parentId||null,
  eggId:eggId||null,
  armorId:armorId||null,
  createdAt:createdAt||null,
  immutableOrigin:true,
  privateProfileEmbedded:false
 };
}

export function compareGenerations(a={},b={}){
 return {
  sameOrigin:a.parentId===b.parentId,
  comparable:true,
  autoWinner:false,
  requiresEvidenceForInheritedMutation:true
 };
}
