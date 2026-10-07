import { runBodyCycle,createBodyState } from "../body/atila-digital-organism.js";
import { applyAutonomicGovernor } from "../body/atila-autonomic-governor.js";
import { engineHealth } from "../health/engine-health.js";
import { runAttilaHuntCycle } from "./atila-hunt-cycle.js";
import { arachnidDoctrineSnapshot } from "./atila-ambush-doctrine.js";
import { homeostasisDecision } from "../health/homeostasis.js";
import { metabolicBudget } from "../health/metabolic-budget.js";
import { aggregateVibrations,webState } from "../senses/web-vibration-aggregator.js";
import { assessThreat,immuneResponse as coreImmuneResponse } from "../defense/atila-immune-system.js";
import { consolidateMemory } from "../memory/consolidation.js";
import { defaultPolicy } from "../policy/action-policy.js";

/**
 * Production integration boundary.
 * Existing organs are composed here instead of being left as disconnected modules.
 * No external contact, spend, publication, replication or destructive action occurs here.
 */
export async function runIntegratedAttilaCycle({storage=null,pages=[],events=[],leads=[],previous={},body,context={}}={}){
 const health=await engineHealth({storage,checks:{defense:true,senses:true,learning:true,regeneration:true,reproduction:true}});
 const signals=events.slice(-50).map(e=>({
  strength:e.event==="form_start"?.8:e.event==="lead_captured"?1:.25,
  novelty:e.event==="page_view"?.25:.5,
  type:e.event||"signal"
 }));
 const organism=applyAutonomicGovernor(runBodyCycle({
  body:body||createBodyState(),
  signals,
  inputs:leads.slice(-20).map(l=>({quality:Number(l.score||0)/100})),
  context:{...context,events,risk:health.status==="healthy"?0:.45,owner_verified:false},
  history:previous
 }));
 const vibration=aggregateVibrations(events.map(e=>({type:e.event||e.type})));
 const web_state=webState({
  impression:events.filter(e=>e.event==="page_view").length,
  organic_click:events.filter(e=>e.event==="organic_click").length,
  content_engaged:events.filter(e=>e.event==="content_engaged").length,
  form_submit:events.filter(e=>e.event==="form_start"||e.event==="lead_captured").length,
  sale:0
 });
 const homeostasis=homeostasisDecision({
  availability_pct:health.status==="healthy"?100:70,integrity_pct:100,
  restore_readiness_pct:storage?90:45,ingestion_health_pct:100,
  security_health_pct:100,queue_depth:events.length
 });
 const metabolism=metabolicBudget({
  vitality_score:homeostasis.vitality.score,
  opportunity_score:Math.min(1,(leads.length+events.filter(e=>e.event==="form_start").length)/10),
  evidence_confidence:Math.min(1,events.length/50),resource_pressure:organism.next_body?.load||0
 });
 const threat=assessThreat({
  type:"RUNTIME_HEALTH",surface:"ATTILA",anomaly_score:health.status==="healthy"?0:.35,
  integrity_loss:organism.next_body?1-organism.next_body.integrity:0
 },[]);
 const immunity=coreImmuneResponse(threat);
 const learning=consolidateMemory([{
  memory_id:"current_hunt",lesson:"Measured hunt outcome requires evidence before reinforcement",
  evidence:events.length,confidence:Math.min(1,events.length/100),structural_lesson:true,
  contains_customer_data:false,policy_ok:true
 }]);
 const policy=defaultPolicy();
 const hunt=runAttilaHuntCycle({pages,events,leads,previous});
 const blocked=organism.autonomic?.mode==="SURVIVAL"||homeostasis.response==="survival_mode"||immunity.mode==="QUARANTINE";
 return {
  identity:"ATTILA_INTEGRATED_RUNTIME",
  health,
  organism,
  senses:{vibration,web_state},
  homeostasis,
  metabolism,
  immunity,
  learning,
  policy,
  hunt:blocked?{...hunt,state:"BODY_SURVIVAL_OVERRIDE",execute:false,commercial_reveal:false}:hunt,
  doctrine:arachnidDoctrineSnapshot(),
  guardrails:{autonomous_contact:false,autonomous_publish:false,autonomous_spend:false,
   autonomous_replication:false,destructive_action:false,raw_pii_memory:false}
 };
}
