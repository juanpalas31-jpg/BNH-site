// Attila Intelligent Web Mesh — interlinked information fabric.
// Nodes share verified signals fast while preserving project/tenant boundaries.
// "Intelligent" here means scored routing + validation + deduplication, not sentience.

export const WEB_MESH_POLICY=Object.freeze({
  maxHops:4,maxFanout:8,minQuality:0.55,
  sensitiveFields:["secret","token","password","privateKey","seedPhrase","personalData"],
  protectedChannels:["finance","auth","legal"],
  requireEvidenceForFacts:true,
  crossTenantPrivateData:false
});
export const SIGNAL_TYPES=Object.freeze([
  "OBSERVATION","EVIDENCE","SEO_INSIGHT","CONTENT_QUALITY","RISK",
  "OPPORTUNITY","TASK_RESULT","LESSON","ALERT","COORDINATION"
]);
const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
export function qualityScore(s={}){
  return clamp(clamp(s.confidence)*.30+clamp(s.evidenceStrength)*.30+
    clamp(s.freshness)*.20+clamp(s.relevance)*.20);
}
export function sanitize(payload={}){
  const out={...payload};
  for(const k of WEB_MESH_POLICY.sensitiveFields) if(k in out) out[k]="[REDACTED]";
  return out;
}
export function createSignal({id,type,from,to="MESH",project="shared",payload={},confidence=.5,evidenceStrength=0,freshness=1,relevance=.5,visibility="PROJECT",createdAt=new Date().toISOString()}){
  if(!id||!SIGNAL_TYPES.includes(type)) throw new Error("WEB_MESH_INVALID_SIGNAL");
  const signal={id,type,from,to,project,payload:sanitize(payload),confidence:clamp(confidence),evidenceStrength:clamp(evidenceStrength),freshness:clamp(freshness),relevance:clamp(relevance),visibility,createdAt,hops:0};
  return Object.freeze({...signal,quality:qualityScore(signal)});
}
export function mayRoute(signal,node){
  if(signal.hops>=WEB_MESH_POLICY.maxHops) return false;
  if(signal.quality<WEB_MESH_POLICY.minQuality && signal.type!=="ALERT") return false;
  if(signal.visibility==="PRIVATE" && node.project!==signal.project) return false;
  if(node.tenant && signal.tenant && node.tenant!==signal.tenant) return false;
  return true;
}
export function createWebMesh(nodes=[]){
  const registry=new Map(nodes.map(n=>[n.id,Object.freeze({...n})]));
  const seen=new Set(), journal=[];
  return Object.freeze({
    nodes:()=>[...registry.values()],
    journal:()=>[...journal],
    publish(signal){
      if(seen.has(signal.id)) return {delivered:[],reason:"DUPLICATE"};
      seen.add(signal.id);
      const candidates=[...registry.values()].filter(n=>n.id!==signal.from&&mayRoute(signal,n));
      const ranked=candidates.map(n=>({n,score:clamp(signal.quality*.65+(n.interests||[]).includes(signal.type)*.25+(n.project===signal.project)*.10)}))
        .sort((a,b)=>b.score-a.score).slice(0,WEB_MESH_POLICY.maxFanout);
      const delivered=ranked.map(({n,score})=>({node:n.id,score}));
      journal.push({signal:{...signal,hops:signal.hops+1},delivered});
      return {delivered,quality:signal.quality};
    }
  });
}
export const DEFAULT_WEB_NODES=Object.freeze([
 {id:"ATTILA",kind:"COORDINATOR",project:"shared",interests:SIGNAL_TYPES},
 {id:"MINI_TILA_VINTED",kind:"REPLICANT",project:"vinted",interests:["SEO_INSIGHT","CONTENT_QUALITY","TASK_RESULT","LESSON","ALERT"]},
 {id:"MINI_TILA_AFFICHES",kind:"REPLICANT",project:"mes-petites-affiches",interests:["SEO_INSIGHT","CONTENT_QUALITY","OPPORTUNITY","LESSON","ALERT"]},
 {id:"MINI_TILA_MPM",kind:"REPLICANT",project:"mon-petit-marin",interests:["CONTENT_QUALITY","TASK_RESULT","RISK","LESSON","ALERT"]},
 {id:"NEO_TILA_BRIDGE",kind:"ANT_BRIDGE",project:"shared",interests:["EVIDENCE","TASK_RESULT","ALERT","COORDINATION"]}
]);
