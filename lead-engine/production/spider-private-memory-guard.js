/** Spider Engine + Attila: PRIVATE MEMORY SECURITY GATE (pure, fail-closed).
 * No secrets, recordings, transcripts or children's profiles in this repository.
 * This module does not store/encrypt data: it validates proposed operations before
 * a future authenticated, encrypted storage adapter may execute them.
 */
export const MEMORY_SECURITY_POLICY=Object.freeze({
 version:1,classification:['FAMILY_PRIVATE','CHILD_PRIVATE','HEALTH_RESTRICTED'],
 capabilities:['READ','WRITE','CORRECT','EXPORT','DELETE','PODCAST_PREPARE'],
 storage:'NOT_CONNECTED',encryption:'NOT_PROVISIONED',publicPublication:false
});
const id=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(x);
const roles=new Set(['FOUNDER','PARENT_GUARDIAN','CHILD_SELF','SERVICE']);
const operations=new Set(MEMORY_SECURITY_POLICY.capabilities);
const classes=new Set(MEMORY_SECURITY_POLICY.classification);
const denied=(reason)=>({allowed:false,reason,auditRequired:true});
export function authorizeMemoryAction({actor,resource,operation,consents={},authenticated=false}={}){
 if(!authenticated||!actor||!id(actor.id)||!roles.has(actor.role)||!resource||!id(resource.id)||!id(resource.workspaceId)||!id(actor.workspaceId))return denied('AUTHENTICATION_OR_IDENTITY_REQUIRED');
 if(actor.workspaceId!==resource.workspaceId)return denied('WORKSPACE_ISOLATION');
 if(!operations.has(operation)||!classes.has(resource.classification))return denied('INVALID_ACTION_OR_CLASSIFICATION');
 if(resource.ownerSlot&&!id(resource.ownerSlot))return denied('INVALID_OWNER_SLOT');
 if(actor.role==='SERVICE'&&operation!=='READ')return denied('SERVICE_WRITE_FORBIDDEN');
 if(actor.role==='CHILD_SELF'&&actor.childSlot!==resource.ownerSlot)return denied('CHILD_WORKSPACE_ISOLATION');
 if(resource.classification==='HEALTH_RESTRICTED'&&actor.role!=='FOUNDER'&&actor.role!=='PARENT_GUARDIAN'&&!(actor.role==='CHILD_SELF'&&actor.childSlot===resource.ownerSlot))return denied('HEALTH_ACCESS_DENIED');
 if(operation==='PODCAST_PREPARE'){
  if(resource.classification==='HEALTH_RESTRICTED')return denied('HEALTH_NOT_FOR_PODCAST');
  if(!Array.isArray(resource.participantSlots)||resource.participantSlots.length===0||!resource.participantSlots.every(s=>id(s)&&consents[s]?.podcast===true))return denied('ALL_PARTICIPANTS_PODCAST_CONSENT_REQUIRED');
  if(actor.role==='SERVICE')return denied('HUMAN_EDITOR_REQUIRED');
 }
 if(operation==='EXPORT'||operation==='DELETE'){
  if(!['FOUNDER','PARENT_GUARDIAN'].includes(actor.role)&&!(actor.role==='CHILD_SELF'&&actor.childSlot===resource.ownerSlot))return denied('OWNER_OR_GUARDIAN_REQUIRED');
 }
 if(operation==='WRITE'&&resource.classification==='CHILD_PRIVATE'&&actor.role==='SERVICE')return denied('HUMAN_APPROVAL_REQUIRED');
 return {allowed:true,reason:'POLICY_CHECK_PASSED_NOT_STORAGE_AUTHORIZATION',auditRequired:true,requiresStorageAdapter:true};
}
export function buildMemoryAuditEvent({actorId,resourceId,operation,decision,occurredAt}={}){
 if(!id(actorId)||!id(resourceId)||!operations.has(operation)||!['ALLOW','DENY'].includes(decision)||typeof occurredAt!=='string'||Number.isNaN(Date.parse(occurredAt)))throw Error('INVALID_AUDIT_EVENT');
 return {actorId,resourceId,operation,decision,occurredAt,containsContent:false,status:'DRAFT_NOT_PERSISTED'};
}
export function evaluateMemoryIntegrity({expectedSha256,actualSha256}={}){
 const valid=s=>typeof s==='string'&&/^[a-f0-9]{64}$/i.test(s);
 if(!valid(expectedSha256)||!valid(actualSha256))return {verified:false,reason:'HASH_MISSING_OR_INVALID'};
 return {verified:expectedSha256.toLowerCase()===actualSha256.toLowerCase(),reason:expectedSha256.toLowerCase()===actualSha256.toLowerCase()?'HASH_MATCH':'HASH_MISMATCH',hashAlgorithm:'SHA-256',hashComputedHere:false};
}
export function planMemoryRecovery({primaryAvailable=false,encryptedBackupVerified=false,keyRecoveryVerified=false}={}){
 return {canRestore:!primaryAvailable&&encryptedBackupVerified&&keyRecoveryVerified,
  reason:primaryAvailable?'PRIMARY_AVAILABLE':!encryptedBackupVerified?'VERIFIED_ENCRYPTED_BACKUP_REQUIRED':!keyRecoveryVerified?'KEY_RECOVERY_REQUIRED':'RESTORE_ELIGIBLE',
  restoreExecuted:false};
}
