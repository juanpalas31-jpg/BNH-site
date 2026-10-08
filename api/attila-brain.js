import {runCognitiveCycle} from '../lead-engine/production/attila-autonomy-loop.js';
import {authorizeFamilyRequest} from '../lead-engine/production/attila-private-family-access.js';
import {createBrain,think,getBrainBlueprint} from '../lead-engine/production/attila-brain.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const auth=authorizeFamilyRequest(req);if(!auth.ok)return res.status(auth.status).json({error:auth.reason});
 if(req.method==='GET')return res.status(200).json(getBrainBlueprint());
 if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'INVALID_JSON'});}
 try{
  if(!b||typeof b!=='object')throw Error('INVALID_BODY');
  const ownerId=String(b.ownerId||''),workspaceId=String(b.workspaceId||'');
  if(b.action==='cycle'){
   if(!Array.isArray(b.stimuli)||b.stimuli.length>20)return res.status(400).json({error:'INVALID_STIMULI'});
   const cycle=runCognitiveCycle({ownerId,workspaceId,stimuli:b.stimuli});
   return res.status(200).json({mode:cycle.mode,decisions:cycle.decisions,brain:cycle.brain,externalActions:0,persistent:false});
  }
  const brain=createBrain({ownerId,workspaceId});
  const signal=b.signal||{};
  // Caller-supplied workspace is not a verified identity. Do not store or expose private data.
  const result=think(brain,{...signal,ownerId,workspaceId});
  return res.status(result.accepted?200:400).json({accepted:result.accepted,decision:result.decision,result:result.result||null,reason:result.reason||null,compartments:result.brain.compartments});
 }catch(e){return res.status(400).json({error:e.message});}
}
