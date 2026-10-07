import { runAttilaHuntCycle,evaluateHuntOutcome } from "./atila-hunt-cycle.js";

const now=()=>new Date().toISOString();
const actionableStates=new Set(["SIGNAL_DETECTED","PREPARE_POUNCE","POUNCE_PROPOSAL"]);

export function createAttilaHeartbeat({readSignals,saveState,proposeAction,intervalMs=15*60*1000}={}){
 if(typeof readSignals!=="function") throw new Error("ATTILA_READ_SIGNALS_REQUIRED");
 let timer=null,running=false,last=null;
 async function beat(){
  if(running) return {state:"BEAT_SKIPPED",reason:"previous_cycle_running",last};
  running=true;
  try{
   const input=await readSignals();
   const cycle=runAttilaHuntCycle(input||{});
   const snapshot={
    at:now(),identity:"ATTILA_ARACHNID_AI",posture:cycle.state,
    hidden:cycle.commercial_reveal!==true,cycle
   };
   if(typeof saveState==="function") await saveState(snapshot);

   // IMMOBILE and AMBUSH deliberately produce no hunt proposal.
   // Attila only prepares movement after measured signal exists.
   if(actionableStates.has(cycle.state)&&typeof proposeAction==="function"){
    await proposeAction({
     ...(cycle.plan||{}),
     arachnid_state:cycle.state,
     commercial_reveal:cycle.commercial_reveal===true,
     gate:cycle.gate||"OWNER_OR_VALIDATED_PUBLISHER"
    });
   }
   last=snapshot;
   return snapshot;
  }finally{running=false}
 }
 function start(){
  if(timer)return;
  void beat();
  timer=setInterval(()=>void beat(),Math.max(60000,intervalMs));
  timer.unref?.();
 }
 function stop(){if(timer){clearInterval(timer);timer=null}}
 return {identity:"ATTILA_HEARTBEAT",start,stop,beat,status:()=>({running,scheduled:Boolean(timer),last})};
}

export function closeLearningLoop(before,after){
 return evaluateHuntOutcome({before,after});
}

// Serverless environments should call beat() from an external scheduler.
// This module deliberately does not create uncontrolled background work on import.
