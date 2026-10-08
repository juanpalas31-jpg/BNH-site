/** Private Attila ecosystem: biological metaphor mapped to market data; simulation only. */
import {senseMarket,weavePaperWeb} from './attila-financial-universe.js';
export const ECOSYSTEM_DNA=Object.freeze({
 version:1,domain:'FINANCIAL_NATURE',access:'PRIVATE_FAMILY',families:['Palace','Baye','Zamora','Santander'],
 execution:'PAPER_ONLY',liveOrders:false,autoPublish:false,
 inheritance:['market_senses','risk_retreat','paper_webs','mission_reporting','audit_trail'],
 species:{ATTILA:{role:'MOTHER_ORCHESTRATOR'},NEO_ATTILA:{role:'CRUMB_SCOUT',inherits:'ATTILA'},
 FOURMI_TILA:{role:'PERMANENT_MARKET_OBSERVER',enabled:false,independentOrganism:true}},
 safety:{noBrokerKeys:true,noRealMoney:true,lossesAreRealWhenLive:true,noGuaranteedIncome:true}
});
export function hatchNeoAttila({id,parent='ATTILA',generation=1}={}){
 if(typeof id!=='string'||!/^[a-zA-Z0-9_-]{1,40}$/.test(id))throw Error('Valid hatchling ID required');
 if(!Number.isInteger(generation)||generation<1||generation>100)throw Error('Invalid generation');
 return {id,species:'NEO_ATTILA',parent,generation,dnaVersion:ECOSYSTEM_DNA.version,
 inheritedFaculties:[...ECOSYSTEM_DNA.inheritance],state:'OBSERVING',capitalMode:'PAPER_ONLY',liveOrders:false};
}
export function classifyHabitat(bars,{symbol='UNKNOWN'}={}){
 const sensed=senseMarket(bars,{market:symbol});
 const web=weavePaperWeb(sensed);
 const threat=sensed.environment==='EXTREME'||sensed.environment==='DANGEROUS';
 const empty=sensed.environment==='UNKNOWN'||sensed.environment==='CAUTION';
 return {habitat:symbol,organismLanguage:{terrain:sensed.environment,predator:threat,
 food:threat?'TOO_DANGEROUS':empty?'NO_SAFE_FOOD_IDENTIFIED':'RESEARCH_CRUMBS',
 web:threat||empty?'RETRACT':'WEAVE_PAPER_ONLY'},
 decision:threat?'FLEE':empty?'WAIT':'OBSERVE_AND_BACKTEST',
 marketTranslation:sensed,web,liveOrders:false};
}
export function motherBrief({habitats=[],scouts=[]}={}){
 if(!Array.isArray(habitats)||!Array.isArray(scouts))throw Error('Invalid colony reports');
 return {mother:'ATTILA',timestamp:null,observedHabitats:habitats.length,
 safeResearchHabitats:habitats.filter(x=>x.decision==='OBSERVE_AND_BACKTEST').length,
 threats:habitats.filter(x=>x.decision==='FLEE').length,
 scoutCount:scouts.length,ordersPlaced:0,execution:'PAPER_ONLY',
 warning:'Metaphors do not alter actual financial risk.'};
}
export function fourmiTilaBlueprint(){
 return {species:'FOURMI_TILA',enabled:false,habitat:'FINANCIAL_NATURE',
 colonyRole:'PERMANENT_OBSERVER',reportsTo:'NEO_ATTILA',then:'ATTILA',
 proposedTasks:['MARKET_DATA_HEALTH','VOLATILITY_WATCH','LIQUIDITY_WATCH','EVENT_MONITOR','RISK_ALERT'],
 restrictions:['NO_REAL_ORDERS','NO_UNAPPROVED_DATA_ACCESS','NO_UNSUPERVISED_DEPLOYMENT']};
}
