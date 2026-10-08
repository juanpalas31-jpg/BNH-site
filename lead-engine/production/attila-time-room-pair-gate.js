/** Independent-first admission to the Time Room.
 * Generic participant tokens only; no names or birth dates in this public module.
 * Trusted server must authenticate participants and attest ages; client-supplied flags are NOT proof.
 */
export function decideTimeRoomAdmission({entrants=[],verifiedSoloAdmissions=[],trustedVerification=false}={}){
 const deny=(reason)=>({allowed:false,action:'EJECT_ALL',reason,sessionActive:false});
 if(trustedVerification!==true)return deny('TRUSTED_VERIFICATION_REQUIRED');
 if(!Array.isArray(entrants)||entrants.length===0||entrants.length>2)return deny('INVALID_PARTY');
 if(!Array.isArray(verifiedSoloAdmissions))return deny('INVALID_HISTORY');
 const ids=entrants.map(x=>x?.participantId);
 if(ids.some(x=>typeof x!=='string'||!/^[a-zA-Z0-9_-]{8,80}$/.test(x))||new Set(ids).size!==ids.length)return deny('INVALID_IDENTITIES');
 if(entrants.some(x=>x.ageVerified!==true||x.authorized!==true||!Number.isInteger(x.age)||x.age<40))return deny('AGE_OR_AUTHORIZATION_DENIED');
 if(entrants.length===1)return {allowed:true,action:'ADMIT_SOLO',reason:'ELIGIBLE_SOLO',sessionActive:true,soloAdmissionToRecord:ids[0]};
 if(ids.some(id=>!verifiedSoloAdmissions.includes(id)))return deny('BOTH_INDEPENDENT_SOLO_ADMISSIONS_REQUIRED');
 return {allowed:true,action:'ADMIT_TOGETHER',reason:'BOTH_INDEPENDENTLY_VALIDATED',sessionActive:true};
}
