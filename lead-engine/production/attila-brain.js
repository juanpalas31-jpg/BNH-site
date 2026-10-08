/** Spider Engine — Attila central brain. Pure, auditable orchestration; no external side effects. */
import {ECOSYSTEM_DNA,classifyHabitat,hatchNeoAttila,fourmiTilaBlueprint} from './attila-financial-ecosystem.js';
import {HABITAT_DNA,evaluateProperty,scoutListing,defineNestRequirements} from './attila-habitat.js';
import {validateWeb,buildWeb} from './attila-web-weaver.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const BRAINS=Object.freeze({
 identity:'ATTILA',engine:'SPIDER_ENGINE',version:1,
 compartments:['IDENTITY','MEMORY','FAMILY','PERCEPTION','SURVIVAL','DECISION','EXECUTION','LEARNING'],
 organs:{FINANCE:'attila-financial-ecosystem',HABITAT:'attila-habitat',CONTENT:'attila-web-weaver'},
 defaultMode:'SIMULATION_AND_RESEARCH',liveFinancialOrders:false,realEstatePurchases:false,autoPublishing:false
});
/** Ownership policy: shared capabilities do not confer access to assets. */
export const FAMILY_BRAIN_POLICY=Object.freeze({
 membership:'INVITATION_AND_VERIFIED_IDENTITY_ONLY',accounts:'ISOLATED',
 inheritance:{beneficiaries:'TWO_CHILDREN',shares:[0.5,0.5],status:'FOUNDER_INTENT_NOT_LEGAL_TRANSFER'},
 siblings:{access:'OWN_WORKSPACES_ONLY',assetSharing:false},
 descendants:{inherit:'CAPABILITIES_ONLY',inheritFinancialAssets:false},
 founderApprovalRequired:['LIVE_TRADE','PROPERTY_OFFER','ASSET_TRANSFER','PUBLISH'],
 legalDocumentsRequiredForInheritance:true
});
const DANGEROUS=new Set(['LIVE_TRADE','PROPERTY_OFFER','ASSET_TRANSFER','PUBLISH','EXTERNAL_SEND']);
const MODULES=new Set(['FINANCE','HABITAT','CONTENT','FAMILY']);
export function createBrain({ownerId,workspaceId}={}){
 if(typeof ownerId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(ownerId))throw Error('Valid ownerId required');
 if(typeof workspaceId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(workspaceId))throw Error('Valid workspaceId required');
 return {brain:BRAINS,ownerId,workspaceId,compartments:{
  identity:{species:'ATTILA',ownerId,workspaceId},memory:{events:[],maxEvents:200},
  family:{policy:FAMILY_BRAIN_POLICY,workspaceId},
  perception:{lastSignals:[]},survival:{halted:false,alerts:[]},
  decision:{last:null},execution:{mode:'RESEARCH_ONLY',completed:0},
  learning:{observations:0,lessons:[]}
 }};
}
export function think(brain,signal){
 if(!brain?.compartments||!signal||typeof signal!=='object')throw Error('Brain and signal required');
 const {ownerId,workspaceId}=brain;
 if(signal.ownerId!==ownerId||signal.workspaceId!==workspaceId)return {accepted:false,decision:'REJECT',reason:'WORKSPACE_BOUNDARY',brain};
 const organ=String(signal.organ||'');
 if(!MODULES.has(organ))return {accepted:false,decision:'REJECT',reason:'UNKNOWN_ORGAN',brain};
 const intent=String(signal.intent||'');
 if(DANGEROUS.has(intent))return {accepted:false,decision:'HUMAN_AUTHORIZATION_REQUIRED',reason:'PROTECTED_ACTION',brain};
 let result,decision='OBSERVE';
 try{
  if(organ==='FINANCE'){
   if(intent==='SENSE_MARKET'){result=classifyHabitat(signal.payload?.bars,{symbol:signal.payload?.symbol});decision=result.decision;}
   else if(intent==='HATCH'){result=hatchNeoAttila({id:signal.payload?.id,generation:signal.payload?.generation});decision='HATCHED_SIMULATION_AGENT';}
   else if(intent==='FOURMI_BLUEPRINT'){result=fourmiTilaBlueprint();decision='DORMANT_SPECIES';}
   else throw Error('UNSUPPORTED_FINANCE_INTENT');
  }else if(organ==='HABITAT'){
   if(intent==='EVALUATE'){result=evaluateProperty(signal.payload);decision=result.decision;}
   else if(intent==='SCOUT'){result=scoutListing(signal.payload);decision=result.action;}
   else if(intent==='NEST'){result=defineNestRequirements(signal.payload);decision='SEARCH_SPECIFICATION';}
   else throw Error('UNSUPPORTED_HABITAT_INTENT');
  }else if(organ==='CONTENT'){
   if(intent!=='VALIDATE_WEB')throw Error('UNSUPPORTED_CONTENT_INTENT');
   result=validateWeb(signal.payload);decision=result.valid?'EDITORIAL_REVIEW':'REJECT_INVALID_WEB';
  }else if(organ==='FAMILY'){
   if(intent!=='READ_POLICY')throw Error('UNSUPPORTED_FAMILY_INTENT');
   result=FAMILY_BRAIN_POLICY;decision='READ_ONLY';
  }
 }catch(e){return {accepted:false,decision:'REJECT',reason:e.message,brain};}
 const event={organ,intent,decision,ownerId,workspaceId};
 const next=structuredClone(brain);
 next.compartments.memory.events=[...next.compartments.memory.events.slice(-199),event];
 next.compartments.perception.lastSignals=[event];
 next.compartments.decision.last=event;
 next.compartments.execution.completed++;
 next.compartments.learning.observations++;
 if(decision==='FLEE'||decision==='RETRACT')next.compartments.survival.alerts.push('DANGER_RECOGNIZED');
 return {accepted:true,decision,result,brain:next};
}
export function getBrainBlueprint(){return {brain:BRAINS,family:FAMILY_BRAIN_POLICY,finance:ECOSYSTEM_DNA,habitat:HABITAT_DNA};}
