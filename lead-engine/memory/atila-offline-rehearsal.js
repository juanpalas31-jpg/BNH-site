import {forecastThreat} from "../senses/atila-threat-forecast.js";
export function rehearseDefense({memories=[],strategies=[]}={}){
 const cases=memories.slice(-32),scores=new Map();
 for(const c of cases){
  const name=c.strategy||"OBSERVE";
  const gain=(c.success?1:-.35)*(Number(c.confidence)||.5);
  scores.set(name,(scores.get(name)||0)+gain);
 }
 for(const s of strategies)if(!scores.has(s))scores.set(s,0);
 return [...scores.entries()].map(([strategy,score])=>({strategy,score}))
  .sort((a,b)=>b.score-a.score);
}
export function offlineConsolidation({events=[],memories=[],strategies=[]}={}){
 const forecast=forecastThreat(events),rehearsal=rehearseDefense({memories,strategies});
 return {mode:"OFFLINE_SIMULATION",external_actions:false,self_modification:false,
  forecast,rehearsal,recommended_strategy:rehearsal[0]?.strategy||"OBSERVE",
  promotion_requires_live_confirmation:true};
}
