export function openRecipientWorkspace({branchId,firstAwakeningComplete=false}={}){
 if(!branchId) throw new Error("branch_required");
 if(!firstAwakeningComplete) return {unlocked:false,reason:"first_awakening_incomplete"};
 return {
  unlocked:true,
  branchId,
  inherited:["spider_design_knowledge","armor_g0_archive","authorized_founder_history"],
  blank:["recipient_armor","recipient_mission","recipient_projects"],
  principle:"inherit_the_source_then_write_your_own_branch"
 };
}
