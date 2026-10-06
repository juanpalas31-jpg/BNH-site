import test from "node:test";
import assert from "node:assert/strict";
import { evaluateBnhOpportunity } from "../adapters/bnh-opportunity-adapter.js";
import { instinctDecision } from "../dna/spider-instinct-registry.js";
import { RecoveryLedger, OPERATION_STATES } from "../resilience/recovery-ledger.js";
import { assimilateOutcome, foodMemory, nextHunt } from "../commercial/attila-assimilation.js";

test("Spider Engine V1 integrated lifecycle stays safe and learns from real value",async()=>{
 const body={
  lead_id:"V1-L1",session_id:"V1-S1",service_area:true,owner:true,project:"climatisation",
  timeline:"urgent",simulator_complete:true,requested_assessment:true,contact_consent:true,
  telephone:"0600000000",source:"organic",canal:"web",campagne:"dpe"
 };
 const opportunity=evaluateBnhOpportunity(body);
 assert.equal(opportunity.tenant_id,"bnh");
 assert.equal(opportunity.project_id,"bnh-site");
 assert.equal(opportunity.automatic_contact,false);
 assert.equal(opportunity.human_action_required,true);

 const blocked=instinctDecision({territory:"CRM",path_count:3});
 assert.equal(blocked.blocked,true);
 const hunt=instinctDecision({territory:"CRM",path_count:3,authorized_territories:["CRM"]});
 assert.equal(hunt.blocked,false);
 assert.equal(hunt.spider_mode,"Portia fimbriata");
 assert.equal(hunt.automatic_contact,false);

 const ledger=new RecoveryLedger();
 let writes=0;
 const record={lead_id:"V1-L1",tenant_id:"bnh",project_id:"bnh-site",record_type:"lead"};
 await ledger.process(record,async()=>{writes++;return {saved:true};});
 await ledger.process(record,async()=>{writes++;return {saved:true};});
 assert.equal(writes,1);
 assert.equal(ledger.operations.get("lead:V1-L1").state,OPERATION_STATES.COMPLETED);

 const outcome=assimilateOutcome({
  tenant_id:"bnh",project_id:"bnh-site",lead_id:"V1-L1",source:"organic",canal:"web",campagne:"dpe",
  outcome:"collected",collected_revenue:3000,realized_margin:900,intent_score:90,urgency_score:80,fit_score:90,
  reachability_score:100,contact_consent:true
 });
 assert.equal(outcome.assimilated_revenue,3000);
 assert.equal(outcome.assimilated_margin,900);
 const memory=foodMemory([outcome,outcome,outcome,outcome,outcome]);
 const next=nextHunt(memory,{min_samples:5});
 assert.equal(next.action,"BALANCED_HUNT");
 assert.equal(next.automatic_change,false);
});
