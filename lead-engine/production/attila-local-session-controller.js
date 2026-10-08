/** Local guest session decision engine. Not a hardware controller.
 * Facts must originate from a trusted local verifier; never trust browser claims.
 */
import {decideLocalGuestEntry,shouldTerminateGuestSession} from './attila-time-room-guest-gate.js';
export function newLocalSession(){return {active:false,sequence:0};}
export function localSessionDecision(state,event){
 if(!state||typeof state.active!=='boolean'||!Number.isSafeInteger(state.sequence))throw Error('INVALID_SESSION_STATE');
 const close=(reason)=>({state:{active:false,sequence:state.sequence+1},decision:'REVOKE',reason});
 if(!event||typeof event!=='object')return close('INVALID_EVENT');
 if(event.type==='OPEN'){
  if(state.active)return close('REOPEN_REQUIRES_NEW_SESSION');
  const decision=decideLocalGuestEntry(event.facts||{});
  return decision.allowed?{state:{active:true,sequence:state.sequence+1},decision:'ALLOW_TEMPORARY',reason:'LOCAL_GUEST_VERIFIED'}:close(decision.reason);
 }
 if(event.type==='CHECK'){
  if(!state.active)return close('SESSION_NOT_ACTIVE');
  const f=event.facts||{};
  if(shouldTerminateGuestSession(f)||f.guestPresent!==true||f.guestVerified!==true||f.localOnly!==true||f.guestIsFamilyChild!==false)return close('LOCAL_PRESENCE_OR_AUTHORIZATION_LOST');
  return {state,decision:'CONTINUE',reason:'LOCAL_PRESENCE_CONFIRMED'};
 }
 return close(event.type==='CLOSE'?'FOUNDER_CLOSED':'UNRECOGNIZED_EVENT');
}
