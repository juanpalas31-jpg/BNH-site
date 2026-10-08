import {createOrganicCampaign,rankOrganicCreatives} from './attila-organic-creative-engine.js';
import {newLocalSession,localSessionDecision} from './attila-local-session-controller.js';
import {decideLocalGuestEntry,shouldTerminateGuestSession} from './attila-time-room-guest-gate.js';
import {decideFounderTimeRoomEntry} from './attila-time-room-founder-gate.js';
import {decideTimeRoomAdmission} from './attila-time-room-pair-gate.js';
import {requireTimeRoomEntry} from './attila-time-room-access.js';
import {planTimeRoomSession,chooseAssistance} from './attila-time-room-adaptive.js';
import {listDevelopmentExercises,createDevelopmentSession} from './attila-development-training.js';
import {listDefensiveTraining,buildDefensiveSession} from './attila-defensive-training.js';
import {enterTimeChamber,trainInTimeChamber,exitTimeChamber} from './attila-time-chamber.js';
import {createVivarium,simulateVivariumStep,assessVivarium} from './attila-vivarium.js';
import {authorizeMemoryAction,evaluateMemoryIntegrity,planMemoryRecovery} from './spider-private-memory-guard.js';
import {makeEggMemoryDraft,proposeEggActivities} from './attila-egg-memory.js';
import {buildPosterFunnelBatch} from './attila-poster-batch.js';
import {buildPosterLanding} from './attila-poster-web.js';
import {planSocialCampaign,summarizeSocialTraffic} from './attila-social-growth.js';
import {SOCIAL_CONNECTOR_DNA,designSocialConnector} from './attila-social-connectors.js';
import {MARKETPLACE_DNA,observeMarketplaceEvent,summarizeMarketplaceEvents} from './attila-marketplace-observer.js';
import {generateTunnelSite,suggestDomains} from './attila-tunnel-builder.js';
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
const MODULES=new Set(['FINANCE','HABITAT','CONTENT','FAMILY','BIOLOGY','PATRIMONY','EVOLUTION','LEGACY','TUNNELS','MARKETPLACE','SOCIAL','MEMORY','VIVARIUM','TIME_CHAMBER','DEFENSIVE_TRAINING','DEVELOPMENT_TRAINING','TIME_ROOM_ADAPTIVE','TIME_ROOM_ADMISSION','TIME_ROOM_GUEST','ORGANIC_CREATIVE']);
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
  if(organ==='ORGANIC_CREATIVE'){
   if(intent==='CREATE_CAMPAIGN'){result=createOrganicCampaign({...signal.payload,workspaceId});decision='ORGANIC_CAMPAIGN_DRAFTED';}
   else if(intent==='RANK_RESULTS'){result=rankOrganicCreatives(signal.payload?.metrics||[]);decision='ORGANIC_RESULTS_RANKED';}
   else throw Error('UNSUPPORTED_ORGANIC_CREATIVE_INTENT');
  }else if(organ==='FINANCE'){
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
   if(intent==='DRAFT_EGG_MEMORY'){result=makeEggMemoryDraft({...signal.payload,workspaceId});decision='EGG_MEMORY_DRAFTED';}
   else if(intent==='PROPOSE_EGG_ACTIVITIES'){result=proposeEggActivities(signal.payload?.draft);decision='EGG_ACTIVITIES_SUGGESTED';}
   else throw Error('UNSUPPORTED_FAMILY_INTENT');
  }else if(organ==='MEMORY'){
   if(intent==='CHECK_ACCESS'){
    result=authorizeMemoryAction({...signal.payload,actor:{...signal.payload?.actor,workspaceId},resource:{...signal.payload?.resource}});
    decision=result.allowed?'MEMORY_POLICY_PASSED':'MEMORY_ACCESS_DENIED';
   }else if(intent==='VERIFY_INTEGRITY'){
    result=evaluateMemoryIntegrity(signal.payload||{});decision=result.verified?'MEMORY_HASH_MATCH':'MEMORY_HASH_REJECTED';
   }else if(intent==='PLAN_RECOVERY'){
    result=planMemoryRecovery(signal.payload||{});decision=result.canRestore?'MEMORY_RECOVERY_ELIGIBLE':'MEMORY_RECOVERY_BLOCKED';
   }else throw Error('UNSUPPORTED_MEMORY_INTENT');
  }else if(organ==='TIME_ROOM_GUEST'){
   if(intent==='NEW_SESSION'){result=newLocalSession();decision='LOCAL_GUEST_SESSION_CREATED';}
   else if(intent==='STEP_SESSION'){result=localSessionDecision(signal.payload?.state,signal.payload?.event);decision=result.decision==='REVOKE'?'LOCAL_GUEST_SESSION_REVOKED':'LOCAL_GUEST_SESSION_'+result.decision;}
   else if(intent==='CHECK_INVITATION'){result=decideLocalGuestEntry(signal.payload||{});decision=result.allowed?'LOCAL_GUEST_INVITATION_APPROVED':'LOCAL_GUEST_INVITATION_DENIED';}
   else if(intent==='CHECK_TERMINATION'){result={terminate:shouldTerminateGuestSession(signal.payload||{})};decision=result.terminate?'TERMINATE_GUEST_SESSION':'KEEP_GUEST_SESSION';}
   else throw Error('UNSUPPORTED_TIME_ROOM_GUEST_INTENT');
  }else if(organ==='TIME_ROOM_ADMISSION'){
   if(intent!=='CHECK_ENTRY')throw Error('UNSUPPORTED_TIME_ROOM_ADMISSION_INTENT');
   result=decideFounderTimeRoomEntry(signal.payload||{});
   decision=result.allowed?'TIME_ROOM_ENTRY_APPROVED':'TIME_ROOM_ENTRY_DENIED';
  }else if(organ==='TIME_ROOM_ADAPTIVE'){
   if(intent==='PLAN'){requireTimeRoomEntry(signal.payload||{});result=planTimeRoomSession(signal.payload||{});decision='TIME_ROOM_SESSION_PLANNED';}
   else if(intent==='ASSISTANCE'){result=chooseAssistance(signal.payload||{});decision='TIME_ROOM_ASSISTANCE_SELECTED';}
   else throw Error('UNSUPPORTED_TIME_ROOM_INTENT');
  }else if(organ==='DEVELOPMENT_TRAINING'){
   if(intent==='LIST'){result=listDevelopmentExercises(signal.payload||{});decision='DEVELOPMENT_EXERCISES_LISTED';}
   else if(intent==='SESSION'){result=createDevelopmentSession(signal.payload||{});decision='DEVELOPMENT_SESSION_PREPARED';}
   else throw Error('UNSUPPORTED_DEVELOPMENT_INTENT');
  }else if(organ==='DEFENSIVE_TRAINING'){
   if(intent==='LIST'){result=listDefensiveTraining(signal.payload||{});decision='DEFENSIVE_CURRICULUM_LISTED';}
   else if(intent==='SESSION'){result=buildDefensiveSession(signal.payload||{});decision='DEFENSIVE_SESSION_PREPARED';}
   else throw Error('UNSUPPORTED_DEFENSIVE_TRAINING_INTENT');
  }else if(organ==='TIME_CHAMBER'){
   if(intent==='ENTER'){result=enterTimeChamber({...signal.payload,workspaceId});decision='TIME_CHAMBER_ENTERED';}
   else if(intent==='TRAIN'){result=trainInTimeChamber(signal.payload?.session,signal.payload?.options);decision='TIME_CHAMBER_TRAINED';}
   else if(intent==='EXIT'){result=exitTimeChamber(signal.payload?.session);decision='TIME_CHAMBER_EXITED';}
   else throw Error('UNSUPPORTED_TIME_CHAMBER_INTENT');
  }else if(organ==='VIVARIUM'){
   if(intent==='CREATE'){result=createVivarium({workspaceId,seed:signal.payload?.seed??1});decision='VIVARIUM_SIMULATION_CREATED';}
   else if(intent==='SIMULATE'){result=simulateVivariumStep(signal.payload?.state,signal.payload?.experiment);decision=result.outcome.status;}
   else if(intent==='ASSESS'){result=assessVivarium(signal.payload?.state);decision='VIVARIUM_ASSESSED';}
   else throw Error('UNSUPPORTED_VIVARIUM_INTENT');
  }else if(organ==='BIOLOGY'){
   if(intent==='READ_GENOME'){result=CHIMERA_GENOME;decision='GENOME_READ';}
   else if(intent==='SELECT_HUNT'){result=selectChimeraStrategy(signal.payload||{});decision=result.strategy;}
   else if(intent==='PLAN_SILK'){result=planSilk(signal.payload||{});decision=result.build?'WEB_PLAN':'FREE_HUNT_OR_RETREAT';}
   else if(intent==='READ_SILK'){result=SILK_ARCHITECTURES;decision='SILK_ARCHITECTURES_READ';}
   else throw Error('UNSUPPORTED_BIOLOGY_INTENT');
  }else if(organ==='SOCIAL'){
   if(intent==='READ_DNA'){result=SOCIAL_CONNECTOR_DNA;decision='SOCIAL_DNA_READ';}
   else if(intent==='DESIGN_CONNECTOR'){result=designSocialConnector({...signal.payload,workspaceId});decision='SOCIAL_CONNECTOR_DESIGNED';}
   else if(intent==='PLAN_CAMPAIGN'){result=planSocialCampaign({...signal.payload,workspaceId});decision='SOCIAL_CAMPAIGN_DRAFTED';}
   else if(intent==='SUMMARIZE_TRAFFIC'){result=summarizeSocialTraffic(signal.payload?.events||[]);decision='SOCIAL_TRAFFIC_SUMMARIZED';}
   else if(intent==='BUILD_POSTER_PAGE'){result=buildPosterLanding({...signal.payload,workspaceId});decision='POSTER_PAGE_DRAFTED';}
   else if(intent==='BUILD_POSTER_BATCH'){result=buildPosterFunnelBatch({...signal.payload,workspaceId});decision='POSTER_BATCH_DRAFTED';}
   else throw Error('UNSUPPORTED_SOCIAL_INTENT');
  }else if(organ==='MARKETPLACE'){
   if(intent==='READ_DNA'){result=MARKETPLACE_DNA;decision='MARKETPLACE_DNA_READ';}
   else if(intent==='OBSERVE_EVENT'){result=observeMarketplaceEvent({...signal.payload,workspaceId});decision='MARKETPLACE_EVENT_VALIDATED';}
   else if(intent==='SUMMARIZE'){result=summarizeMarketplaceEvents(signal.payload?.events);decision='MARKETPLACE_EVENTS_SUMMARIZED';}
   else throw Error('UNSUPPORTED_MARKETPLACE_INTENT');
  }else if(organ==='TUNNELS'){
   if(intent==='READ_FACTORY'){result=TUNNEL_FACTORY_DNA;decision='FACTORY_DNA_READ';}
   else if(intent==='PLAN_MISSION'){result=assignTunnelMission({...signal.payload,workspaceId});decision='TUNNEL_DRAFT_READY';}
   else if(intent==='BUILD_SITE'){result=generateTunnelSite({...signal.payload,workspaceId});decision='SITE_FILES_GENERATED';}
   else if(intent==='SUGGEST_DOMAINS'){result=suggestDomains(signal.payload?.brand);decision='DOMAIN_IDEAS_UNCHECKED';}
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
