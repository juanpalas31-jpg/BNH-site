import { createMissionState,runMissionUntilBlocked } from "./atila-mission-orchestrator.js";
import { createMemoryMissionAdapter,createMissionPersistence } from "./atila-mission-persistence.js";

const verified=artifact=>async()=>({verified:true,artifact});
const approval=async()=>({verified:false,reason:"HUMAN_OR_EXTERNAL_APPROVAL_REQUIRED"});

export async function runGreenSpaceMissionV1(){
 const storage=createMemoryMissionAdapter();
 const persistence=createMissionPersistence(storage);
 const state=createMissionState({
  mission_id:"v1-green-space-demo",
  client_id:"authorized-demo-client",
  sector:"espaces verts",
  consent:true
 });
 const executors={
  COLLECT_AUTHORIZED_BUSINESS_CONTEXT:verified("business-context"),
  DESIGN_DOMAIN_BRAND_FUNNEL:verified("brand-domain-funnel-plan"),
  GENERATE_SITE_FUNNEL_SEO_MEASUREMENT:verified("generated-site-seo-measurement-package"),
  RUN_QA_AND_SECURITY_CHECKS:verified("qa-report"),
  REQUEST_REQUIRED_HUMAN_APPROVALS:approval
 };
 const result=await runMissionUntilBlocked({
  state,executors,
  onProgress:async mission=>persistence.save(mission)
 });
 const saved=await persistence.resume(state.mission_id);
 return{
  mode:"V1_INTEGRATION_DEMO",
  expected_stop:"APPROVAL",
  result_state:result.state,
  final_phase:result.mission?.phase,
  persisted:saved.ok,
  external_purchase:false,
  external_publish:false,
  external_ad_spend:false,
  trace:result.trace
 };
}
