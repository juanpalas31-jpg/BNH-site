import { weaveWeb,nextHuntPlan } from "./atila-web-weaver.js";
import { ambushDecision, arachnidDoctrineSnapshot, AMBUSH_STATES } from "./atila-ambush-doctrine.js";

function inferEditorialValue(pages=[]){
 const useful=pages.filter(p=>p?.useful_information||p?.sourced||p?.editorial_value>=0.55).length;
 return pages.length?Math.min(1,useful/pages.length):0;
}

function inferCommercialRelevance({events=[],leads=[]}={}){
 const starts=events.filter(e=>e?.event==="form_start").length;
 const high=leads.filter(l=>Number(l?.score||0)>=78).length;
 return Math.min(1,(starts*0.12)+(leads.length*0.22)+(high*0.28));
}

export function runAttilaHuntCycle({pages=[],events=[],leads=[],previous={}}={}){
 const woven=weaveWeb({pages,events,leads,previous});
 const views=events.filter(e=>e?.event==="page_view").length;
 const starts=events.filter(e=>e?.event==="form_start").length;
 const highIntent=leads.filter(l=>Number(l?.score||0)>=78).length;
 const ambush=ambushDecision(
  {views,form_starts:starts,leads:leads.length,high_intent:highIntent,relevance:Math.min(1,(starts+leads.length)/Math.max(1,views))},
  {editorial_value:inferEditorialValue(pages),commercial_relevance:inferCommercialRelevance({events,leads})}
 );
 const evidence={event_count:events.length,lead_count:leads.length,page_count:pages.length,
  views,form_starts:starts,high_intent:highIntent,sufficient_signal:events.length>=8||leads.length>=1};

 // Arachnid doctrine has priority over expansion: no signal = no movement.
 if(ambush.state===AMBUSH_STATES.IMMOBILE){
  return {state:"IMMOBILE",evidence,ambush,execute:false,commercial_reveal:false,
   plan:{action:"OBSERVE_WITHOUT_REVEALING_WEB"},
   reason:"Attila remains still until measured prey signal exists."};
 }

 // Interest without enough editorial value: stay hidden and improve the web first.
 if(ambush.state===AMBUSH_STATES.AMBUSH){
  return {state:"AMBUSH",evidence,ambush,execute:false,commercial_reveal:false,
   plan:{action:"IMPROVE_EDITORIAL_NODE_BEFORE_HUNT"},
   reason:"Attila detected movement but the web is not valuable enough yet."};
 }

 const plan=nextHuntPlan({pages,events,leads,previous});

 if(ambush.state===AMBUSH_STATES.SIGNAL_DETECTED){
  return {state:"SIGNAL_DETECTED",evidence,ambush,plan:{...plan,action:"WEAVE_USEFUL_EDITORIAL_NODE_AND_MEASURE"},
   execute:false,commercial_reveal:false,
   reason:"Attila weaves quietly around validated interest; no forced commercial exposure."};
 }

 if(ambush.state===AMBUSH_STATES.PREPARE_POUNCE){
  return {state:"PREPARE_POUNCE",evidence,ambush,plan:{...plan,action:"STRENGTHEN_CONTEXT_WITHOUT_FORCING_OFFER"},
   execute:false,commercial_reveal:false,
   reason:"Strong signal detected; Attila remains hidden until the commercial transition is natural."};
 }

 return {state:"POUNCE_PROPOSAL",evidence,ambush,plan,execute:false,commercial_reveal:true,
  gate:"OWNER_OR_VALIDATED_PUBLISHER",
  reason:"Attila proposes a contextual conversion path; execution remains gated."};
}

export function evaluateHuntOutcome({before={},after={}}={}){
 const b=Number(before.leads||0),a=Number(after.leads||0);
 const bv=Number(before.views||0),av=Number(after.views||0);
 const br=b/Math.max(1,bv),ar=a/Math.max(1,av);
 const delta=ar-br;
 return {
  evaluator:"ATTILA_ADAPTIVE_FEEDBACK",
  outcome:delta>0?"REINFORCE":delta<0?"RECONSIDER":"KEEP_OBSERVING",
  conversion_before:Number(br.toFixed(4)),conversion_after:Number(ar.toFixed(4)),
  delta:Number(delta.toFixed(4)),durable_learning:Math.abs(delta)>=0.01&&av>=8,
  arachnid_doctrine:arachnidDoctrineSnapshot(),
  doctrine:["IMMOBILIZE","AMBUSH","MEASURE","UNDERSTAND","PREPARE","POUNCE_IF_VALIDATED","MEMORIZE","EVOLVE"]
 };
}
