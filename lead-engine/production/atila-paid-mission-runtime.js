import { continuePaidMission } from "./atila-rental-instance.js";
import { runMissionUntilBlocked } from "./atila-mission-orchestrator.js";

/**
 * Connects an already verified paid rental instance to the evidence-gated mission runner.
 * Payment verification and client consent happen before this boundary.
 */
export async function runPaidMissionRuntime({instance,mission_state,executors={},missionPersistence=null,max_steps=12,now=new Date()}={}){
 const gate=continuePaidMission({instance,mission_state,now});
 if(!gate.ok)return{ok:false,state:gate.state,action:gate.action||"STOP",mission:mission_state||null};

 const result=await runMissionUntilBlocked({
  state:mission_state,
  executors,
  max_steps,
  onProgress:missionPersistence?.ok?async nextState=>missionPersistence.save(nextState):null
 });
 const mission=result.mission||mission_state;
 const persistence=missionPersistence?.ok?await missionPersistence.save(mission):{ok:false,state:"MISSION_STORAGE_NOT_CONFIGURED"};

 return{
  ok:result.ok,
  protocol:"ATTILA_PAID_MISSION_RUNTIME_V1",
  instance_id:instance.instance_id,
  lease:instance.lease,
  gate,
  execution:result,
  mission,
  persistence,
  autonomous_spend:false,
  payment_reverification_required_for_new_charge:true
 };
}
