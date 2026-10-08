import {newCognitiveBrain,perceiveAndThink} from './attila-cognitive-connectome.js';
export const AUTONOMY_POLICY=Object.freeze({mode:'RESEARCH_ONLY',maxStimuli:20,liveOrders:false,externalActions:false});
export function runCognitiveCycle({ownerId,workspaceId,stimuli=[],previousBrain=null}){
 if(!/^[a-zA-Z0-9_-]{1,64}$/.test(ownerId||'')||!/^[a-zA-Z0-9_-]{1,64}$/.test(workspaceId||''))throw Error('Invalid workspace identity');
 if(!Array.isArray(stimuli)||stimuli.length>20)throw Error('Invalid stimuli');
 let brain=previousBrain?structuredClone(previousBrain):newCognitiveBrain({ownerId,workspaceId});
 if(brain.ownerId!==ownerId||brain.workspaceId!==workspaceId)throw Error('Workspace mismatch');
 const decisions=[];
 for(const stimulus of stimuli){
  const response=perceiveAndThink(brain,{...stimulus,ownerId,workspaceId});
  if(response.accepted)brain=response.brain;
  decisions.push({accepted:response.accepted,decision:response.decision,reason:response.reason||null,neuralPath:response.neuralPath||[]});
 }
 return {brain,decisions,mode:'RESEARCH_ONLY',externalActions:0};
}
