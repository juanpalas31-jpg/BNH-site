import {makeScenario,runTrial} from "./atila-adaptation-benchmark.js";
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));

export function splitSeeds({start=1,count=200,trainRatio=.7}={}){
 const seeds=Array.from({length:count},(_,i)=>start+i);
 const cut=Math.floor(seeds.length*clamp(trainRatio));
 return {train:seeds.slice(0,cut),holdout:seeds.slice(cut)};
}
export function trainExperience(seeds=[],difficulty=.55){
 let learned=0,wins=0;
 for(const seed of seeds){
  const row=runTrial({scenario:makeScenario(seed,difficulty),memoryBonus:Math.min(.22,learned*.008)});
  if(row.outcome.success){wins++;learned++;}
 }
 return {learned,wins,runs:seeds.length};
}
export function blindHoldout({start=1,count=200,difficulty=.55}={}){
 const split=splitSeeds({start,count});
 const training=trainExperience(split.train,difficulty);
 let adaptiveWins=0,controlWins=0;
 const rows=[];
 for(const seed of split.holdout){
  const scenario=makeScenario(seed,difficulty);
  const adaptive=runTrial({scenario,memoryBonus:Math.min(.22,training.learned*.008)});
  const control=runTrial({scenario,memoryBonus:0});
  if(adaptive.outcome.success)adaptiveWins++;
  if(control.outcome.success)controlWins++;
  rows.push({seed,adaptive:adaptive.outcome,control:control.outcome});
 }
 const n=Math.max(1,split.holdout.length);
 return {training,holdout_runs:n,adaptive_rate:adaptiveWins/n,control_rate:controlWins/n,
  generalization_lift:(adaptiveWins-controlWins)/n,rows,
  passed:adaptiveWins>controlWins};
}
