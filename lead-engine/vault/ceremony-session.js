export function createCeremonySession({sessionId,branchId,integrityPassed=false}={}){
 if(!sessionId||!branchId) throw new Error("session_and_branch_required");
 return {
  sessionId,branchId,
  state:integrityPassed?"READY":"BLOCKED",
  firstAwakening:true,
  resumable:true,
  safeStop:true,
  privateByDefault:true,
  recording:false,
  events:[]
 };
}

export function appendCeremonyEvent(session,event){
 if(!session||!event?.type) throw new Error("session_and_event_required");
 return {...session,events:[...(session.events||[]),{type:event.type,ref:event.ref||null}]};
}
