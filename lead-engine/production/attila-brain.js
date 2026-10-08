import {TUNNEL_FACTORY_DNA,assignTunnelMission} from './attila-tunnel-factory.js';
import {FIRST_FLIGHT_DNA,getFirstFlightStoryboard,requestFirstFlightActivation} from './attila-first-flight.js';
import {EVOLUTION_DNA,calculateEvolution,buildEvolutionTimeline} from './attila-generational-evolution.js';
import {PATRIMONY_DNA,assessPatrimony} from './attila-patrimony-dna.js';
import {defendAttila} from './attila-survival-protocol.js';
import {planSilk,SILK_ARCHITECTURES} from './attila-silk-cognition.js';
import {CHIMERA_GENOME,selectChimeraStrategy} from './attila-chimera-genome.js';
/** Spider Engine — Attila central brain. Pure, auditable orchestration; no external side effects. */
import {ECOSYSTEM_DNA,classifyHabitat,hatchNeoAttila,fourmiTilaBlueprint} from './attila-financial-ecosystem.js';
import {HABITAT_DNA,evaluateProperty,scoutListing,defineNestRequirements} from './attila-habitat.js';
import {validateWeb,buildWeb} from './attila-web-weaver.js';
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const BRAINS=Object.freeze({
 identity:'ATTILA',engine:'SPIDER_ENGINE',version:2,genome:CHIMERA_GENOME,
 compartments:['IDENTITY','MEMORY','FAMILY','PERCEPTION','SURVIVAL','DECISION','EXECUTION','LEARNING'],
 organs:{FINANCE:'attila-financial-ecosystem',HABITAT:'attila-habitat',CONTENT:'attila-web-weaver',PATRIMONY:'attila-patrimony-dna'},
 defaultMode:'SIMULATION_AND_RESEARCH',liveFinancialOrders:false,realEstatePurchases:false,autoPublishing:false
});
/** Ownership policy: shared capabilities do not confer access to assets. */
export const FAMILY_BRAIN_POLICY=Object.freeze({
 membership:'INVITATION_AND_VERIFIED_IDENTITY_ONLY',accounts:'ISOLATED',
 inheritance:{beneficiaries:'TWO_CHILDREN',shares:[0.5,0.5],delivery:'SIMULTANEOUS_TO_BOTH',activation:'JOINT_RELEASE_AFTER_VERIFIED_AUTHORIZATION',status:'FOUNDER_INTENT_NOT_LEGAL_TRANSFER'},
 siblings:{access:'OWN_WORKSPACES_ONLY',assetSharing:false},
 descendants:{inherit:'CAPABILITIES_ONLY',inheritFinancialAssets:false},
 founderApprovalRequired:['LIVE_TRADE','PROPERTY_OFFER','ASSET_TRANSFER','PUBLISH'],
 legalDocumentsRequiredForInheritance:true
});
const DANGEROUS=new Set(['LIVE_TRADE','PROPERTY_OFFER','ASSET_TRANSFER','PUBLISH','EXTERNAL_SEND']);
const MODULES=new Set(['FINANCE','HABITAT','CONTENT','FAMILY','BIOLOGY','PATRIMONY','EVOLUTION','LEGACY','TUNNELS']);
export function createBrain({ownerId,workspaceId}={}){
 if(typeof ownerId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(ownerId))throw Error('Valid ownerId required');
 if(typeof workspaceId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(workspaceId))throw Error('Valid workspaceId required');
 return {brain:BRAINS,ownerId,workspaceId,compartments:{
  identity:{species:'DIGITAL_ARANEAE_CHIMERA',genome:CHIMERA_GENOME,ownerId,workspaceId},memory:{events:[],maxEvents:200},
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
 if(brain.compartments.survival.halted)return {accepted:false,decision:'QUARANTINE',reason:'SECURITY_LOCKDOWN',brain};
 if(signal.type==='SECURITY_ALERT'){const response=defendAttila(brain,{signals:signal.payload?.signals||[]});return {accepted:true,decision:response.threat.mode,brain:response.state,result:response.threat};}
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
  }else if(organ==='BIOLOGY'){
   if(intent==='READ_GENOME'){result=CHIMERA_GENOME;decision='GENOME_READ';}
   else if(intent==='SELECT_HUNT'){result=selectChimeraStrategy(signal.payload||{});decision=result.strategy;}
   else if(intent==='PLAN_SILK'){result=planSilk(signal.payload||{});decision=result.build?'WEB_PLAN':'FREE_HUNT_OR_RETREAT';}
   else if(intent==='READ_SILK'){result=SILK_ARCHITECTURES;decision='SILK_ARCHITECTURES_READ';}
   else throw Error('UNSUPPORTED_BIOLOGY_INTENT');
  }else if(organ==='TUNNELS'){
   if(intent==='READ_FACTORY'){result=TUNNEL_FACTORY_DNA;decision='FACTORY_DNA_READ';}
   else if(intent==='PLAN_MISSION'){result=assignTunnelMission({...signal.payload,workspaceId});decision='TUNNEL_DRAFT_READY';}
   else throw Error('UNSUPPORTED_TUNNEL_INTENT');
  }else if(organ==='LEGACY'){
   if(intent==='STORYBOARD'){result=getFirstFlightStoryboard();decision='STORYBOARD_PREVIEW';}
   else if(intent==='ACTIVATION_CHECK'){result=requestFirstFlightActivation(signal.payload||{});decision=result.status;}
   else throw Error('UNSUPPORTED_LEGACY_INTENT');
  }else if(organ==='EVOLUTION'){
   if(intent==='READ_DNA'){result=EVOLUTION_DNA;decision='EVOLUTION_DNA_READ';}
   else if(intent==='ASSESS'){result=calculateEvolution(signal.payload||{});decision='EVOLUTION_ASSESSED';}
   else if(intent==='TIMELINE'){result=buildEvolutionTimeline(signal.payload||{});decision='EVOLUTION_TIMELINE';}
   else throw Error('UNSUPPORTED_EVOLUTION_INTENT');
  }else if(organ==='PATRIMONY'){
   if(intent==='READ_DNA'){result=PATRIMONY_DNA;decision='PATRIMONY_DNA_READ';}
   else if(intent==='ASSESS'){result=assessPatrimony(signal.payload||{});decision=result.stage;}
   else throw Error('UNSUPPORTED_PATRIMONY_INTENT');
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
export function getBrainBlueprint(){return {brain:BRAINS,family:FAMILY_BRAIN_POLICY,finance:ECOSYSTEM_DNA,habitat:HABITAT_DNA,genome:CHIMERA_GENOME,patrimony:PATRIMONY_DNA,evolution:EVOLUTION_DNA,firstFlight:FIRST_FLIGHT_DNA,tunnelFactory:TUNNEL_FACTORY_DNA};}
