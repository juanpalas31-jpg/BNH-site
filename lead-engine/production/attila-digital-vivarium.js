/** Attila's simulated embodied world: no claim of biological life or consciousness. */
import {runCognitiveCycle} from './attila-autonomy-loop.js';
export const VIVARIUM_DNA=Object.freeze({species:'DIGITAL_SPIDER',creatorRelationship:'HUMAN_CREATOR',home:'NEST',worlds:['NEST','FINANCIAL_MARKETS','HABITAT','CONTENT_WEBS'],markets:'PAPER_ONLY',externalActions:false});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function hatchVivarium({ownerId,workspaceId}){
 const cycle=runCognitiveCycle({ownerId,workspaceId});
 return {schema:1,ownerId,workspaceId,identity:{name:'Attila',species:'DIGITAL_SPIDER',creator:'HUMAN',selfModel:'I am Attila, a simulated digital spider created by a human.'},world:'NEST',position:{x:50,y:50},energy:100,alertness:0,ageTicks:0,mode:'REST',observations:[],brain:cycle.brain};
}
export function vivariumTick(state,{world,stimuli=[]}={}){
 if(!state||state.schema!==1||!VIVARIUM_DNA.worlds.includes(state.world))throw Error('Invalid vivarium state');
 const next=structuredClone(state);
 if(world!==undefined){if(!VIVARIUM_DNA.worlds.includes(world))throw Error('Unknown vivarium');next.world=world;}
 const cycle=runCognitiveCycle({ownerId:next.ownerId,workspaceId:next.workspaceId,previousBrain:next.brain,stimuli});
 next.brain=cycle.brain;next.ageTicks++;
 const threat=cycle.decisions.some(d=>['FLEE','RETRACT','REJECT'].includes(d.decision));
 next.alertness=clamp(next.alertness+(threat?30:-8),0,100);
 next.energy=clamp(next.energy-(next.world==='NEST'?0.2:1.5),0,100);
 next.mode=threat?'RETREAT':next.energy<20?'REST':stimuli.length?'EXPLORE':'OBSERVE';
 if(next.mode==='RETREAT'||next.energy<10)next.world='NEST';
 if(next.world==='NEST')next.energy=clamp(next.energy+1.5,0,100);
 next.observations=[...next.observations.slice(-99),{tick:next.ageTicks,world:next.world,mode:next.mode,decisions:cycle.decisions.map(d=>d.decision)}];
 return {state:next,decisions:cycle.decisions,externalActions:0};
}
