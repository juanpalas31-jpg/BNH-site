export function bottleneckAction(weakest={}){
 const key=[weakest.from,weakest.to].join(">");
 const actions={
  "organic_entry>content_engaged":"improve_intent_match",
  "content_engaged>simulator_start":"improve_simulator_relevance",
  "simulator_start>simulator_complete":"reduce_simulator_friction",
  "simulator_complete>form_start":"strengthen_assessment_bridge",
  "form_start>qualified_lead":"reduce_form_friction",
  "qualified_lead>appointment":"improve_booking_path",
  "appointment>quote":"improve_appointment_to_quote_process",
  "quote>sale":"review_offer_and_close_process"
 };
 return {transition:key,action:actions[key]||"observe_more",automaticChange:false};
}
