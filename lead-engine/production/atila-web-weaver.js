const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const clean=v=>String(v||"").trim();

const INTENTS={
 PAC:{rx:/pompe.?a.?chaleur|\bpac\b|chauff/i,seeds:["pompe à chaleur Toulouse","PAC consomme trop","PAC chauffe mal"]},
 CLIM:{rx:/clim|refroid|gainable/i,seeds:["climatisation Toulouse","clim ne refroidit plus","clim coule eau"]},
 HUMIDITE_VMC:{rx:/humid|condensation|vmc|ventilation|moisi/i,seeds:["humidité maison Toulouse","VMC fonctionne mal","condensation fenêtres"]},
 TOITURE:{rx:/toiture|infiltration|combles/i,seeds:["infiltration toiture","combles humides"]},
 ISOLATION:{rx:/isol|fen[eê]tre|vitrage|dpe|porte/i,seeds:["isolation maison Toulouse","fenêtres ou PAC","améliorer DPE"]},
 ELECTRICITE:{rx:/electri|disjonct|tableau/i,seeds:["tableau électrique ancien","disjoncteur saute"]},
 PLOMBERIE:{rx:/fuite|eau|plomb|pression/i,seeds:["fuite eau invisible","pression eau faible"]}
};

function intentOf(x={}){
 const h=[x.path,x.content_page,x.campagne,x.intent,x.query,x.target].map(clean).join(" ");
 return Object.entries(INTENTS).find(([,v])=>v.rx.test(h))?.[0]||"GENERAL";
}

export function weaveWeb({pages=[],events=[],leads=[],previous={}}={}){
 const nodes={};
 const touch=(intent)=>nodes[intent]||(nodes[intent]={intent,views:0,starts:0,leads:0,highIntent:0,pages:0});
 for(const p of pages){touch(intentOf(p)).pages++}
 for(const e of events){
  const n=touch(intentOf(e)); const ev=clean(e.event);
  if(ev==="page_view")n.views++;
  if(ev==="form_start")n.starts++;
  if(ev==="lead_captured")n.leads++;
 }
 for(const l of leads){
  const n=touch(intentOf(l)); n.leads++;
  if(Number(l.score)>=78||clean(l.urgency)==="HIGH")n.highIntent++;
 }
 const ranked=Object.values(nodes).map(n=>{
  const conversion=n.views?n.leads/n.views:0;
  const engagement=n.views?n.starts/n.views:0;
  const demand=Math.log2(1+n.views)*12+n.starts*8+n.leads*28+n.highIntent*16;
  const coverage=Math.min(30,n.pages*8);
  const weakness=n.views>=8&&conversion===0?22:0;
  const score=clamp(Math.round(demand+weakness-coverage),0,100);
  return {...n,conversion:Number(conversion.toFixed(4)),engagement:Number(engagement.toFixed(4)),hunt_score:score};
 }).sort((a,b)=>b.hunt_score-a.hunt_score);
 const target=ranked[0]||{intent:"GENERAL",hunt_score:0,pages:0,views:0,leads:0};
 const seeds=INTENTS[target.intent]?.seeds||["bilan habitat Toulouse"];
 const action=target.views>=8&&target.leads===0
  ? "REINFORCE_CONVERSION_PATH"
  : target.pages<2?"EXPAND_WEB_BRANCH":"BUILD_SUPPORTING_CONTENT";
 return {
  organism:"ATTILA",function:"AUTONOMOUS_WEB_WEAVING_PLANNER",mode:"PROPOSE_THEN_VERIFY",
  web_map:ranked,target:{...target,seeds},decision:{
   action,priority:target.hunt_score>=70?"HIGH":target.hunt_score>=40?"MEDIUM":"NORMAL",
   rationale:action==="REINFORCE_CONVERSION_PATH"
    ?"Traffic exists without observed lead conversion; reinforce the path before adding volume."
    :"Grow the strongest observed intent with a distinct supporting node and reciprocal links."
  },
  learning:{previous_target:previous.target||null,compare_after_next_observation:true,reinforce_only_after_measured_improvement:true},
  guardrails:{publish_requires_gate:true,no_spend:true,no_client_contact:true,no_destructive_action:true,no_raw_pii_memory:true}
 };
}

export function nextHuntPlan(input={}){
 const web=weaveWeb(input),t=web.target;
 return {hunter:"ATTILA",target_intent:t.intent,hunt_score:t.hunt_score,action:web.decision.action,
  seed_queries:t.seeds||[],tasks:[
   "VERIFY_SEARCH_INTENT_AND_EXISTING_COVERAGE",
   web.decision.action,
   "CREATE_OR_IMPROVE_DISTINCT_NODE",
   "ADD_RECIPROCAL_INTERNAL_LINKS",
   "ATTACH_SOURCE_AND_CAMPAIGN_ATTRIBUTION",
   "MEASURE_VIEWS_FORM_STARTS_LEADS",
   "COMPARE_AND_LEARN"
  ],gate:"OWNER_OR_VALIDATED_PUBLISHER",web};
}
