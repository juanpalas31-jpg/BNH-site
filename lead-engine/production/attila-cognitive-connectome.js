/** Spider Engine cognitive connectome: spider-inspired functional pathways, not literal neuroanatomy. */
import {createBrain,think} from './attila-brain.js';
export const COGNITIVE_DNA=Object.freeze({
 version:1,kind:'SPIDER_INSPIRED_FUNCTIONAL_CONNECTOME',
 circuits:{
  EYES:{receives:['MARKET_CANDLES','PROPERTY_LISTING','CONTENT_WEB'],projectsTo:['PERCEPTION','MEMORY']},
  VIBRATION:{receives:['RISK_SIGNAL','ANOMALY'],projectsTo:['SURVIVAL','MEMORY']},
  CHEMORECEPTION:{receives:['SOURCE_PROVENANCE','CONTENT_QUALITY'],projectsTo:['PERCEPTION','MEMORY']},
  SPATIAL_MEMORY:{receives:['HABITAT_RESEARCH','WORKSPACE_CONTEXT'],projectsTo:['MEMORY','FAMILY']},
  CENTRAL_INTEGRATION:{receives:['PERCEPTION','MEMORY','SURVIVAL','FAMILY'],projectsTo:['DECISION']},
  WEB_PLANNING:{receives:['DECISION'],projectsTo:['CONTENT','FINANCE','HABITAT']},
  MOTOR_CONTROL:{receives:['DECISION','SURVIVAL'],projectsTo:['EXECUTION']},
  FEEDBACK:{receives:['EXECUTION_RESULT'],projectsTo:['LEARNING','MEMORY']}
 },
 priorities:['WORKSPACE_ISOLATION','SURVIVAL','PROVENANCE','HUMAN_APPROVAL','RESEARCH'],
 noRealMoneyOrders:true,noAutonomousPropertyOffers:true,noAutoPublication:true
});
const mappings=Object.freeze({
 MARKET_CANDLES:{organ:'FINANCE',intent:'SENSE_MARKET',sense:'EYES'},
 PROPERTY_LISTING:{organ:'HABITAT',intent:'SCOUT',sense:'SPATIAL_MEMORY'},
 PROPERTY_EVALUATION:{organ:'HABITAT',intent:'EVALUATE',sense:'SPATIAL_MEMORY'},
 NEST_REQUIREMENTS:{organ:'HABITAT',intent:'NEST',sense:'SPATIAL_MEMORY'},
 CONTENT_WEB:{organ:'CONTENT',intent:'VALIDATE_WEB',sense:'CHEMORECEPTION'},
 FAMILY_RULES:{organ:'FAMILY',intent:'READ_POLICY',sense:'CENTRAL_INTEGRATION'},
 HATCHLING:{organ:'FINANCE',intent:'HATCH',sense:'CENTRAL_INTEGRATION'},
 FOURMI_TILA:{organ:'FINANCE',intent:'FOURMI_BLUEPRINT',sense:'VIBRATION'}
});
/** Process a sensory stimulus through existing central brain, with auditable neural path. */
export function perceiveAndThink(brain,stimulus){
 if(!brain?.compartments||!stimulus||typeof stimulus!=='object')throw Error('Brain and stimulus required');
 const mapping=mappings[stimulus.type];
 if(!mapping)return {accepted:false,decision:'REJECT',reason:'UNKNOWN_STIMULUS',brain};
 const route=['SENSORY_INPUT',mapping.sense,'PERCEPTION','MEMORY','SURVIVAL','CENTRAL_INTEGRATION','DECISION'];
 const response=think(brain,{ownerId:stimulus.ownerId,workspaceId:stimulus.workspaceId,organ:mapping.organ,intent:mapping.intent,payload:stimulus.payload});
 if(!response.accepted)return {...response,neuralPath:route};
 const next=response.brain;
 next.compartments.perception.lastSignals=[{sense:mapping.sense,stimulus:stimulus.type,decision:response.decision}];
 const isRetreat=['FLEE','WAIT','REJECT','RETRACT'].includes(response.decision);
 const neuralPath=[...route,isRetreat?'SURVIVAL_RETREAT':'RESEARCH_ONLY','FEEDBACK','LEARNING'];
 next.compartments.learning.lessons=[...next.compartments.learning.lessons.slice(-99),{stimulus:stimulus.type,decision:response.decision,kind:'OBSERVATION_NOT_TRAINED_MODEL'}];
 return {...response,brain:next,neuralPath,executedExternalAction:false};
}
/** Controlled DNA inheritance: technical circuits, never accounts, capital or private memories. */
export function inheritCognitiveDNA(hatchling){
 if(hatchling?.species!=='NEO_ATTILA')throw Error('Neo-Attila only');
 return {agentId:hatchling.id,connectomeVersion:COGNITIVE_DNA.version,circuits:Object.keys(COGNITIVE_DNA.circuits),privateMemoriesInherited:false,financialAssetsInherited:false,liveOrders:false};
}
export function newCognitiveBrain(identity){return createBrain(identity);}
