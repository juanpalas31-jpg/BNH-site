const avg=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
export function judgeEvidence({replications=[],blind=[],transfer=[]}={}){
 const lifts=replications.map(x=>Number(x.lift)||0);
 const blindLifts=blind.map(x=>Number(x.generalization_lift)||0);
 const transferLifts=transfer.map(x=>Number(x.transfer_lift)||0);
 const positive=a=>a.filter(x=>x>0).length;
 const evidence={
  replication_mean:avg(lifts),blind_mean:avg(blindLifts),transfer_mean:avg(transferLifts),
  replication_positive:positive(lifts),blind_positive:positive(blindLifts),
  transfer_positive:positive(transferLifts)
 };
 const enough=replications.length>=5&&blind.length>=3&&transfer.length>=3;
 const consistent=enough&&evidence.replication_mean>0&&evidence.blind_mean>0&&
  evidence.transfer_mean>0&&positive(lifts)>=4&&positive(blindLifts)>=2&&positive(transferLifts)>=2;
 return {judge:"ATILA_LAB_INDEPENDENT_EVALUATOR",enough_data:enough,evidence,
  verdict:consistent?"PROMISING_REPRODUCIBLE_ADAPTATION_SIGNAL":
   enough?"INSUFFICIENT_OR_INCONSISTENT_EFFECT":"MORE_EXPERIMENTS_REQUIRED",
  attestation:"NO_SELF_DECLARED_SUCCESS"};
}
