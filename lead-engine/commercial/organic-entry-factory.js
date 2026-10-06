export function proposeOrganicEntries({topic,territory="Toulouse",questions=[]}={}){
 if(!topic) throw new Error("topic_required");
 return {
  topic,territory,
  entries:[
   {type:"answer_page",purpose:"answer_specific_intent"},
   {type:"comparison",purpose:"clarify_options_without_fake_rankings"},
   {type:"mini_simulator",purpose:"turn_question_into_personal_context"},
   {type:"local_guide",purpose:"connect_topic_to_local_service_area"}
  ],
  questions,
  destination:"bilan_residentiel_gratuit",
  publicationAutomatic:false,
  officialSourcesRequiredForSensitiveFacts:true,
  fakeUrgency:false
 };
}
