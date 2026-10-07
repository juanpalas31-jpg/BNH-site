import { createAttilaHeartbeat } from "../lead-engine/production/atila-heartbeat.js";

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
 if(expected&&supplied!==expected)return res.status(401).json({ok:false,error:"Unauthorized"});
 try{
  let result;
  const heart=createAttilaHeartbeat({
   readSignals:async()=>{
    const data=await readJson(process.env.ATTILA_SIGNAL_SOURCE_URL,process.env.ATTILA_SIGNAL_SOURCE_SECRET);
    return data||{pages:[],events:[],leads:[],previous:{}};
   },
   saveState:async snapshot=>{result=snapshot},
   proposeAction:async plan=>{result={...(result||{}),proposal:plan}}
  });
  const beat=await heart.beat();
  return res.status(200).json({ok:true,identity:"ATTILA",heartbeat:beat,proposal:result?.proposal||null,
   autonomous_external_action:false});
 }catch(e){return res.status(500).json({ok:false,error:"Attila heartbeat failed"});}
}
