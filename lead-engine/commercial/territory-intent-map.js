export function buildTerritoryIntentMap({territory,topics=[]}={}){
 if(!territory) throw new Error("territory_required");
 return {
  territory,
  nodes:topics.map(topic=>({
   topic,
   entryTypes:["answer_page","local_guide","mini_simulator"],
   destination:"bilan_residentiel_gratuit",
   status:"CANDIDATE"
  })),
  paidAdsRequired:false,
  massDoorwayPages:false
 };
}
