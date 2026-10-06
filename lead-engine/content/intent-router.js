/**
 * Routes organic content intent toward the BNH assessment funnel.
 * This does not make regulatory/financial promises.
 */
const HIGH = new Set(["high_intent_owner","renovation","regulatory_update"]);
const MID = new Set(["regulatory_information","educational"]);

export function routeContentIntent(input={}){
  const intent=String(input.intent||"").trim();
  const engaged=Boolean(input.engaged);
  const owner=Boolean(input.owner);
  const local=Boolean(input.local);
  let score=0;
  if(HIGH.has(intent)) score+=4;
  else if(MID.has(intent)) score+=2;
  if(engaged) score+=2;
  if(owner) score+=2;
  if(local) score+=2;

  const band=score>=7?"high":score>=4?"medium":"low";
  return {
    score,band,
    destination:"bilan_residentiel_gratuit",
    cta: band==="high"?"Demander mon bilan résidentiel gratuit":
         band==="medium"?"Faire le point sur mon logement":
         "Comprendre le bilan résidentiel",
    automatic_contact:false
  };
}
