// Mini-Tila Colony — bounded parallel workers delegated by Attila.
// Replicants are ephemeral software workers, not independent sentient agents.
// Each worker is isolated by project scope and returns evidence to Attila.

export const MINI_TILA_POLICY=Object.freeze({
  maxParallel:3,
  ephemeral:true,
  crossProjectWrites:false,
  directProductionWrites:false,
  protectedIntents:["LIVE_TRADE","ASSET_TRANSFER","PUBLISH","EXTERNAL_SEND","DELETE","LEGAL_COMMITMENT"],
  returnToAttila:["result","evidence","lessons","risks","nextActions"]
});

export const PROJECT_WEBS=Object.freeze({
  VINTED:{scope:"vinted",mission:"Analyse et amélioration organique Vinted / Toile d'Or"},
  PETITES_AFFICHES:{scope:"mes-petites-affiches",mission:"Catalogue, contenu, SEO, mesure et conversion"},
  MON_PETIT_MARIN:{scope:"mon-petit-marin",mission:"Produit, acquisition, qualité et exploitation du pilote"}
});

function protectedTask(t={}) {
  return MINI_TILA_POLICY.protectedIntents.includes(String(t.intent||"").toUpperCase());
}
export function spawnMiniTila(task,project) {
  if(!project?.scope) throw new Error("MINI_TILA_PROJECT_SCOPE_REQUIRED");
  return Object.freeze({
    id:`mini-tila:${project.scope}:${task.id||"task"}`,
    parent:"ATTILA",scope:project.scope,mission:project.mission,
    task:Object.freeze({...task}),state:"READY",ephemeral:true
  });
}
export async function runMiniTila(worker,{executors={},evidenceSink=null}={}) {
  if(protectedTask(worker.task)) return {worker:worker.id,status:"WAITING_APPROVAL",evidence:null};
  const exec=executors[worker.task.type];
  if(typeof exec!=="function") return {worker:worker.id,status:"NO_EXECUTOR",evidence:null};
  try{
    const out=await exec({...worker.task,scope:worker.scope});
    const report=Object.freeze({
      worker:worker.id,status:"COMPLETED",scope:worker.scope,
      result:out?.result??null,evidence:out?.evidence??null,
      lessons:out?.lessons??[],risks:out?.risks??[],nextActions:out?.nextActions??[]
    });
    if(evidenceSink) await evidenceSink(report);
    return report;
  }catch(e){
    return {worker:worker.id,status:"FAILED",scope:worker.scope,error:String(e?.message||e),evidence:null};
  }
}
export async function delegateAcrossWebs(assignments=[],options={}) {
  const selected=assignments.slice(0,MINI_TILA_POLICY.maxParallel);
  const workers=selected.map(a=>spawnMiniTila(a.task,a.project));
  const reports=await Promise.all(workers.map(w=>runMiniTila(w,options)));
  return Object.freeze({
    coordinator:"ATTILA",parallelism:workers.length,reports,
    synthesis:{
      evidence:reports.flatMap(r=>r.evidence?[r.evidence]:[]),
      lessons:reports.flatMap(r=>r.lessons||[]),
      risks:reports.flatMap(r=>r.risks||[]),
      nextActions:reports.flatMap(r=>r.nextActions||[])
    }
  });
}
