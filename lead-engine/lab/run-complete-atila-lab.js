import {runLabSuite} from "./run-atila-lab-suite.js";
import {blindHoldout} from "./atila-blind-holdout.js";
import {transferBenchmark} from "./atila-transfer-benchmark.js";
import {judgeEvidence} from "./atila-independent-evaluator.js";
import {buildLabReport} from "./atila-lab-report.js";

export function runCompleteAtilaLab(){
 const suite=runLabSuite();
 const blind=[101,1001,10001].map(start=>blindHoldout({start,count:200,difficulty:.55}));
 const transfer=[.4,.55,.7].map(difficulty=>transferBenchmark({runs:100,difficulty}));
 const replications=suite.results.map(r=>({lift:r.lift}));
 const evaluator=judgeEvidence({replications,blind,transfer});
 return buildLabReport({suite,blind,transfer,evaluator,version:"ATILA_LAB_V2"});
}
const isDirect=process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll("\\","/"));
if(isDirect) console.log(JSON.stringify(runCompleteAtilaLab(),null,2));
