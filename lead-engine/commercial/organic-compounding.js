export function compoundingPlan({winner,relatedIntents=[]}={}){
 if(!winner?.threadId) return {status:"NO_VERIFIED_WINNER",entries:[]};
 return {
  status:"PROPOSED",
  sourceThread:winner.threadId,
  entries:relatedIntents.slice(0,8).map(intent=>({
   intent,
   relationship:"adjacent_user_need",
   linkTo:winner.threadId,
   destination:"bilan_residentiel_gratuit"
  })),
  cloneContent:false,
  doorwayPages:false,
  humanReviewBeforePublish:true
 };
}
