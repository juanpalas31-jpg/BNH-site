/**
 * Quorum model for custody/recovery.
 * No single guardian should be able to unseal a lineage package.
 */
export function recoveryQuorum({total_guardians=0,approvals=0,threshold=2,recipient_verified=false,integrity_verified=false}={}){
  const safeThreshold=Math.max(2,Math.min(Number(threshold)||2,Number(total_guardians)||0));
  const enoughGuardians=approvals>=safeThreshold;
  return {
    threshold:safeThreshold,
    enough_guardians:enoughGuardians,
    recipient_verified:recipient_verified===true,
    integrity_verified:integrity_verified===true,
    recovery_authorized:enoughGuardians&&recipient_verified===true&&integrity_verified===true,
    single_guardian_sufficient:false,
    automatic_unseal:false
  };
}
