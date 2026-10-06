export function classifyCiFailure(run={}){
 const failed=(run.steps||[]).find(s=>s.conclusion==='failure');
 const step=String(failed?.name||'');
 const lower=step.toLowerCase();
 let organ='UNKNOWN';
 let recommendation='HUMAN_REVIEW';
 if(lower.includes('setup node')||lower.includes('install')){organ='RUNTIME';recommendation='CHECK_RUNTIME_CONFIGURATION';}
 else if(lower.includes('test')){organ='TEST_SUITE';recommendation='INSPECT_FAILED_TESTS';}
 else if(lower.includes('checkout')){organ='SOURCE_ACCESS';recommendation='CHECK_SOURCE_ACCESS';}
 return {detected:run.conclusion==='failure',organ,failed_step:step||null,recommendation};
}

export function sentinelCiReport(run={}){
 const diagnosis=classifyCiFailure(run);
 return {
  organ:'SENTINEL',
  state:run.conclusion==='success'?'HEALTHY':diagnosis.detected?'ALERT':'UNKNOWN',
  run_id:run.id||null,
  commit:run.head_sha||null,
  diagnosis,
  repair_authorized:false,
  requires_verification_after_repair:true,
  synthetic:false
 };
}
