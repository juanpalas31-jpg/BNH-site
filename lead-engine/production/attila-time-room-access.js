/** Salle du Temps access policy.
 * All participants must be 40+; explicit adult authorization is also required.
 * Age is NOT verified by this module: production needs trusted identity and age verification.
 * Do not store child identities or birthdates in this public repository.
 */
export const TIME_ROOM_ACCESS_POLICY=Object.freeze({
 minimumAge:40,defaultAccess:'DENY',requiresVerifiedAge:true,
 requiresExplicitAuthorization:true,unverifiedIdentity:'DENY',
 appliesTo:'ALL_PARTICIPANTS',childTrainingOutsideTimeRoom:true
});
export function authorizeTimeRoomEntry({age,ageVerified=false,authorized=false}={}){
 if(!Number.isInteger(age)||age<0||age>125)return {allowed:false,reason:'INVALID_OR_UNKNOWN_AGE'};
 if(age<40)return {allowed:false,reason:'MINIMUM_AGE_40'};
 if(ageVerified!==true)return {allowed:false,reason:'AGE_NOT_VERIFIED'};
 if(authorized!==true)return {allowed:false,reason:'NOT_AUTHORIZED'};
 return {allowed:true,reason:'ELIGIBLE_AND_AUTHORIZED'};
}
export function requireTimeRoomEntry(input){
 const decision=authorizeTimeRoomEntry(input);
 if(!decision.allowed)throw new Error('TIME_ROOM_ACCESS_DENIED:'+decision.reason);
 return decision;
}
