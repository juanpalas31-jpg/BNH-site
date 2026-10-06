export function maintenanceCheck(input={}){
 const checks=["powerBackup","offlineBoot","archiveIntegrity","mediaReadable","recoveryCopies","manualExit","environmentControls"];
 const results=Object.fromEntries(checks.map(k=>[k,input[k]===true]));
 const failed=checks.filter(k=>!results[k]);
 return {
  results,failed,
  healthy:failed.length===0,
  nextAction:failed.length?"service_before_ceremony":"record_signed_check",
  autoDeleteOrRewrite:false
 };
}
