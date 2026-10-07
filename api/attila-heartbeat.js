import { createAttilaHeartbeat } from "../lead-engine/production/atila-heartbeat.js";
import { plannerInputFromMemory,rememberAttilaHunt,rememberAttilaPosture,snapshotAttilaMemory,hydrateAttilaMemory } from "../lead-engine/production/atila-runtime-memory.js";
import { createRuntimeStorage } from "../lead-engine/runtime.js";
import { sanitizeAttilaState } from "../lead-engine/storage/attilla-state-sanitizer.js";
import { runIntegratedAttilaCycle } from "../lead-engine/production/atila-integrated-runtime.js";

const json=async r=>{try{return await r.json()}catch{return null}};
async function readJson(url,secret){
 if(!url)return null;
 const r=await fetch(url,{headers:secret?{"authorization":`Bearer ${secret}`}:{}});
 if(!r.ok)throw new Error("signal_source_failed");
 return json(r);
}
export default async function handler(req,res){
 const expected=process.env.ATTILA_CRON_SECRET;
 const supplied=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
 if(!expected)return res.status(503).json({ok:false,error:"Attila heartbeat not configured"});
 if(supplied!==expected)return res.status(401).json({ok:false,error:"Unauthorized"});
 try{
  const storage=createRuntimeStorage(process.env);
  let restored=false,result;

  if(storage.durable_attila&&storage.primary){
   const saved=await storage.primary.loadAttilaState("bnh","bnh-site");
   if(saved){hydrateAttilaMemory(saved);restored=true;}
  }

  const heart=createAttilaHeartbeat({
   readSignals:async()=>{
    const data=await readJson(process.env.ATTILA_SIGNAL_SOURCE_URL,process.env.ATTILA_SIGNAL_SOURCE_SECRET);
    return data||plannerInputFromMemory();
   },
   saveState:async snapshot=>{
    rememberAttilaPosture(snapshot?.posture,{reason:snapshot?.cycle?.reason});
    result=snapshot;
    if(storage.durable_attila&&storage.primary){
     await storage.primary.saveAttilaState({tenant_id:"bnh",project_id:"bnh-site",...sanitizeAttilaState(snapshotAttilaMemory())});
    }
   },
   proposeAction:async plan=>{rememberAttilaHunt(plan);result={...(result||{}),proposal:plan}}
  });
  const beat=await heart.beat();
  const plannerInput=plannerInputFromMemory();
  const integrated=await runIntegratedAttilaCycle({
   storage:storage.primary,
   ...plannerInput,
   context:{source:"heartbeat",durable_storage:storage.durable_attila}
  });

  // Save again after proposal so the last hunt is not lost between serverless invocations.
  if(storage.durable_attila&&storage.primary){
   await storage.primary.saveAttilaState({tenant_id:"bnh",project_id:"bnh-site",...sanitizeAttilaState(snapshotAttilaMemory())});
  }

  return res.status(200).json({ok:true,identity:"ATTILA",heartbeat:beat,integrated,proposal:result?.proposal||null,
   memory:snapshotAttilaMemory(),storage:{provider:storage.provider,durable:storage.durable_attila,restored},
   autonomous_external_action:false});
 }catch(e){
  return res.status(500).json({ok:false,error:"Attila heartbeat failed",detail:String(e?.message||e).slice(0,160)});
 }
}
