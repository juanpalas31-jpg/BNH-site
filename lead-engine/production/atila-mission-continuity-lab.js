import { createMemoryMissionAdapter } from "./atila-mission-persistence.js";
import { runIntegratedAttilaCycle } from "./atila-integrated-runtime.js";

/**
 * Explicit LAB/OFFLINE harness.
 * Proves mission resume wiring without claiming production durability.
 */
export async function missionContinuityLab(){
 const adapter=createMemoryMissionAdapter();
 const mission={
  mission_id:"lab-mission-1",
  owner_verified:true,
  client_consent:true,
  client:{id:"lab-client",sector:"espaces verts",region:"test"},
  budget:{ads_max:0,domain_max:0,currency:"EUR"},
  term:{guardian_days:7}
 };
 const first=await runIntegratedAttilaCycle({missionStorage:adapter,context:{mission}});
 const second=await runIntegratedAttilaCycle({missionStorage:adapter,context:{mission}});
 return{
  mode:"LAB_OFFLINE",
  first_saved:first.mission_control?.persistence?.ok===true,
  second_resumed:second.mission_control?.resumed===true,
  production_durability:false
 };
}
