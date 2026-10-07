import {randomUUID,createHash} from "node:crypto";
const H=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");

export function compileNeoAtila({role="OBSERVER",target_fingerprint,ttl=3}={}){
 const genome=Object.freeze({
  cycle:["SENSE","MODEL","PLAN","ACT_SAFE","LEARN","DECAY"],
  doctrine:"SURROUND_ANALYZE_CONTAIN",
  mutation_scope:"STRATEGY_ONLY",
  privilege_escalation:false,
  owner_secret_access:false,
  outbound_retaliation:false
 });
 return {
  id:"NEO-ATILA-"+randomUUID(),kind:"NESTED_DIGITAL_ARACHNID",
  role,target_fingerprint,ttl_cycles:Math.max(1,Math.min(8,ttl)),
  genome_hash:H(genome),genome,state:{phase:"SENSE",age:0,alive:true,observations:[],plans:[]}
 };
}

export function runInnerCycle(neo,input={}){
 if(!neo?.state?.alive)return {...neo};
 const n={...neo,state:{...neo.state}};
 const obs={fingerprint:H({pattern:input.pattern,type:input.type,effect:input.effect}),
  risk:Number(input.risk)||0,recommendation:input.recommendation||null};
 n.state.observations=[...(n.state.observations||[]),obs].slice(-16);
 const plans=[
  {name:"ISOLATE",weight:.95-(obs.risk*.05)},
  {name:"STARVE",weight:.88},
  {name:"DECOY",weight:.74},
  {name:"RESET",weight:.69}
 ].sort((a,b)=>b.weight-a.weight);
 n.state.plans=plans;n.state.phase="ACT_SAFE";n.state.age=(n.state.age||0)+1;
 n.ttl_cycles-=1;
 if(n.ttl_cycles<=0){n.state.alive=false;n.state.phase="DISSOLVE";}
 return n;
}

export function forkInnerCode(parent,count=3){
 if(!parent?.state?.alive)return [];
 return Array.from({length:Math.max(1,Math.min(12,count))},(_,i)=>{
  const child=compileNeoAtila({role:["OBSERVER","ANALYST","DECOY","CHECKER"][i%4],
   target_fingerprint:parent.target_fingerprint,ttl:Math.max(1,parent.ttl_cycles)});
  return {...child,parent_id:parent.id,generation:(parent.generation||0)+1,
   inherited_genome_hash:parent.genome_hash};
 });
}

export function dissolveInnerCode(neo){
 return {...neo,genome:null,state:{phase:"DISSOLVED",age:neo?.state?.age||0,
  alive:false,observations:[],plans:[]},credentials:null,volatile_memory_cleared:true};
}
