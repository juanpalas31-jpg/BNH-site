const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const txt=(v,max=180)=>String(v||"").trim().slice(0,max);

const INTENTS=[
 ["URGENCE_EAU",/(fuite|coule|eau|plomberie|sanitaire)/i,24],
 ["CLIMATISATION",/(clim|climatisation|refroid|gainable)/i,20],
 ["POMPE_A_CHALEUR",/(pompe.?a.?chaleur|\bpac\b|chauffe|chauffage)/i,20],
 ["HUMIDITE_VMC",/(humid|condensation|vmc|ventilation|moisi)/i,18],
 ["TOITURE",/(toiture|infiltration|combles)/i,18],
 ["ISOLATION",/(isolat|fenetre|vitrage|dpe|porte)/i,15],
 ["ELECTRICITE",/(electri|disjonct|tableau)/i,18]
];

export function observeBnhLead(lead={}){
 const hay=[lead.content_page,lead.campagne,lead.utm_campaign,lead.source,lead.message,lead.besoin].map(x=>txt(x)).join(" ");
 const matches=INTENTS.filter(([,rx])=>rx.test(hay));
 const intent=matches[0]?.[0]||"BILAN_HABITAT";
 let score=35+(matches[0]?.[2]||8);
 if(/^31\d{3}$/.test(String(lead.code_postal||""))) score+=12;
 if(txt(lead.telephone).length>=10) score+=8;
 if(txt(lead.email).includes("@")) score+=4;
 if(/urgent|panne|ne fonctionne plus|ne refroidit plus|fuite/i.test(hay)) score+=12;
 score=clamp(score,0,100);
 const urgency=score>=78?"HIGH":score>=58?"MEDIUM":"NORMAL";
 return {
  observer:"ATTILA_BNH_LEAD_OBSERVER",mode:"ADVISORY_ONLY",intent,score,urgency,
  confidence:matches.length?Math.min(.95,.68+matches.length*.08):.45,
  reason_codes:[
   ...(matches.length?["INTENT_SIGNAL"]:["GENERIC_BILAN"]),
   ...(/^31\d{3}$/.test(String(lead.code_postal||""))?["LOCAL_31"]:[]),
   ...(/urgent|panne|ne fonctionne plus|ne refroidit plus|fuite/i.test(hay)?["HIGH_INTENT_WORDING"]:[])
  ],
  source:{page:txt(lead.content_page,300),source:txt(lead.source,120),canal:txt(lead.canal,80),campagne:txt(lead.campagne,120)},
  suggested_follow_up:urgency==="HIGH"?"CALL_PRIORITY":"CALL_STANDARD",
  constraints:{autonomous_contact:false,autonomous_publish:false,spend:false,destructive_write:false},
  pii_memory:"FORBIDDEN"
 };
}

export function observeSeoSignal(event={}){
 const path=txt(event.path,300);
 let intent="GENERAL";
 for(const [name,rx] of INTENTS){if(rx.test(path)){intent=name;break;}}
 return {observer:"ATTILA_SEO_OBSERVER",mode:"OBSERVE_MEASURE",intent,path,event:txt(event.event,80),
  source:txt(event.source,120),campagne:txt(event.campagne,120),
  doctrine:["PERCEIVE","MEASURE","UNDERSTAND","PROPOSE","VERIFY"],
  autonomous_publish:false};
}
