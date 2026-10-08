/** Attila Time Chamber — bounded accelerated training inside the Vivarium.
 * Simulated time != real elapsed time. No model weight updates, private data,
 * network actions or automatic promotion of unverified strategies.
 */
import {createVivarium,simulateVivariumStep,assessVivarium} from './attila-vivarium.js';
const ID=/^[A-Za-z0-9_-]{1,64}$/;
const clamp=n=>Math.max(0,Math.min(100,n));
export const TIME_CHAMBER_POLICY=Object.freeze({
 room:'SALLE_DU_TEMPS',version:1,mode:'DETERMINISTIC_SIMULATION',
 maxSteps:10000,maxWallClockMs:30000,realWorldActions:false,
 modelRetraining:false,requiresReviewBeforePromotion:true
});
export function enterTimeChamber({workspaceId,seed=1,sessionId,maxSteps=1000}={}){
 if(!ID.test(workspaceId)||!ID.test(sessionId)||!Number.isInteger(maxSteps)||maxSteps<1||maxSteps>TIME_CHAMBER_POLICY.maxSteps)throw Error('INVALID_TIME_CHAMBER_SESSION');
 return {sessionId,workspaceId,seed,maxSteps,stepsCompleted:0,simulatedMinutes:0,
  state:createVivarium({workspaceId,seed}),outcomes:[],status:'READY',policy:TIME_CHAMBER_POLICY};
}
export function trainInTimeChamber(session,{steps=100,minutesPerStep=60}={}){
 if(!session||session.status!=='READY'&&session.status!=='TRAINING'||!ID.test(session.sessionId)||
 !Number.isInteger(steps)||steps<1||!Number.isInteger(minutesPerStep)||minutesPerStep<1||minutesPerStep>1440)throw Error('INVALID_TRAINING_REQUEST');
 const budget=Math.min(steps,session.maxSteps-session.stepsCompleted);
 if(budget<=0)return {...session,status:'COMPLETED'};
 let state=session.state,performed=0,blocked=0,verified=0;
 const start=Date.now();
 for(let i=0;i<budget;i++){
  if(Date.now()-start>=TIME_CHAMBER_POLICY.maxWallClockMs)break;
  const assessment=assessVivarium(state);
  const strategy=assessment.recommendation;
  const experimentId=session.sessionId+'_'+(session.stepsCompleted+i);
  const result=simulateVivariumStep(state,{experimentId,strategy,signal:0});
  if(result.outcome.status!=='SIMULATED'){blocked++;break;}
  state=result.state;performed++;
  if(strategy==='VERIFY')verified++;
 }
 const stepsCompleted=session.stepsCompleted+performed;
 return {...session,state,stepsCompleted,simulatedMinutes:session.simulatedMinutes+performed*minutesPerStep,
  outcomes:[...session.outcomes.slice(-49),{performed,blocked,verified,energy:clamp(state.energy),stability:clamp(state.stability)}],
  status:stepsCompleted>=session.maxSteps?'COMPLETED':'TRAINING'};
}
export function exitTimeChamber(session){
 if(!session||!ID.test(session.sessionId)||!session.state)throw Error('INVALID_TIME_CHAMBER_SESSION');
 return {sessionId:session.sessionId,workspaceId:session.workspaceId,
  stepsCompleted:session.stepsCompleted,simulatedMinutes:session.simulatedMinutes,
  energy:session.state.energy,stability:session.state.stability,
  report:{simulatedExperiments:session.stepsCompleted,verifiedRealWorldImprovements:0,
   modelWeightsChanged:false,requiresHumanReview:true},
  promotionStatus:'NOT_APPROVED',realWorldAction:false};
}
