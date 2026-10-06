const INTENT_WEIGHTS={
 dpe:8,pac:7,climatisation:6,vmc:6,isolation:7,fenetres:6,photovoltaique:6,
 devis:10,diagnostic:9,bilan:9,prix:7,aides:7
};

export function scoreHighIntentThread(input={}){
 const text=[input.query,input.page,input.topic].filter(Boolean).join(" ").toLowerCase();
 let score=0;
 for(const [term,weight] of Object.entries(INTENT_WEIGHTS)){
  if(text.includes(term)) score+=weight;
 }
 if(input.simulatorComplete) score+=12;
 if(input.formStart) score+=15;
 if(input.bookingIntent) score+=20;
 return Math.min(score,100);
}

export function routeHighIntentThread(input={}){
 const score=scoreHighIntentThread(input);
 return {
  score,
  route:score>=35?"bilan_residentiel":score>=20?"mini_simulator":"useful_content",
  paidAdsRequired:false,
  autoContact:false
 };
}
