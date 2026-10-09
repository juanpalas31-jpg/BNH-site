// Mini-Tila Finisher registry — assigns unfinished projects while Attila handles priority work.
// PRE-FLIGHT remains mandatory. Source connectors are external/injected and must be authorized.

export const FINISHER_REGISTRY=Object.freeze({
 priorityOwner:"ATTILA",
 priorityProject:"VINTED_TOILE_DOR",
 projects:Object.freeze([
  {id:"mon-petit-marin",worker:"MINI_TILA_FINISHER_MPM",state:"UNFINISHED",preflight:"REQUIRED"},
  {id:"mes-petites-affiches",worker:"MINI_TILA_FINISHER_MPA",state:"UNFINISHED",preflight:"REQUIRED"},
  {id:"le-bilan",worker:"MINI_TILA_FINISHER_BILAN",state:"UNFINISHED",preflight:"REQUIRED"}
 ])
});
export const PREFLIGHT_SOURCE_CONTRACT=Object.freeze({
 required:["REPOSITORY_CODE","PROJECT_FILES","VALIDATED_DECISIONS","TEST_EVIDENCE","DEPLOYMENT_EVIDENCE"],
 contextual:["CHAT_HISTORY","AUTHORIZED_EMAIL"],
 rules:["NO_EXECUTION_BEFORE_PREFLIGHT","EVIDENCE_OVER_OLD_CLAIMS","PRESERVE_VALIDATED_THEME","NO_SECRET_INGESTION","NO_CROSS_PROJECT_PRIVATE_DATA"]
});
export function finisherAssignments(){
 return FINISHER_REGISTRY.projects.map(p=>Object.freeze({
  project:{id:p.id},worker:p.worker,
  task:{id:`finish:${p.id}`,type:"FINISH_PROJECT",intent:"CODE_CHANGE",preflightRequired:true}
 }));
}
export function sourceReadiness(connectors={}){
 const all=[...PREFLIGHT_SOURCE_CONTRACT.required,...PREFLIGHT_SOURCE_CONTRACT.contextual];
 return Object.freeze(Object.fromEntries(all.map(k=>[k,typeof connectors[k]==="function"])));
}
