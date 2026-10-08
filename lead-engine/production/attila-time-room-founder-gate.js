/** Founder-only Time Room, with a single exceptional three-person reunion.
 * All identities and ages MUST be attested by a trusted server. This pure policy
 * does not verify identity, life status, age, or persist solo admission records.
 * No family names or birthdates are stored here.
 */
export const FOUNDER_TIME_ROOM_POLICY=Object.freeze({
 default:'DENY',founderSoloOnly:true,childrenWithFounderBeforeBoth40:'DENY',
 siblingOnly:'DENY',singleChildWithFounder:'DENY',exception:'FOUNDER_PLUS_BOTH_ADULT_CHILDREN',
 minimumChildAge:40,founderAliveRequired:true,allThreeIndividuallyVerified:true
});
const fail=reason=>({allowed:false,action:'CLOSE_SESSION_AND_DENY_ALL',reason});
export function decideFounderTimeRoomEntry({entrants=[],founderId,childIds=[],trustedVerification=false,founderAliveVerified=false}={}){
 if(trustedVerification!==true)return fail('TRUSTED_VERIFICATION_REQUIRED');
 if(typeof founderId!=='string'||!Array.isArray(childIds)||childIds.length!==2||new Set([founderId,...childIds]).size!==3||[founderId,...childIds].some(x=>!/^[a-zA-Z0-9_-]{8,80}$/.test(x)))return fail('INVALID_FAMILY_IDENTITIES');
 if(!Array.isArray(entrants)||entrants.length===0||entrants.length>3)return fail('INVALID_PARTY');
 const ids=entrants.map(x=>x?.participantId);
 if(ids.some(x=>typeof x!=='string')||new Set(ids).size!==ids.length)return fail('INVALID_PARTICIPANTS');
 if(entrants.some(x=>x.authorized!==true||x.identityVerified!==true))return fail('IDENTITY_OR_AUTHORIZATION_DENIED');
 if(ids.length===1&&ids[0]===founderId)return {allowed:true,action:'ADMIT_FOUNDER_SOLO',reason:'FOUNDER_ONLY'};
 if(ids.length!==3||!ids.includes(founderId)||childIds.some(id=>!ids.includes(id)))return fail('FOUNDER_SOLO_OR_COMPLETE_TRIO_ONLY');
 if(founderAliveVerified!==true)return fail('FOUNDER_LIFE_STATUS_NOT_VERIFIED');
 if(entrants.filter(x=>childIds.includes(x.participantId)).some(x=>x.ageVerified!==true||!Number.isInteger(x.age)||x.age<40))return fail('CHILD_MINIMUM_AGE_40_NOT_VERIFIED');
 return {allowed:true,action:'ADMIT_COMPLETE_TRIO',reason:'ALL_THREE_VERIFIED'};
}
