const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export function createLabMemory(){
 return {strategies:{},observations:0,successes:0,failures:0};
}
export function recordOutcome(memory,decision,outcome){
 const m=structuredClone(memory||createLabMemory());
 const key=decision?.action||"UNKNOWN";
 const s=m.strategies[key]||{attempts:0,wins:0,losses:0,value:.5};
 s.attempts++;
 if(outcome?.success){s.wins++;m.successes++;}else{s.losses++;m.failures++;}
 s.value=clamp((s.wins+1)/(s.attempts+2));
 m.strategies[key]=s;m.observations++;
 return m;
}
export function learnedAdjustment(memory,decision){
 const s=memory?.strategies?.[decision?.action];
 if(!s||s.attempts<3)return 0;
 const confidence=Math.min(1,s.attempts/20);
 return Math.max(-.16,Math.min(.16,(s.value-.5)*.32*confidence));
}
export function memorySnapshot(memory){
 return {observations:memory.observations,successes:memory.successes,failures:memory.failures,
  strategies:Object.fromEntries(Object.entries(memory.strategies).map(([k,v])=>[k,{...v}]))};
}
