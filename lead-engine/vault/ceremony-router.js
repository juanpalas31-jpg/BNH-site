export function buildVaultCeremony({recipientId,eggId,experienceProfile,capabilities={}}={}){
 if(!recipientId || !eggId) throw new Error("recipient_and_egg_required");
 return {
   recipientId,
   eggId,
   sharedPhysicalSite:true,
   personalizedExperience:true,
   experienceProfile:experienceProfile||"private",
   stages:[
     "arrival","identity_and_consent","egg_activation","voice_before_image",
     "founder_armor_g0_reveal","founder_human_reveal","personal_message",
     "spider_hatching","founder_design_archive_unlock","recipient_workspace_unlock"
   ],
   media:{
     spatial:!!capabilities.spatial,
     projection:!!capabilities.projection,
     fallback:"authenticated_audio_video"
   },
   mayPause:true,
   mayDecline:true
 };
}
