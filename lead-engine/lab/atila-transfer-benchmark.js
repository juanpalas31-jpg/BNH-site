import {makeScenario,runTrial} from "./atila-adaptation-benchmark.js";
import {createLabMemory,recordOutcome,memorySnapshot} from "./atila-experimental-memory.js";
function transform(s){return {...s,id:s.id+"-TRANSFER",difficulty:Math.min(1,s.difficulty+.08),
 uncertainty:Math.min(1,1-s.uncertainty*.7),novelty:Math.min(1,.25+s.novelty*.7),
 pattern:[...(s.pattern||[])].reverse().map((v,i)=>Math.min(1,v*(i%2?.82:1.12)))};}
export function transferBenchmark({runs=100,difficulty=.5}={}){
 let memory=createLabMemory(),adaptiveWins=0,controlWins=0,trainingWins=0;
 for(let i=1;i<=runs;i++){
  const training=runTrial({scenario:makeScenario(i,difficulty),memory,adaptive:true});
  if(training.outcome.success)trainingWins++;
  memory=recordOutcome(memory,training.decision,training.outcome);
  const novel=transform(makeScenario(10000+i,difficulty));
  const adaptive=runTrial({scenario:novel,memory,adaptive:true});
  const control=runTrial({scenario:novel,adaptive:false});
  if(adaptive.outcome.success)adaptiveWins++;if(control.outcome.success)controlWins++;
 }
 return {runs,training_wins:trainingWins,adaptive_rate:adaptiveWins/runs,control_rate:controlWins/runs,
  transfer_lift:(adaptiveWins-controlWins)/runs,memory:memorySnapshot(memory),
  verdict:adaptiveWins>controlWins?"TRANSFER_SIGNAL":"NO_TRANSFER_SIGNAL"};
}