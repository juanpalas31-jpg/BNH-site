import {authorizeFamilyRequest} from '../lead-engine/production/attila-private-family-access.js';
import {ECOSYSTEM_DNA,hatchNeoAttila,classifyHabitat,motherBrief,fourmiTilaBlueprint} from '../lead-engine/production/attila-financial-ecosystem.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const auth=authorizeFamilyRequest(req);if(!auth.ok)return res.status(auth.status).json({error:auth.reason});
 if(req.method==='GET')return res.status(200).json({dna:ECOSYSTEM_DNA,fourmiTila:fourmiTilaBlueprint()});
 if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'INVALID_JSON'});}
 if(!b||typeof b!=='object')return res.status(400).json({error:'INVALID_BODY'});
 try{
  if(b.action==='hatch')return res.status(200).json({neo:hatchNeoAttila({id:b.id,parent:'ATTILA',generation:b.generation||1})});
  if(b.action==='habitat'){if(!Array.isArray(b.bars)||b.bars.length>1000)return res.status(400).json({error:'INVALID_BARS'});return res.status(200).json(classifyHabitat(b.bars,{symbol:String(b.symbol||'UNKNOWN').slice(0,32)}));}
  if(b.action==='brief')return res.status(200).json(motherBrief({habitats:b.habitats,scouts:b.scouts}));
  return res.status(400).json({error:'UNKNOWN_ACTION'});
 }catch(e){return res.status(400).json({error:e.message});}
}
