import {createPhotoboothCommand,PHOTOBOOTH_API_CONTRACT} from "../lead-engine/api/atila-photobooth-api.js";

export default async function handler(req,res){
 if(req.method==="GET") return res.status(200).json({ok:true,contract:PHOTOBOOTH_API_CONTRACT});
 if(req.method!=="POST") return res.status(405).json({ok:false,error:"METHOD_NOT_ALLOWED"});

 const ownerToken=process.env.ATTILA_PHOTOBOOTH_OWNER_TOKEN;
 if(!ownerToken) return res.status(503).json({ok:false,error:"PHOTOBOOTH_OWNER_TOKEN_NOT_CONFIGURED"});
 const supplied=String(req.headers["x-attila-owner-token"]||"");
 const owner_verified=supplied.length>0&&supplied===ownerToken;

 const result=createPhotoboothCommand({
  booth_id:req.body?.booth_id,
  command:req.body?.command,
  payload:req.body?.payload,
  owner_verified
 });
 return res.status(result.ok?200:403).json(result);
}
