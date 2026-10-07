import {createHash} from "node:crypto";
const stable=x=>JSON.stringify(x,Object.keys(x||{}).sort());
export function experimentFingerprint(payload){
 return createHash("sha256").update(stable(payload)).digest("hex");
}
export function buildLabReport({suite,blind=[],transfer=[],evaluator,version="ATILA_LAB_V2"}={}){
 const core={version,created_at:new Date().toISOString(),suite_summary:suite?{
  total_trials:suite.total_trials,mean_lift:suite.mean_lift,
  positive_difficulty_bands:suite.positive_difficulty_bands}:null,
  blind:blind.map(x=>({runs:x.holdout_runs,lift:x.generalization_lift,passed:x.passed})),
  transfer:transfer.map(x=>({runs:x.runs,lift:x.transfer_lift,verdict:x.verdict})),
  evaluator:evaluator?{enough_data:evaluator.enough_data,verdict:evaluator.verdict,evidence:evaluator.evidence}:null};
 return {...core,fingerprint:experimentFingerprint(core),
  rule:"REPORT_RAW_RESULTS_EVEN_WHEN_HYPOTHESIS_FAILS"};
}
