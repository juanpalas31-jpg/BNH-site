const safe=n=>Math.max(0,Math.min(1,Number(n)||0));
export function absorbReplicantHit({swarm=[],replicant_id,attack={}}={}){
 const next=swarm.map(r=>r.id===replicant_id?{...r,status:"SACRIFICED",alive:false,
  learned_signal:{pattern:attack.pattern||null,effect:attack.effect||null},
  secret_exposure:false}:r);
 const survivors=next.filter(r=>r.alive!==false);
 return {swarm:next,survivors,sacrificed:next.filter(r=>r.alive===false),
  core_exposed:false,host_secret_exposed:false,recalculate:survivors.length>0};
}
export function survivorConsensus({survivors=[],observations=[]}={}){
 const candidates=["ISOLATE","STARVE","DECOY","RESET"];
 const scored=candidates.map((name,i)=>{
  const evidence=observations.filter(o=>o.recommendation===name).length;
  const diversity=new Set(survivors.map(x=>x.role)).size;
  return {name,score:safe(.35+.08*evidence+.025*diversity-.03*i)};
 }).sort((a,b)=>b.score-a.score);
 return {strategies:scored.slice(0,4),selected:scored[0],
  principle:"SURVIVORS_LEARN_FROM_SACRIFICED_REPLICANTS"};
}
export function dissolveReplicants(swarm=[]){
 return swarm.map(r=>({...r,status:"DISSOLVED",alive:false,
  volatile_memory_cleared:true,credentials_retained:false}));
}
