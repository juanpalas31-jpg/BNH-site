import {authorizeFamilyRequest} from '../lead-engine/production/attila-private-family-access.js';
import {HABITAT_DNA,evaluateProperty,scoutListing,defineNestRequirements} from '../lead-engine/production/attila-habitat.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const auth=authorizeFamilyRequest(req);if(!auth.ok)return res.status(auth.status).json({error:auth.reason});
 if(req.method==='GET')return res.status(200).json({dna:HABITAT_DNA,actions:['evaluate','scout','nest']});
 if(req.method!=='POST')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
 let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'INVALID_JSON'});}
 if(!body||typeof body!=='object')return res.status(400).json({error:'INVALID_BODY'});
 try{
  if(body.action==='evaluate')return res.status(200).json(evaluateProperty(body.property));
  if(body.action==='scout')return res.status(200).json(scoutListing(body.listing));
  if(body.action==='nest')return res.status(200).json(defineNestRequirements(body.preferences||{}));
  return res.status(400).json({error:'UNKNOWN_ACTION'});
 }catch(e){return res.status(400).json({error:e.message});}
}
