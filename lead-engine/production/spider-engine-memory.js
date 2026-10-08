/** Spider Engine + Attila / archival memory contract.
 * CODE ONLY: no recordings or private transcripts belong in a public repository.
 * Pure functions: actual encrypted object storage, key management, authentication,
 * consent ledger and backups must be provisioned before any ingestion.
 */
export const MEMORY_POLICY=Object.freeze({
 owners:['SPIDER_ENGINE','ATTILA'],mode:'PRIVATE_BY_DEFAULT',
 layers:['ORIGINAL_AUDIO','TRANSCRIPT','PROVENANCE','CONSENT','DERIVATIVES'],
 originalImmutable:true,derivativesSeparate:true,automaticPublication:false,
 status:'SCHEMA_ONLY_NOT_CONNECTED',encryptedStorage:false,backupsConfigured:false
});
const id=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(s);
const hash=s=>typeof s==='string'&&/^[a-fA-F0-9]{64}$/.test(s);
export function draftVoiceArchive({workspaceId,recordingId,recordedAt,sha256,mediaType,durationSeconds,participants=[],consent={}}={}){
 if(!id(workspaceId)||!id(recordingId)||!hash(sha256)||typeof recordedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(recordedAt))throw Error('INVALID_ARCHIVE_IDENTITY');
 if(!['audio/mpeg','audio/mp4','audio/wav','audio/ogg','audio/webm'].includes(mediaType)||!Number.isFinite(durationSeconds)||durationSeconds<=0||durationSeconds>86400)throw Error('INVALID_MEDIA');
 if(!Array.isArray(participants)||participants.length>20||participants.some(p=>!p||!id(p.slot)||!['ADULT','MINOR','UNKNOWN'].includes(p.role)))throw Error('INVALID_PARTICIPANTS');
 const normalized=participants.map(p=>({slot:p.slot,role:p.role}));
 const allConsent=normalized.length>0&&normalized.every(p=>consent[p.slot]?.archive===true);
 const reuseConsent=allConsent&&normalized.every(p=>consent[p.slot]?.podcast===true);
 return {workspaceId,recordingId,recordedAt,sha256:sha256.toLowerCase(),mediaType,durationSeconds,
  participants:normalized,archiveAllowed:allConsent,podcastAllowed:reuseConsent,
  status:'DRAFT_ONLY_NO_AUDIO_STORED',originalObjectKey:null,transcriptObjectKey:null,
  transcriptProvenance:'NOT_CREATED',publicRelease:false,
  nextSteps:['VERIFY_CONSENT_AND_CHILD_ASSENT','PROVISION_ENCRYPTED_PRIVATE_STORAGE','UPLOAD_ORIGINAL_WITH_HASH_CHECK','TRANSCRIBE_WITH_SPEAKER_REVIEW','SET_RETENTION_AND_DELETION_POLICY']};
}
export function planPodcastExcerpt(archive,{startSeconds,endSeconds,editorApproved=false}={}){
 if(!archive||archive.status!=='DRAFT_ONLY_NO_AUDIO_STORED')throw Error('INVALID_ARCHIVE');
 if(!Number.isFinite(startSeconds)||!Number.isFinite(endSeconds)||startSeconds<0||endSeconds<=startSeconds||endSeconds>archive.durationSeconds)throw Error('INVALID_EXCERPT');
 return {recordingId:archive.recordingId,range:[startSeconds,endSeconds],
  status:archive.podcastAllowed&&editorApproved?'APPROVED_FOR_FUTURE_PRIVATE_RENDER':'BLOCKED_PENDING_CONSENT_AND_APPROVAL',
  published:false,audioRendered:false,originalUnchanged:true};
}
