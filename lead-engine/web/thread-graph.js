/**
 * Organic acquisition topology for Spider Engine.
 * Models pages/tools as nodes and internal links as threads.
 */
export function buildThreadGraph(nodes=[],threads=[]){
  const ids=new Set(nodes.map(n=>n.id));
  const valid=threads.filter(t=>ids.has(t.from)&&ids.has(t.to)&&t.from!==t.to);
  const degree=Object.fromEntries(nodes.map(n=>[n.id,{in:0,out:0}]));
  for(const t of valid){degree[t.from].out++;degree[t.to].in++;}
  return {nodes,threads:valid,degree,invalid_threads:threads.length-valid.length};
}

export function weakPoints(graph){
  return graph.nodes.map(n=>{
    const d=graph.degree[n.id]||{in:0,out:0};
    return {id:n.id,orphan:d.in===0&&d.out===0,dead_end:d.in>0&&d.out===0};
  }).filter(x=>x.orphan||x.dead_end);
}
