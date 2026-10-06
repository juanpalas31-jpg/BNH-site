export function capitalFlywheel(metrics={}){
 const qualified=Number(metrics.qualifiedLeads||0);
 const appointments=Number(metrics.appointments||0);
 const quotes=Number(metrics.quotes||0);
 const sales=Number(metrics.sales||0);
 const revenue=Number(metrics.verifiedRevenue||0);

 return {
  inputs:{qualified,appointments,quotes,sales,revenue},
  nextPriority:
   sales>0 ? "reinforce_verified_winning_threads" :
   appointments>0 ? "improve_quote_and_close_feedback" :
   qualified>0 ? "improve_booking_conversion" :
   "increase_high_intent_organic_entries",
  propertyReadiness:"NOT_AUTOMATIC",
  note:"Vault capital decisions require verified finances and separate legal/tax review."
 };
}
