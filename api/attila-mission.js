import { createRuntimeStorage } from "../lead-engine/runtime.js";
import { createMissionPersistence } from "../lead-engine/production/atila-mission-persistence.js";
import { createMissionState,runMissionUntilBlocked,missionDashboard } from "../lead-engine/production/atila-mission-orchestrator.js";

const clean=(v,n=160)=>String(v??"").trim().slice(0,n);

export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({ok:false,error:"Method not allowed"});
 const expected=process.env.ATTILA_MISSION_SECRET||process.env.ATTILA_CRON_SECRET;
 const supplied=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
 if(!expected)return res.status(503).json({ok:false,error:"Attila mission API not configured"});
 if(supplied!==expected)return res.status(401).json({ok:false,error:"Unauthorized"});

 try{
  const body=req.body||{};
  const storage=createRuntimeStorage(process.env);
  const persistence=createMissionPersistence(storage.missionStorage);
  const missionId=clean(body.mission_id,128);
  let state=null;

  if(persistence.ok&&missionId){
   const restored=await persistence.resume(missionId);
   if(restored.ok)state=restored.state;
  }
  if(!state){
   state=createMissionState({
    mission_id:missionId,
    client_id:clean(body.client_id,128),
    sector:clean(body.sector,120),
    consent:body.client_consent===true
   });
  }
  if(!state.ok)return res.status(400).json(state);

  // HTTP callers cannot inject executable functions. Server-side executors must be
  // registered in code; without one, the runner stops safely at EXECUTOR_REQUIRED.
  const result=body.execute===true
   ?await runMissionUntilBlocked({
      state,executors:{},max_steps:Math.min(Number(body.max_steps)||1,12),
      onProgress:persistence.ok?async s=>persistence.save(s):null
    })
   :{ok:true,state:"READY",mission:state,trace:[]};

  const finalState=result.mission||state;
  const saved=persistence.ok?await persistence.save(finalState):{ok:false,state:"MISSION_STORAGE_NOT_CONFIGURED"};

  return res.status(200).json({
   ok:true,
   protocol:"ATTILA_MISSION_API_V1",
   mission:missionDashboard(finalState),
   execution:{ok:result.ok,state:result.state,trace:result.trace},
   persistence:saved,
   storage:{provider:storage.provider,durable:storage.durable_attila},
   arbitrary_remote_executor:false
  });
 }catch(e){
  return res.status(500).json({ok:false,error:"Attila mission API failed",detail:String(e?.message||e).slice(0,180)});
 }
}
