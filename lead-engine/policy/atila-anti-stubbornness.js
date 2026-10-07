const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export function predictionError({predicted=0,observed=0}={}){
 const error=Math.abs(clamp(predicted)-clamp(observed));
 return {error,surprise:error>=.55?"HIGH":error>=.28?"MEDIUM":"LOW"};
}
export function recalibrateBelief({confidence=.5,predicted=0,observed=0}={}){
 const p=predictionError({predicted,observed});
 const next=clamp(confidence*(1-p.error*.75));
 return {previous:clamp(confidence),confidence:next,...p,
  reopen_hypotheses:p.surprise==="HIGH"};
}
export function antiStubbornness({failures=0,surprise="LOW",same_strategy_runs=0}={}){
 if(surprise==="HIGH"||failures>=2||same_strategy_runs>=3)
  return {force_reconsideration:true,minimum_alternatives:3,repeat_blocked:true};
 return {force_reconsideration:false,minimum_alternatives:1,repeat_blocked:false};
}
