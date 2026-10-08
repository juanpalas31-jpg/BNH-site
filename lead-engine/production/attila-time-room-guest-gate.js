/** Founder-supervised local guest invitation policy.
 * Offline-only: no remote sessions, network invitations or persistent guest access.
 * All inputs are assertions; a trusted local controller must authenticate them.
 * Family trio exception remains governed separately.
 */
export function decideLocalGuestEntry({founderPresent=false,founderVerified=false,guestPresent=false,guestVerified=false,founderApproved=false,localOnly=false,remoteConnection=false,sessionActive=false}={}){
 const deny=reason=>({allowed:false,action:'DENY_AND_CLOSE_GUEST_SESSION',reason,guestAccess:'NONE'});
 if(remoteConnection!==false||localOnly!==true)return deny('REMOTE_ACCESS_FORBIDDEN');
 if(founderPresent!==true||founderVerified!==true)return deny('FOUNDER_MUST_BE_PRESENT_AND_VERIFIED');
 if(guestPresent!==true||guestVerified!==true)return deny('GUEST_MUST_BE_LOCALLY_PRESENT_AND_VERIFIED');
 if(founderApproved!==true)return deny('EXPLICIT_FOUNDER_INVITATION_REQUIRED');
 if(sessionActive!==true)return deny('FOUNDER_SESSION_REQUIRED');
 return {allowed:true,action:'ADMIT_SUPERVISED_LOCAL_GUEST',reason:'LOCAL_INVITATION_ONLY',
  guestAccess:'SESSION_ONLY',disconnectOnFounderExit:true,remoteAccess:false};
}
export function shouldTerminateGuestSession({founderPresent=false,founderVerified=false,remoteConnection=false,founderApprovalActive=false}={}){
 return founderPresent!==true||founderVerified!==true||remoteConnection!==false||founderApprovalActive!==true;
}
