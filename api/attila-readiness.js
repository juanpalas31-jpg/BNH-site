import { createRuntimeStorage } from "../lead-engine/runtime.js";

const envFlag=(name)=>Boolean(process.env[name]);

export default async function handler(req,res){
 const expected=process.env.ATTILA_CRON_SECRET;
 const supplied=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
 if(!expected)return res.status(503).json({ok:false,state:"NOT_READY",blockers:["ATTILA_CRON_SECRET_MISSING"]});
 if(supplied!==expected)return res.status(401).json({ok:false,error:"Unauthorized"});

 const storage=createRuntimeStorage(process.env);
 const checks={
  heartbeat_secret:true,
  durable_storage_configured:storage.durable_attila===true,
  mission_storage_configured:Boolean(storage.missionStorage),
  signal_source_configured:envFlag("ATTILA_SIGNAL_SOURCE_URL")
 };
 let database={ok:false,provider:storage.provider};
 if(storage.primary&&typeof storage.primary.healthcheck==="function"){
  try{database=await storage.primary.healthcheck()}catch(e){database={ok:false,provider:storage.provider,error:String(e?.message||e).slice(0,120)}}
 }
 const blockers=[];
 if(!checks.durable_storage_configured)blockers.push("POSTGRES_NOT_CONFIGURED");
 if(!checks.mission_storage_configured)blockers.push("MISSION_STORAGE_NOT_CONFIGURED");
 if(!database.ok)blockers.push("DATABASE_HEALTHCHECK_FAILED");
 if(!checks.signal_source_configured)blockers.push("SIGNAL_SOURCE_NOT_CONFIGURED");

 return res.status(blockers.length?503:200).json({
  ok:blockers.length===0,
  state:blockers.length?"NOT_READY":"ATTILA_CORE_READY",
  checks,database,blockers,
  external:{
   deployment_proof:"CHECK_PROVIDER",
   payment_provider:"OPTIONAL_NOT_REQUIRED_FOR_CORE",
   ads_registrar:"OPTIONAL_NOT_REQUIRED_FOR_CORE"
  }
 });
}
