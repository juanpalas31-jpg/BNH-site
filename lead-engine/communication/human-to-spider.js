const WORDS={
 threat:["virus","malware","attaque","intrusion","spam","bug","erreur","danger"],
 hunt:["prospect","lead","client","vente","opportunite","opportunité","chasse"],
 weave:["seo","site","page","contenu","lien","tisser","toile"],
 build:["cree","crée","creer","créer","code","api","construis","fabrique"],
 recall:["viens","reviens","rappelle","retour"]
};

const has=(s,list)=>list.some(w=>s.includes(w));

export function humanToSpider({message="",context={},actor="OWNER"}={}){
 const raw=String(message).trim();
 const s=raw.toLowerCase();
 let intent="CONVERSE";
 if(has(s,WORDS.threat)) intent="DEFEND";
 else if(has(s,WORDS.hunt)) intent="HUNT";
 else if(has(s,WORDS.weave)) intent="WEAVE";
 else if(has(s,WORDS.build)) intent="BUILD";
 else if(has(s,WORDS.recall)) intent="RECALL";

 return {
  protocol:"SPIDER_LANGUAGE_V1",
  actor,
  vibration:{type:intent,intensity:/urgent|vite|maintenant|feu/.test(s)?"HIGH":"NORMAL"},
  thread:String(context.thread||"DIRECT_OWNER_THREAD"),
  target:String(context.target||"ATTILA"),
  intent,
  human_payload:raw,
  authorization_hint:actor==="OWNER"?"OWNER_CONTEXT":"UNPRIVILEGED",
  requires_policy_gate:["DEFEND","BUILD"].includes(intent),
  biological_claim:false
 };
}
