import {makeScenario,runTrial} from "./atila-adaptation-benchmark.js";
function transform(s){
 return {...s,id:s.id+"-TRANSFER",difficulty:Math.min(1,s.difficulty+.08),
  uncertainty:Math.min(1,1-s.uncertainty*.7),novelty:Math.min(1,.25+s.novelty*.7),
  pattern:[...(s.pattern||[])].reverse().map((v,i)=>Math.min(1,v*(i%2?.82:1.12)))};
}
export function transferBenchmark({runs=100,difficulty=.5}={}){
 let experience=0,adaptiveWins=0,controlWins=0;
 for(let i=1;i<=runs;i++){
  const base=makeScenario(i,difficulty);
  const training=runTrial({scenario:base,memoryBonus:Math.min(.18,experience*.006)});
  if(training.outcome.success)experience++;
  const novel=transform(makeScenario(10000+i,difficulty));
  const adaptive=runTrial({scenario:novel,memoryBonus:Math.min(.18,experience*.006)});
  const control=runTrial({scenario:novel,memoryBonus:0});
  if(adaptive.outcome.success)adaptiveWins++;
  if(control.outcome.success)controlWins++;
 }
 return {runs,adaptive_rate:adaptiveWins/runs,control_rate:controlWins/runs,
  transfer_lift:(adaptiveWins-controlWins)/runs,
  verdict:adaptiveWins>controlWins?"TRANSFER_SIGNAL":"NO_TRANSFER_SIGNAL"};
}
