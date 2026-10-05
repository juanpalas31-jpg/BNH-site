/**
 * Spider maturity stages. Autonomy cannot grow faster than verified capability.
 */
export function maturityStage(input={}){
  const verified=Math.max(0,Number(input.verified_organs||0));
  const total=Math.max(1,Number(input.total_organs||1));
  const evidence=Math.max(0,Number(input.evidence_cycles||0));
  const restoreVerified=input.restore_verified===true;
  const isolationVerified=input.tenant_isolation_verified===true;
  const ratio=verified/total;

  let stage='egg';
  if(ratio>=0.25) stage='juvenile';
  if(ratio>=0.60 && evidence>=100) stage='subadult';
  if(ratio===1 && evidence>=500 && restoreVerified && isolationVerified) stage='adult';

  return {
    stage,
    organ_verification_ratio:Number(ratio.toFixed(4)),
    evidence_cycles:evidence,
    autonomy_ceiling:stage==='adult'?'policy_bounded':stage==='subadult'?'recommend_and_test':'observe_and_recommend',
    durable_reproduction_allowed:stage==='adult',
    automatic_consequential_action:false
  };
}
