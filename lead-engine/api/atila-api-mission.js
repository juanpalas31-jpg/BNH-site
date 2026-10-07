import { forgeApiContract } from "./atila-api-forge.js";

export function createAttilaApiMission({owner_verified=false,target={},purpose="",resource="",operations=["GET"]}={}){
 if(!owner_verified)return{ok:false,state:"OWNER_PROOF_REQUIRED"};
 if(!target.id||target.permission_verified!==true)return{ok:false,state:"TARGET_PERMISSION_REQUIRED"};
 const contract=forgeApiContract({need:purpose,resource,operations,visibility:"PRIVATE"});
 return{
  ok:true,
  capability:"ATTILA_API_MISSION_V1",
  target_id:String(target.id),
  contract,
  stages:["DESIGN","GENERATE","VALIDATE","TEST","PACKAGE","HANDOFF","VERIFY_RESULT","RETURN_HOME"],
  handoff_requires_authorized_connector:true,
  credential_discovery:false,
  privilege_escalation:false
 };
}

export function buildApiPackage({mission}={}){
 if(!mission?.ok)return{ok:false,state:"AUTHORIZED_MISSION_REQUIRED"};
 const endpoints=(mission.contract.endpoints||[]).map((e,index)=>({
  id:index+1,
  method:e.method,
  path:e.path,
  authentication:e.authentication,
  validation:e.validation,
  audit:e.audit
 }));
 return{
  ok:true,
  produced_by:"ATTILA",
  package_type:"API_IMPLEMENTATION_PLAN",
  target_id:mission.target_id,
  contract:mission.contract,
  endpoints,
  required_tests:["AUTH_REQUIRED","INVALID_INPUT_REJECTED","VALID_JSON_RESPONSE","AUDIT_EMITTED"],
  handoff_state:"AUTHORIZED_CONNECTOR_REQUIRED",
  secrets_in_package:false
 };
}

export function completeApiMission({mission,handoff_result={}}={}){
 if(!mission?.ok)return{ok:false,state:"AUTHORIZED_MISSION_REQUIRED"};
 return{
  ok:true,
  state:"RETURN_HOME",
  target_id:mission.target_id,
  result:{
   handed_off:Boolean(handoff_result.handed_off),
   installed:Boolean(handoff_result.installed),
   verified:Boolean(handoff_result.verified)
  },
  retain_target_credentials:false,
  retain_target_secrets:false,
  structural_learning_only:true
 };
}
