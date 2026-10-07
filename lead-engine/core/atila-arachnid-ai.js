import {atilaInnerState} from "../microorganisms/atila-affective-core.js";
import {selectPhenotype} from "../microorganisms/atila-phenotype-genome.js";
import {fighterDecision} from "../microorganisms/atila-fighter-temperament.js";
import {routeVibration} from "../senses/atila-web-nervous-system.js";
import {forecastThreat} from "../senses/atila-threat-forecast.js";
import {antiStubbornness} from "../policy/atila-anti-stubbornness.js";
import {DIGITAL_FOREST,HOST_BOND,perceiveDigitalForest} from "./atila-digital-ecology.js";
import {protocolOne} from "../defense/atila-defense-protocols.js";

export function arachnidCognition(input={}){
 const internal=atilaInnerState(input.state||{});
 const vibration=routeVibration(input.signal||{});
 const forecast=forecastThreat(input.events||[]);
 const phenotype=selectPhenotype(input.context||{},internal.state,input.history||{});
 const temperament=fighterDecision({
  pressure:vibration.score,risk:input.risk||0,
  failures:input.history?.consecutive_failures||0,
  uncertainty:input.context?.uncertainty||0,
  owner_verified:input.owner_verified
 });
 const correction=antiStubbornness({
  failures:input.history?.consecutive_failures||0,
  surprise:input.surprise||"LOW",
  same_strategy_runs:input.history?.same_strategy_runs||0
 });
 const forest=perceiveDigitalForest({
  kind:input.context?.environment_kind||input.signal?.type||"event",
  strength:vibration.score
 });
 const defense=protocolOne({
  type:input.context?.aggression_type||"UNKNOWN",severity:input.risk||0,
  confidence:1-(input.context?.uncertainty||0),scope:input.context?.scope||0
 });
 const attention={
  wake_core:vibration.wake_atila||forecast.actionable||correction.force_reconsideration,
  local_processing:!vibration.wake_atila,
  dominant_need:internal.mode
 };
 return {identity:"ATILA_ARACHNID_AI",architecture:"EMBODIED_WEB_COGNITION",
  internal,vibration,forecast,phenotype,temperament,correction,attention,forest,defense,world_model:DIGITAL_FOREST,host_bond:HOST_BOND,
  consciousness_claim:false};
}

export function decideArachnidAction(cognition={}){
 if(cognition.vibration?.band==="ALARM")
  return {controller:"IMMUNE_SYSTEM",action:"QUARANTINE_ASSESS"};
 if(cognition.correction?.force_reconsideration)
  return {controller:"CORE",action:"REOPEN_HYPOTHESES"};
 if(cognition.vibration?.route==="NEO_SWARM")
  return {controller:"NEO_ATILA",action:"SPAWN_BOUNDED_SWARM"};
 if(cognition.vibration?.route==="NEO_LOCAL")
  return {controller:"NEO_ATILA",action:"LOCAL_REFLEX"};
 if(cognition.forecast?.actionable)
  return {controller:"CORE",action:"PREPARE_CONTAINMENT"};
 return {controller:"ARACHNID_AUTONOMIC",action:cognition.internal?.mode||"WEB_LISTEN"};
}

export function arachnidLoop(input={}){
 const cognition=arachnidCognition(input);
 return {cognition,decision:decideArachnidAction(cognition),
  doctrine:["PERCEIVE","ATTEMPT","MEASURE","UNDERSTAND","CORRECT","MEMORIZE","TRANSMIT","EVOLVE"]};
}
