import {createHash} from "node:crypto";
const H=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));

export function distillTacticalLesson({neo={},outcome={}}={}){
 const selected=neo?.state?.plans?.[0]?.name||outcome.strategy||"OBSERVE";
 const success=outcome.success===true,confidence=clamp(outcome.confidence??.5);
 const lesson={threat_class:outcome.threat_class||"UNKNOWN",strategy:selected,
  success,confidence:success?confidence:confidence*.5,
  source_generation:neo.generation||0,secret_free:true,
  host_data_included:false,created_at:new Date().toISOString()};
 return {...lesson,lesson_id:H(lesson)};
}
export function validateLesson(lesson={}){
 const allowed=new Set(["ISOLATE","STARVE","DECOY","RESET","ADAPT","FORK_SWARM","OBSERVE"]);
 const reasons=[];
 if(!allowed.has(lesson.strategy))reasons.push("UNKNOWN_STRATEGY");
 if(lesson.secret_free!==true)reasons.push("SECRET_RISK");
 if(lesson.host_data_included===true)reasons.push("HOST_DATA_RISK");
 if(clamp(lesson.confidence)<.35)reasons.push("LOW_CONFIDENCE");
 return {ok:reasons.length===0,reasons};
}
export function consolidateLessons(memory=[],lessons=[]){
 const valid=lessons.filter(x=>validateLesson(x).ok);
 const map=new Map(memory.map(x=>[x.lesson_id,x]));
 for(const l of valid){
  const old=map.get(l.lesson_id);
  map.set(l.lesson_id,old?{...old,confirmations:(old.confirmations||1)+1,
   confidence:clamp(Math.max(old.confidence,l.confidence))}:{...l,confirmations:1});
 }
 return [...map.values()].sort((a,b)=>(b.confirmations||0)-(a.confirmations||0)).slice(0,256);
}
export function inheritedTactics(memory=[],threat_class="UNKNOWN"){
 return memory.filter(x=>x.threat_class===threat_class&&x.success&&
  (x.confirmations||0)>=2&&x.confidence>=.55).slice(0,4)
  .map(x=>({strategy:x.strategy,confidence:x.confidence,lesson_id:x.lesson_id}));
}
