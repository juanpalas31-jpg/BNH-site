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
import { routeHighIntentThread } from "../commercial/high-intent-thread-router.js";
import { leadQuality } from "../commercial/lead-quality.js";
import { contentNextAction } from "../content/content-next-action.js";
import { internalSilk } from "../content/internal-silk.js";
import { defensiveMetabolism,defenseThrottle } from "../resilience/atila-defensive-metabolism.js";
import { createColony,recruit,collectivePlan } from "../microorganisms/atila-colony-brain.js";
import { aggregatePerformance,rankThreads } from "../memory/learning.js";
import { synapticWeight } from "../memory/synaptic-plasticity.js";
import { evaluateMutation } from "../evolution/mutation-guard.js";
import { buildStructuralInheritance,assertNoTenantData } from "../reproduction/structural-learning.js";
import { operationalMetrics,healthFromMetrics } from "../observability/metrics.js";
import { attributeFunnel,summarizeAttribution } from "../observability/funnel-attribution.js";
import { nervousCycle } from "../senses/nervous-system.js";
import { fuseSignals } from "../senses/atila-web-nervous-system.js";
import { reflexArc,reflexBudget } from "../microorganisms/neo-atila-reflex-arc.js";
import { enforceDiversity } from "../resilience/neo-atila-diversity.js";
import { damageSignal,scarRecord } from "../health/damage-response.js";
import { observeBnhLead,observeSeoSignal } from "./atila-lead-observer.js";
import { weaveWeb } from "./atila-web-weaver.js";

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
 const defense_state=events.slice(-50).reduce((s,e)=>defensiveMetabolism(s,{
  cost:e.event==="error"?.12:.02,duplicate:false
 }),{energy:1,load:0,suppressed:0,handled:0});
 const defense_throttle=defenseThrottle(defense_state);
 const colony=createColony(6);
 const recruited=recruit(colony,{type:"WEB_VIBRATION",strength:Math.min(1,vibration.score/20)});
 const colony_plan=collectivePlan(recruited);
 const performance=aggregatePerformance(leads.map(l=>({...l,record_type:"lead"})));
 const ranked_threads=rankThreads(performance);
 const synapse=synapticWeight({from:"qualified_signal",to:"lead",observations:events.length,successes:leads.length});
 const mutation=evaluateMutation({
  mutation_id:"runtime-current",control_samples:events.length,variant_samples:events.length,
  control_fitness:0,variant_fitness:0,confidence:synapse.confidence
 });
 const inheritance=buildStructuralInheritance({
  event_taxonomy:"runtime-v1",storage_contract_version:2,validated_patterns:ranked_threads.slice(0,5).map(x=>x.campagne)
 });
 const inheritance_safety=assertNoTenantData(inheritance);
 const normalizedEvents=events.map(e=>({...e,type:e.type||e.event}));
 const metrics=operationalMetrics({leads,events:normalizedEvents,errors:[]});
 const metrics_health=healthFromMetrics(metrics);
 const journeys=attributeFunnel(normalizedEvents);
 const attribution=summarizeAttribution(journeys);
 const fused=fuseSignals(signals.map(s=>({intensity:s.strength,novelty:s.novelty,repeat_rate:0,integrity_risk:health.status==="healthy"?0:.35})));
 const nervous=nervousCycle({
  self:{capabilities:["observe","measure","recommend"]},
  health:{availability_pct:health.status==="healthy"?100:70,integrity_pct:100,restore_readiness_pct:storage?90:45,ingestion_health_pct:100,security_health_pct:100},
  environment:{resource_pressure:organism.next_body?.load||0},
  opportunity_score:Math.min(1,leads.length/10),evidence_confidence:Math.min(1,events.length/50),
  resource_pressure:organism.next_body?.load||0
 });
 const reflexes=signals.slice(0,6).map(s=>reflexArc({intensity:s.strength,novelty:s.novelty,repeat_rate:0,integrity_risk:0}));
 const neoNodes=reflexes.flatMap(x=>x.swarm?.replicants||x.swarm?.nodes||[]);
 const neoDiversity=enforceDiversity(neoNodes);
 const neoBudget=reflexBudget({energy:organism.next_body?.energy||.8,active_replicants:neoNodes.length});
 const damage=damageSignal({
  error_rate:metrics.error_rate_last_hour,data_integrity_risk:storage?0:.35,
  security_risk:immunity.mode==="NORMAL"?0:.4,restore_risk:storage?0:.45,customer_impact:0
 });
 const scar=damage.avoid_repeat?scarRecord({cause:"runtime_degradation",context:"heartbeat",damage:{
  error_rate:metrics.error_rate_last_hour,data_integrity_risk:storage?0:.35,
  security_risk:immunity.mode==="NORMAL"?0:.4,restore_risk:storage?0:.45
 },lesson:"Preserve ingestion and restore path before nonessential activity"}):null;
 const observers={
  leads:leads.slice(-20).map(observeBnhLead),
  seo:events.slice(-50).map(observeSeoSignal)
 };
 const web_weaving=weaveWeb({pages,events,leads,previous});
 const commercial={
  threads:pages.slice(0,50).map(p=>routeHighIntentThread({page:p.path||p.slug||"",topic:p.intent||p.topic||""})),
  lead_quality:leads.slice(-20).map(l=>({lead_id:l.lead_id||null,...leadQuality({
   serviceArea:Boolean(l.code_postal),projectIdentified:Boolean(l.intent||l.service),
   timelineKnown:Boolean(l.timeline),requestedAssessment:true
  })}))
 };
 const content={
  actions:pages.slice(0,50).map(p=>contentNextAction({
   cluster:p.intent||p.cluster||"unknown",views:p.views||0,engaged:p.engaged||0,
   cta_clicks:p.starts||0,leads:p.leads||0,appointments:p.appointments||0,sales:p.sales||0
  })),
  silk:pages.filter(p=>p.slug).slice(0,20).map(p=>internalSilk(p.slug))
 };
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
  learning:{consolidation:learning,performance,ranked_threads,synapse,mutation,
   inheritance:{payload:inheritance,safety:inheritance_safety}},
  policy,
  defense_metabolism:{state:defense_state,throttle:defense_throttle},
  colony:{size:colony.length,recruited:recruited.length,plan:colony_plan},
  observability:{metrics,health:metrics_health,journeys,attribution},
  nervous_system:{fused,nervous},
  damage:{signal:damage,scar},
  observers,
  web_weaving,
  neo:{reflexes,budget:neoBudget,diversity:neoDiversity.diversity,reseed_recommended:neoDiversity.reseed},
  commercial,
  content,
  hunt:blocked?{...hunt,state:"BODY_SURVIVAL_OVERRIDE",execute:false,commercial_reveal:false}:hunt,
  doctrine:arachnidDoctrineSnapshot(),
  guardrails:{autonomous_contact:false,autonomous_publish:false,autonomous_spend:false,
   autonomous_replication:false,destructive_action:false,raw_pii_memory:false}
 };
}
