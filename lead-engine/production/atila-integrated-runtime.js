import { runBodyCycle,createBodyState } from "../body/atila-digital-organism.js";
import { applyAutonomicGovernor } from "../body/atila-autonomic-governor.js";
import { engineHealth } from "../health/engine-health.js";
import { runAttilaHuntCycle } from "./atila-hunt-cycle.js";
import { arachnidDoctrineSnapshot } from "./atila-ambush-doctrine.js";

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
 const hunt=runAttilaHuntCycle({pages,events,leads,previous});
 const blocked=organism.autonomic?.mode==="SURVIVAL";
 return {
  identity:"ATTILA_INTEGRATED_RUNTIME",
  health,
  organism,
  hunt:blocked?{...hunt,state:"BODY_SURVIVAL_OVERRIDE",execute:false,commercial_reveal:false}:hunt,
  doctrine:arachnidDoctrineSnapshot(),
  guardrails:{autonomous_contact:false,autonomous_publish:false,autonomous_spend:false,
   autonomous_replication:false,destructive_action:false,raw_pii_memory:false}
 };
}
