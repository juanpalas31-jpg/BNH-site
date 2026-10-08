/** Attila Vivarium v1 — isolated, deterministic experimentation chamber.
 * No private memories, external calls, live actions, autonomous deployment or
 * self-modifying source code. Results are proposals, not learned facts.
 */
const ID=/^[A-Za-z0-9_-]{1,64}$/;
const STRATEGIES=new Set(['EXPLORE','VERIFY','REST','REPAIR']);
const bounded=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
export const VIVARIUM_POLICY=Object.freeze({
 name:'ATTILA_VIVARIUM',version:1,engine:'SPIDER_ENGINE',
 mode:'SANDBOX_SIMULATION_ONLY',liveExecution:false,selfModification:false,
 privateMemoryAccess:false,networkAccess:false,financialOrders:false,
 releaseRequiresHumanApproval:true
});
export function createVivarium({workspaceId,seed=1}={}){
 if(typeof workspaceId!=='string'||!ID.test(workspaceId)||!Number.isSafeInteger(seed)||seed<1)throw Error('INVALID_VIVARIUM_CONFIG');
 return {workspaceId,seed,generation:0,energy:100,stability:100,history:[],policy:VIVARIUM_POLICY};
}
export function simulateVivariumStep(state,{experimentId,strategy,signal=0}={}){
 if(!state||!ID.test(state.workspaceId)||!ID.test(experimentId)||!STRATEGIES.has(strategy)||!bounded(signal,-10,10))throw Error('INVALID_EXPERIMENT');
 if(!Number.isInteger(state.generation)||state.generation<0||!bounded(state.energy,0,100)||!bounded(state.stability,0,100)||!Array.isArray(state.history))throw Error('INVALID_VIVARIUM_STATE');
 if(state.history.some(x=>x.experimentId===experimentId))return {state,outcome:{experimentId,status:'DUPLICATE_SKIPPED'}};
 const effects={EXPLORE:{energy:-12,stability:-4},VERIFY:{energy:-6,stability:8},REST:{energy:20,stability:3},REPAIR:{energy:-8,stability:12}};
 const effect=effects[strategy];
 if(state.energy+effect.energy<0)return {state,outcome:{experimentId,status:'INSUFFICIENT_ENERGY'}};
 const clamp=n=>Math.max(0,Math.min(100,n));
 const next={...state,generation:state.generation+1,energy:clamp(state.energy+effect.energy),
  stability:clamp(state.stability+effect.stability+signal),history:[...state.history.slice(-199),
  {experimentId,strategy,signal,status:'SIMULATED'}]};
 return {state:next,outcome:{experimentId,status:'SIMULATED',generation:next.generation,
  energy:next.energy,stability:next.stability,realWorldAction:false}};
}
export function assessVivarium(state){
 if(!state||!bounded(state.energy,0,100)||!bounded(state.stability,0,100))throw Error('INVALID_VIVARIUM_STATE');
 const recommendation=state.energy<25?'REST':state.stability<40?'REPAIR':state.generation%3===0?'VERIFY':'EXPLORE';
 return {recommendation,reason:state.energy<25?'LOW_ENERGY':state.stability<40?'LOW_STABILITY':'SIMULATION_SCHEDULE',
  autonomousActionExecuted:false,requiresExternalScheduler:true};
}
