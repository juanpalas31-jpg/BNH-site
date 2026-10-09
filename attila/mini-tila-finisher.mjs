// Mini-Tila Finisher — mandatory PRE-FLIGHT before touching a project.
// It reconstructs project intent from authorized evidence, then finishes gaps.
// Source adapters are injected: no hidden/unapproved access to chats, mail or files.

export const FINISHER_POLICY=Object.freeze({
  preflightRequired:true,
  executionWithoutContext:false,
  preserveValidatedTheme:true,
  evidenceBeatsHistoricalClaims:true,
  noSecretIngestion:true,
  noCrossProjectPrivateData:true,
  productionPublishRequiresApproval:true,
  minimumContextConfidence:.65
});

export const SOURCE_PRIORITY=Object.freeze([
  "DEPLOYMENT_EVIDENCE","TEST_EVIDENCE","REPOSITORY_CODE","PROJECT_FILES",
  "VALIDATED_DECISIONS","CHAT_HISTORY","AUTHORIZED_EMAIL"
]);

const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
const redact=v=>JSON.parse(JSON.stringify(v??null,(k,x)=>
 /password|token|secret|private.?key|seed.?phrase/i.test(k)?"[REDACTED]":x));

export async function collectProjectMemory({project,adapters={}}={}){
  if(!project?.id) throw new Error("FINISHER_PROJECT_REQUIRED");
  const sources=[];
  for(const [kind,read] of Object.entries(adapters)){
    if(typeof read!=="function") continue;
    const items=await read(project);
    for(const item of (Array.isArray(items)?items:[items]).filter(Boolean))
      sources.push(Object.freeze({kind,project:project.id,...redact(item)}));
  }
  return Object.freeze({project:project.id,sources,collectedAt:new Date().toISOString()});
}

export function reconstructIntent(memory){
  const relevant=memory.sources.filter(s=>!s.project||s.project===memory.project);
  const validated=relevant.filter(s=>s.validated===true);
  const evidence=relevant.filter(s=>["DEPLOYMENT_EVIDENCE","TEST_EVIDENCE","REPOSITORY_CODE"].includes(s.kind));
  const decisions=validated.map(s=>s.decision||s.requirement||s.content).filter(Boolean);
  const theme=validated.map(s=>s.theme).find(Boolean)||null;
  const confidence=clamp((validated.length*.12)+(evidence.length*.16)+(relevant.length*.025));
  return Object.freeze({project:memory.project,theme,decisions,evidence,confidence});
}

export function auditCompletion({intent,currentState={}}={}){
  if(!intent) throw new Error("FINISHER_INTENT_REQUIRED");
  const required=[...new Set(intent.decisions.map(x=>typeof x==="string"?x:x?.id).filter(Boolean))];
  const proven=new Set((currentState.proven||[]).map(x=>typeof x==="string"?x:x?.id));
  const gaps=required.filter(x=>!proven.has(x));
  return Object.freeze({required,proven:[...proven],gaps,complete:gaps.length===0});
}

export async function runFinisherPreflight({project,adapters,currentState={}}={}){
  const memory=await collectProjectMemory({project,adapters});
  const intent=reconstructIntent(memory);
  const audit=auditCompletion({intent,currentState});
  const ready=intent.confidence>=FINISHER_POLICY.minimumContextConfidence;
  return Object.freeze({
    workerType:"MINI_TILA_FINISHER",project:project.id,phase:"PRE_FLIGHT",
    ready,memory,intent,audit,
    next:ready?(audit.complete?"VERIFY_FINAL_STATE":"FINISH_GAPS"):"COLLECT_MORE_CONTEXT"
  });
}

export async function executeFinisher({preflight,executor}={}){
  if(!preflight?.ready) throw new Error("FINISHER_PREFLIGHT_NOT_READY");
  if(preflight.phase!=="PRE_FLIGHT") throw new Error("FINISHER_PREFLIGHT_REQUIRED");
  if(preflight.audit.complete) return {status:"VERIFY_ONLY",project:preflight.project};
  if(typeof executor!=="function") return {status:"NO_EXECUTOR",project:preflight.project};
  const result=await executor({
    project:preflight.project,
    gaps:preflight.audit.gaps,
    theme:preflight.intent.theme,
    constraints:preflight.intent.decisions
  });
  return Object.freeze({
    status:"FINISHER_EXECUTED",project:preflight.project,
    gapsAttempted:preflight.audit.gaps,
    evidence:redact(result?.evidence??null),
    productionPublished:false
  });
}
