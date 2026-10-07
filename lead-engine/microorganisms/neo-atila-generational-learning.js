import {inheritedTactics} from "../memory/neo-atila-tactical-inheritance.js";
export function seedGeneration({replicants=[],memory=[],threat_class="UNKNOWN"}={}){
 const inherited=inheritedTactics(memory,threat_class);
 return replicants.map((r,i)=>({...r,tactical_inheritance:inherited,
  inherited_rank:i%Math.max(1,inherited.length||1),memory_write:false}));
}
export function generationFitness({neo={},outcome={}}={}){
 const survived=outcome.survived===true?1:0,contained=outcome.contained===true?1:0;
 const collateral=Number(outcome.collateral)||0,cost=Number(outcome.cost)||0;
 return Math.max(0,Math.min(1,.35*survived+.5*contained-.1*collateral-.05*cost));
}
export function selectNextGeneration(results=[]){
 return results.map(x=>({...x,fitness:generationFitness(x)}))
  .sort((a,b)=>b.fitness-a.fitness).slice(0,4)
  .map(x=>({strategy:x.neo?.state?.plans?.[0]?.name||"OBSERVE",
   fitness:x.fitness,source_id:x.neo?.id}));
}
