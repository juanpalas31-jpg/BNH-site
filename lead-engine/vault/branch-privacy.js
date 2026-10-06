export function branchPrivacy({viewerBranch,targetBranch,sharedHistory=false}={}){
 const same=viewerBranch&&viewerBranch===targetBranch;
 return {
  mayReadPrivateProfile:same,
  mayReadPrivateCeremony:same,
  mayReadSharedFounderHistory:sharedHistory===true,
  mayReadSiblingPrivateData:false,
  maySpoilSiblingFirstAwakening:false
 };
}
