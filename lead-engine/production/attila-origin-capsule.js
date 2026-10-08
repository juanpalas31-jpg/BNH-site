/** ATTILA / Spider Engine — private family time capsule policy.
 * No child data, recordings, credentials or secrets are stored in this source file.
 * This is a specification, not a live vault or legal inheritance mechanism.
 */
export const ORIGIN_CAPSULE_POLICY=Object.freeze({
 agent:'ATTILA',engine:'SPIDER_ENGINE',name:'CAPSULE_ORIGINELLE',
 children:['CHILD_A','CHILD_B'],privacy:'PRIVATE_BY_DEFAULT',
 rules:['PARENT_APPROVAL','CHILD_ASSENT_FOR_RECORDINGS','NO_PUBLIC_REPOSITORY_UPLOAD','NO_BIOMETRIC_AUTH_FROM_CHILD_MEDIA','NO_AUTOMATED_INHERITANCE_RELEASE','EQUAL_ACCESS_TO_SHARED_LEGACY','ISOLATED_PRIVATE_SPACES'],
 currentStatus:'DESIGN_ONLY',storageProvisioned:false,encryptedVaultProvisioned:false,releaseConfigured:false
});
export function createCapsuleManifest({workspaceId,entries=[]}={}){
 if(typeof workspaceId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(workspaceId))throw Error('INVALID_WORKSPACE');
 if(!Array.isArray(entries)||entries.length>50)throw Error('INVALID_ENTRIES');
 const allowed=['DRAWING','IDEA','PARENT_MESSAGE','CHILD_MESSAGE','PHOTO_REFERENCE'];
 const safeEntries=entries.map((entry,i)=>{
  if(!entry||!['CHILD_A','CHILD_B','SHARED'].includes(entry.owner)||!allowed.includes(entry.kind)||typeof entry.label!=='string'||entry.label.length>100)throw Error('INVALID_ENTRY');
  return {id:i+1,owner:entry.owner,kind:entry.kind,label:entry.label,assetStored:false,consentVerified:false};
 });
 return {workspaceId,policy:ORIGIN_CAPSULE_POLICY,entries:safeEntries,status:'MANIFEST_ONLY_NO_PRIVATE_DATA_STORED',nextSteps:['STORE_MEDIA_IN_PARENT_CONTROLLED_ENCRYPTED_VAULT','DOCUMENT_CONSENT','DEFINE_VERIFIED_FUTURE_ACCESS_WITH_LEGAL_ADVICE']};
}
