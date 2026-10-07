const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export function digest({inputs=[],energy=.5}={}){
 const useful=inputs.filter(x=>x?.validated===true),rejected=inputs.length-useful.length;
 const nutrition=C(useful.reduce((s,x)=>s+(Number(x.value)||0),0)/Math.max(1,inputs.length));
 return {organ:"DIGITAL_DIGESTION",accepted:useful.length,rejected,nutrition,
  energy_after:C(energy+.18*nutrition),waste:rejected};
}
export function excrete({temporary=[],expired=[],duplicates=[]}={}){
 const candidates=[...temporary,...expired,...duplicates];
 return {organ:"DIGITAL_EXCRETION",candidates:candidates.length,
  action:"MARK_FOR_SAFE_CLEANUP",automatic_destructive_delete:false,
  reclaim_estimate:Math.min(1,candidates.length/100)};
}
