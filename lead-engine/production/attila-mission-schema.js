/** Attila memory mission validation. Metadata only; never accept private content. */
const ID=/^[A-Za-z0-9_-]{1,64}$/;
const ACTIONS=new Set(['CHECK_ACCESS','VERIFY_INTEGRITY','PLAN_RECOVERY']);
const FIELDS=new Set(['id','workspaceId','action','payload']);
const PAYLOAD_FIELDS={
 CHECK_ACCESS:new Set(['actor','resource','operation','consents','authenticated']),
 VERIFY_INTEGRITY:new Set(['expectedSha256','actualSha256']),
 PLAN_RECOVERY:new Set(['primaryAvailable','encryptedBackupVerified','keyRecoveryVerified'])
};
const OBJECT=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
export function validateMission(m,workspaceId){
 if(!OBJECT(m)||!ID.test(workspaceId)||Object.keys(m).some(k=>!FIELDS.has(k))||
 !ID.test(m.id)||m.workspaceId!==workspaceId||!ACTIONS.has(m.action)||!OBJECT(m.payload))throw Error('INVALID_MISSION_SCHEMA');
 if(Object.keys(m.payload).some(k=>!PAYLOAD_FIELDS[m.action].has(k)))throw Error('INVALID_MISSION_PAYLOAD');
 if(m.action==='CHECK_ACCESS'){
  const p=m.payload;
  if(!OBJECT(p.actor)||!OBJECT(p.resource)||!OBJECT(p.consents)||typeof p.authenticated!=='boolean')throw Error('INVALID_ACCESS_PAYLOAD');
  if(Object.keys(p.actor).some(k=>!['id','workspaceId','role','childSlot'].includes(k))||
   Object.keys(p.resource).some(k=>!['id','workspaceId','classification','ownerSlot','participantSlots'].includes(k)))throw Error('INVALID_ACCESS_FIELDS');
  if(Object.keys(p.consents).length>20||Object.values(p.consents).some(c=>!OBJECT(c)||Object.keys(c).some(k=>k!=='podcast')||typeof c.podcast!=='boolean'))throw Error('INVALID_CONSENT_METADATA');
 }
 if(JSON.stringify(m).length>12000)throw Error('MISSION_TOO_LARGE');
 return true;
}
