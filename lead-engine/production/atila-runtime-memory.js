const g=globalThis;
const KEY="__ATTILA_AGGREGATE_V1__";
const fresh=()=>({version:1,started_at:new Date().toISOString(),updated_at:null,events:0,leads:0,by_intent:{},by_path:{},last_hunt:null});
const state=()=>g[KEY]||(g[KEY]=fresh());
const clean=v=>String(v||"").slice(0,300);
const intentOf=x=>{
 const s=[x.intent,x.path,x.content_page,x.campagne,x.target].map(clean).join(" ").toLowerCase();
 if(/pompe.?a.?chaleur|\bpac\b|chauff/.test(s))return "PAC";
 if(/clim|refroid|gainable/.test(s))return "CLIM";
 if(/humid|condensation|vmc|ventilation|moisi/.test(s))return "HUMIDITE_VMC";
 if(/toiture|infiltration|combles/.test(s))return "TOITURE";
 if(/isol|fen[eê]tre|vitrage|dpe|porte/.test(s))return "ISOLATION";
 if(/electri|disjonct|tableau/.test(s))return "ELECTRICITE";
 if(/fuite|eau|plomb|pression/.test(s))return "PLOMBERIE";
 return "GENERAL";
};
const bucket=(o,k)=>o[k]||(o[k]={views:0,starts:0,leads:0,highIntent:0});
export function absorbAttilaSignal(record={},observation={}){
 const s=state(),intent=observation.intent||intentOf(record),b=bucket(s.by_intent,intent);
 if(record.record_type==="lead"){s.leads++;b.leads++;if(observation.urgency==="HIGH"||Number(observation.score)>=78)b.highIntent++;}
 else{s.events++;if(record.event==="page_view")b.views++;if(record.event==="form_start")b.starts++;if(record.event==="lead_captured")b.leads++;}
 const path=clean(record.path||record.content_page||"/"); if(path) {const p=bucket(s.by_path,path);if(record.event==="page_view")p.views++;if(record.event==="form_start")p.starts++;if(record.record_type==="lead")p.leads++;}
 s.updated_at=new Date().toISOString(); return snapshotAttilaMemory();
}
export function snapshotAttilaMemory(){
 const s=state(); return JSON.parse(JSON.stringify(s));
}
export function rememberAttilaHunt(plan){const s=state();s.last_hunt={at:new Date().toISOString(),plan};s.updated_at=new Date().toISOString();return snapshotAttilaMemory();}
export function plannerInputFromMemory(){
 const s=snapshotAttilaMemory();
 const events=[],leads=[],pages=[];
 for(const [intent,b] of Object.entries(s.by_intent)) {
  for(let i=0;i<Math.min(b.views,100);i++)events.push({event:"page_view",intent});
  for(let i=0;i<Math.min(b.starts,50);i++)events.push({event:"form_start",intent});
  for(let i=0;i<Math.min(b.leads,50);i++)leads.push({intent,score:i<Math.min(b.highIntent,50)?80:60});
 }
 return {pages,events,leads,previous:{target:s.last_hunt?.plan?.target_intent||null}};
}
// Runtime memory survives warm server instances only. Durable provider is the next persistence layer.
