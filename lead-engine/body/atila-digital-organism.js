import {arachnidLoop} from "../core/atila-arachnid-ai.js";
import {heartbeat,circulate,respiration} from "./atila-cardiopulmonary.js";
import {digest,excrete} from "./atila-digestion-excretion.js";
import {coordinateLegs,hydraulicDrive} from "./atila-locomotion.js";
import {spinSilk,sensorySetae} from "./atila-silk-sensory-capture.js";
import {exoskeleton,development,homeostasis} from "./atila-integrity-development.js";
import {autonomicGovernor} from "./atila-autonomic-governor.js";

const C=v=>Math.max(0,Math.min(1,Number(v)||0));

export function createBodyState(seed={}){
 return {energy:C(seed.energy??.82),integrity:C(seed.integrity??1),load:C(seed.load||0),
  compute_capacity:C(seed.compute_capacity??1),waste:C(seed.waste||0),
  experience:Number(seed.experience)||0,generation:Number(seed.generation)||0,cycle:0};
}

export function runBodyCycle({body=createBodyState(),signals=[],inputs=[],context={},history={}}={}){
 // Pre-action governor: survival limits are decided before expensive cognition/movement.
 const preHomeostasis=homeostasis(body);
 const preGovernor=autonomicGovernor({body,homeostasis:preHomeostasis,decision:{}});
 if(preGovernor.mode==="SURVIVAL"){
  const next={...body,cycle:body.cycle+1,load:C(body.load-.08),waste:C(body.waste-.04),energy:C(body.energy+.015)};
  return {identity:"ATILA_DIGITAL_ORGANISM",cycle:next.cycle,pre_autonomic:preGovernor,pre_autonomic:preGovernor,
   effective_action:"REST_REPAIR",homeostasis:homeostasis(next),next_body:next,
   skipped:["FULL_COGNITION","LOCOMOTION","REPLICATION","EXPLORATION"]};
 }
 const setae=sensorySetae(signals);
 const primary=setae.strongest||{strength:0,novelty:0};
 const cognition=arachnidLoop({state:{energy:body.energy},
  signal:{intensity:primary.strength,novelty:primary.novelty,repeat_rate:context.repeat_rate||0,
   integrity_risk:1-body.integrity},
  context,history,events:context.events||[],risk:context.risk||0,owner_verified:context.owner_verified===true});

 const lungs=respiration({computeDemand:.25+(cognition.cognition.attention.wake_core?.45:.12),
  thermalLoad:body.load,energy:body.energy});
 const heart=heartbeat({energy:body.energy,load:body.load,queue:signals.length});
 const blood=circulate({heart,signals:signals.map(s=>({...s,priority:s.strength||0})),
  resources:{energy:body.energy,compute:lungs.capacity,memory:1-body.waste}});
 const food=digest({inputs,energy:body.energy});
 const hydraulics=hydraulicDrive({energy:food.energy_after,load:body.load});
 const legs=coordinateLegs({terrain:{uncertainty:context.uncertainty||0},risk:context.risk||0,
  energy:food.energy_after});
 const silk=spinSilk(cognition.decision.action==="QUARANTINE_ASSESS"?"SAFETY":
  cognition.decision.action==="SPAWN_BOUNDED_SWARM"?"COORDINATION":"SENSOR",
  {cycle:body.cycle+1,decision:cognition.decision.action});
 const cleanup=excrete({temporary:context.temporary||[],expired:context.expired||[],
  duplicates:context.duplicates||[]});
 const shell=exoskeleton({integrity:body.integrity,breach:context.breach===true});

 const actionCost=C(.025+.06*(1-lungs.capacity)+.05*(1-hydraulics.pressure)+
  (cognition.cognition.attention.wake_core?.05:.01));
 const next={...body,cycle:body.cycle+1,energy:C(food.energy_after-actionCost),
  integrity:shell.health,load:C(body.load+.08*actionCost-.04*lungs.capacity),
  compute_capacity:lungs.capacity,waste:C(body.waste+.015*food.waste-.04*cleanup.reclaim_estimate),
  experience:body.experience+1};
 const balance=homeostasis(next);
 const growth=development(next);

 return {identity:"ATILA_DIGITAL_ORGANISM",cycle:next.cycle,
  sensory:setae,brain:cognition,heart,circulation:blood,respiration:lungs,digestion:food,
  hydraulics,locomotion:legs,spinnerets:silk,excretion:cleanup,exoskeleton:shell,
  homeostasis:balance,development:growth,next_body:next};
}
