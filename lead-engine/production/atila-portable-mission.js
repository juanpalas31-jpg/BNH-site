import { createHash,randomUUID } from "node:crypto";
import { hostGate } from "../defense/atila-host-gate.js";
import { buildStructuralInheritance,assertNoTenantData } from "../reproduction/structural-learning.js";
import { compileNeoAtila,dissolveInnerCode } from "../microorganisms/neo-atila-inner-organism.js";
import { nextHuntPlan } from "./atila-web-weaver.js";

const H=v=>createHash("sha256").update(String(v)).digest("hex");
const clean=v=>String(v||"").trim();

export const PORTABLE_ATTILA_RULES=Object.freeze({
 pair_required:true,
 owner_authorization_required:true,
 target_permission_required:true,
 least_privilege:true,
 raw_pii_export:false,
 secrets_export:false,
 provider_logs_preserved:true,
 security_logs_preserved:true,
 unauthorized_trace_erasure:false,
 portable_learning:"STRUCTURAL_ONLY"
});

export function authorizePortableMission({owner_proof={},target={},scope=[]}={}){
 const gate=hostGate({proof_result:owner_proof,risk:{},requested_action:"DEPLOY"});
 const targetOk=Boolean(clean(target.id)&&target.permission_verified===true);
 const allowed=gate.allowed&&targetOk&&scope.length>0;
 return {
  mission_id:"ATTILA-MISSION-"+randomUUID(),
  allowed,
  pair:["ATTILA","NEO-ATILA"],
  target:{id:clean(target.id),fingerprint:H(target.id||"")},
  scope:[...new Set(scope.map(clean).filter(Boolean))],
  reasons:[
   ...(!gate.allowed?["OWNER_AUTHORIZATION_REQUIRED"]:[]),
   ...(!targetOk?["TARGET_PERMISSION_REQUIRED"]:[]),
   ...(!scope.length?["MISSION_SCOPE_REQUIRED"]:[])
  ],
  rules:PORTABLE_ATTILA_RULES
 };
}

export function embarkPortableAttila({mission,knowledge={}}={}){
 if(!mission?.allowed) return {embarked:false,reason:"MISSION_NOT_AUTHORIZED"};
 const inheritance=buildStructuralInheritance(knowledge);
 const safety=assertNoTenantData(inheritance);
 if(!safety.ok) return {embarked:false,reason:"TENANT_DATA_BLOCKED",safety};
 const neo=compileNeoAtila({role:"OBSERVER",target_fingerprint:mission.target.fingerprint,ttl:8});
 return {
  embarked:true,mission_id:mission.mission_id,pair:["ATTILA","NEO-ATILA"],
  target:mission.target,scope:mission.scope,structural_knowledge:inheritance,neo,
  ephemeral_runtime:true,tenant_data_carried:false,secrets_carried:false
 };
}

export function planPortableWebMission({deployment,pages=[],events=[],leads=[],previous={}}={}){
 if(!deployment?.embarked) return {execute:false,reason:"ATTILA_NOT_EMBARKED"};
 return {
  execute:true,mission_id:deployment.mission_id,
  pair:["ATTILA","NEO-ATILA"],
  plan:nextHuntPlan({pages,events,leads,previous}),
  writes_require_target_permission:true,
  publication_requires_gate:true
 };
}

export function repatriatePortableAttila({deployment,validated_patterns=[],authorized_artifacts=[]}={}){
 if(!deployment?.embarked) return {repatriated:false,reason:"NO_ACTIVE_MISSION"};
 const learning=buildStructuralInheritance({
  validated_patterns:[...new Set(validated_patterns.map(clean).filter(Boolean))]
 });
 const safety=assertNoTenantData(learning);
 const neo=dissolveInnerCode(deployment.neo);
 return {
  repatriated:true,mission_id:deployment.mission_id,
  pair_returned:["ATTILA","NEO-ATILA"],structural_learning:safety.ok?learning:{},
  target_cleanup:{
   remove_ephemeral_runtime:true,
   remove_engine_credentials:true,
   remove_private_memory:true,
   remove_temporary_working_data:true,
   preserve_authorized_artifacts:[...new Set(authorized_artifacts.map(clean).filter(Boolean))],
   preserve_provider_logs:true,preserve_security_logs:true,
   erase_third_party_logs:false
  },
  neo,
  complete:safety.ok&&neo.state.alive===false
 };
}
