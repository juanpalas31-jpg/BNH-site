import {compareAdaptiveVsControl} from "./atila-adaptation-benchmark.js";
export function runLabSuite(){
 const difficulties=[.25,.40,.55,.70,.85];
 const results=difficulties.map(d=>({difficulty:d,...compareAdaptiveVsControl({runs:100,difficulty:d})}));
 const positive=results.filter(r=>r.lift>0).length;
 const meanLift=results.reduce((s,r)=>s+r.lift,0)/results.length;
 return {protocol:"ATILA_LAB_V1",total_trials:results.length*200,
  difficulties,results,positive_difficulty_bands:positive,mean_lift:meanLift,
  reproducible_signal:positive>=4&&meanLift>0,
  interpretation:positive>=4&&meanLift>0?
   "CANDIDATE_ADAPTATION_EFFECT_REQUIRES_FURTHER_VALIDATION":
   "NO_ROBUST_ADAPTATION_EFFECT"};
}
