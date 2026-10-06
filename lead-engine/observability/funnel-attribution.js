const ORDER=["article_view","content_engaged","assessment_cta_click","form_start","form_submit","appointment","sale"];

export function attributeFunnel(events=[]){
  const sessions=new Map();
  for(const e of events){
    if(!e.session_id) continue;
    const s=sessions.get(e.session_id)||{session_id:e.session_id,cluster:e.cluster||null,article:e.article||null,events:[],revenue:0};
    if(!s.cluster && e.cluster) s.cluster=e.cluster;
    if(!s.article && e.article) s.article=e.article;
    s.events.push(e.type);
    if(e.type==="sale") s.revenue+=Math.max(0,Number(e.revenue)||0);
    sessions.set(e.session_id,s);
  }
  return [...sessions.values()].map(s=>{
    const reached=ORDER.filter(x=>s.events.includes(x));
    return {...s,reached,last_stage:reached.at(-1)||null};
  });
}

export function summarizeAttribution(sessions=[]){
  const out={};
  for(const s of sessions){
    const key=s.cluster||"unknown";
    const r=out[key]||(out[key]={sessions:0,leads:0,appointments:0,sales:0,revenue:0});
    r.sessions++;
    if(s.events.includes("form_submit")) r.leads++;
    if(s.events.includes("appointment")) r.appointments++;
    if(s.events.includes("sale")) r.sales++;
    r.revenue+=Number(s.revenue)||0;
  }
  return out;
}
