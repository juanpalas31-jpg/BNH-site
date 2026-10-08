// Attila Cognitive Runtime — bounded autonomous work cycles.
// Architecture: spider-inspired strategies are software heuristics, not claims of sentience.
// External actions remain gated; no live trading, publishing, transfers, or messaging by default.

export const ATTILA_RUNTIME_POLICY = Object.freeze({
  mode: "BOUNDED_AUTONOMY",
  maxCycleMs: 20 * 60 * 1000,
  maxTasksPerCycle: 12,
  protectedIntents: ["LIVE_TRADE","ASSET_TRANSFER","PUBLISH","EXTERNAL_SEND","DELETE","LEGAL_COMMITMENT"],
  requireHumanApprovalForProtectedIntent: true,
  evidenceRequired: true,
  fabricatedResultsAllowed: false
});

export const WEBS = Object.freeze({
  SALTICIDAE: { role:"SCOUT", behavior:"observe-rank-focus", purpose:"Find the highest-value next action." },
  ORB_WEAVER: { role:"SYSTEM", behavior:"connect-measure-repair", purpose:"Maintain the web of projects, dependencies and metrics." },
  BOLAS: { role:"TARGET", behavior:"selective-attraction", purpose:"Design targeted acquisition hypotheses without publishing them." },
  TRAPDOOR: { role:"WATCH", behavior:"wait-trigger-escalate", purpose:"Watch explicit conditions and surface actionable changes." },
  SOCIAL_SPIDER: { role:"COORDINATE", behavior:"share-tools-isolate-data", purpose:"Coordinate modules while respecting tenant/domain isolation." }
});

export function scoreTask(t={}) {
  const impact=Number(t.impact)||0, confidence=Number(t.confidence)||0, urgency=Number(t.urgency)||0, cost=Number(t.cost)||0;
  return impact*0.4 + confidence*0.25 + urgency*0.25 - cost*0.1;
}
export function isProtected(task={}) {
  return ATTILA_RUNTIME_POLICY.protectedIntents.includes(String(task.intent||"").toUpperCase());
}
export function planCycle(tasks=[]) {
  return tasks.map(t=>({...t,score:scoreTask(t),protected:isProtected(t)}))
    .sort((a,b)=>b.score-a.score).slice(0,ATTILA_RUNTIME_POLICY.maxTasksPerCycle);
}
export async function runAttilaCycle({tasks=[], executors={}, now=()=>Date.now()}={}) {
  const started=now(), log=[];
  for (const task of planCycle(tasks)) {
    if (now()-started > ATTILA_RUNTIME_POLICY.maxCycleMs) { log.push({id:task.id,status:"TIMEBOX_END"}); break; }
    if (task.protected) { log.push({id:task.id,status:"AWAITING_HUMAN_APPROVAL",intent:task.intent}); continue; }
    const exec=executors[task.type];
    if (typeof exec!=="function") { log.push({id:task.id,status:"NO_EXECUTOR"}); continue; }
    try {
      const result=await exec(task);
      log.push({id:task.id,status:"EXECUTED",evidence:result?.evidence??null});
    } catch(e) { log.push({id:task.id,status:"FAILED",error:String(e?.message||e)}); }
  }
  return Object.freeze({startedAt:started,finishedAt:now(),log});
}
