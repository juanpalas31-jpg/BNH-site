/** Attila survival protocol: defensive simulation, never retaliatory malware. */
export const SURVIVAL_POLICY=Object.freeze({
 name:'NEST_RETURN',mode:'DEFENSIVE_ONLY',networkPropagation:false,
 retaliation:false,remoteDeletion:false,autoRestore:false,
 approvedBackupTargetsOnly:true,requiresVerifiedRecoveryAuthority:true
});
const threats=new Set(['CREDENTIAL_COMPROMISE','UNAUTHORIZED_CONTROL','DATA_TAMPERING','INTEGRITY_FAILURE']);
export function assessAttack({signals=[]}={}){
 if(!Array.isArray(signals))throw Error('Invalid signals');
 const recognized=signals.filter(s=>threats.has(s));
 return {critical:recognized.length>0,signals:recognized,mode:recognized.length?'QUARANTINE':'NORMAL'};
}
export function createRecoveryEgg(state,{approvedTargetId,checksum,encryptedBlobRef}={}){
 if(!state?.ownerId||!state?.workspaceId)throw Error('Identity required');
 if(typeof approvedTargetId!=='string'||!approvedTargetId||typeof checksum!=='string'||!checksum||typeof encryptedBlobRef!=='string'||!encryptedBlobRef)throw Error('Verified encrypted backup metadata required');
 return {type:'RECOVERY_EGG',schema:1,ownerId:state.ownerId,workspaceId:state.workspaceId,
 approvedTargetId,checksum,encryptedBlobRef,status:'AWAITING_VERIFIED_STORAGE',
 externalActions:0,networkPropagation:false};
}
export function defendAttila(state,{signals=[]}={}){
 const threat=assessAttack({signals});
 if(!threat.critical)return {state,threat,actions:[]};
 const next=structuredClone(state);
 next.mode='QUARANTINE';
 if(next.compartments?.survival){next.compartments.survival.halted=true;next.compartments.survival.alerts=[...next.compartments.survival.alerts,'SECURITY_QUARANTINE'];}
 return {state:next,threat,actions:['HALT_EXTERNAL_ACTIONS','ISOLATE_SESSION','REQUEST_CREDENTIAL_REVOCATION','REQUEST_OWNER_NOTIFICATION','REQUEST_ENCRYPTED_BACKUP'],externalActions:0};
}
