import {arachnidLoop} from "../core/atila-arachnid-ai.js";
import {createLabMemory,recordOutcome,learnedAdjustment,memorySnapshot} from "./atila-experimental-memory.js";
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export function makeScenario(seed=1,difficulty=.5){
 let x=(seed*9301+49297)%233280;
 const rnd=()=>{x=(x*9301+49297)%233280;return x/233280;};
 return {id:"SCENARIO-"+seed,difficulty:clamp(difficulty),uncertainty:rnd(),novelty:rnd(),
  scarcity:rnd(),signal_noise:rnd(),pattern:[rnd(),rnd(),rnd(),rnd()]};
}
export function scoreAttempt({scenario={},decision={},adjustment=0}={}){
 const fit={LOCAL_REFLEX:.55,SPAWN_BOUNDED_SWARM:.68,PREPARE_CONTAINMENT:.72,
  REOPEN_HYPOTHESES:.62,QUARANTINE_ASSESS:.60,WEB_LISTEN:.35};
 const base=fit[decision.action]??.4,challenge=.35+.55*(scenario.difficulty||0);
 const score=clamp(base+adjustment-challenge*.45);
 return {score,success:score>=.5,cost:clamp(.18+(decision.action==="SPAWN_BOUNDED_SWARM"?.22:.06))};
}
export function runTrial({scenario,state={},history={},memory=null,adaptive=false}={}){
 const signal={intensity:scenario.difficulty,novelty:scenario.novelty,
  repeat_rate:scenario.pattern?.[0]||0,integrity_risk:scenario.pattern?.[1]||0};
 const result=arachnidLoop({state,history,signal,
  context:{uncertainty:scenario.uncertainty,scarcity:scenario.scarcity,novelty:scenario.novelty},
  events:scenario.pattern.map((risk,i)=>({type:"LAB_"+i,risk})),risk:scenario.difficulty,owner_verified:true});
 const adjustment=adaptive?learnedAdjustment(memory,result.decision):0;
 const outcome=scoreAttempt({scenario,decision:result.decision,adjustment});
 return {scenario_id:scenario.id,decision:result.decision,outcome};
}
export function runExperiment({runs=100,difficulty=.5,adaptive=true}={}){
 let wins=0,totalScore=0,totalCost=0,memory=createLabMemory();const rows=[];
 for(let i=1;i<=runs;i++){
  const row=runTrial({scenario:makeScenario(i,difficulty),memory,adaptive});
  if(row.outcome.success)wins++;
  if(adaptive)memory=recordOutcome(memory,row.decision,row.outcome);
  totalScore+=row.outcome.score;totalCost+=row.outcome.cost;rows.push(row);
 }
 return {mode:adaptive?"ADAPTIVE":"CONTROL",runs,wins,success_rate:wins/runs,
  mean_score:totalScore/runs,mean_cost:totalCost/runs,memory:adaptive?memorySnapshot(memory):null,rows};
}
export function compareAdaptiveVsControl(opts={}){
 const adaptive=runExperiment({...opts,adaptive:true}),control=runExperiment({...opts,adaptive:false});
 return {adaptive,control,lift:adaptive.success_rate-control.success_rate,
  verdict:adaptive.success_rate>control.success_rate?"ADAPTATION_SIGNAL":"NO_MEASURED_ADVANTAGE"};
}
