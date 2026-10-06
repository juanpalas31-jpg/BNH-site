const INHERITABLE=[
 "modularity","repairability","sensor_fusion","human_control",
 "privacy","portability","fail_safe_design","lineage_traceability"
];

export function inheritArmorGenome(parent={},recipientChoices={}){
 const dna={};
 for(const key of INHERITABLE){
   if(parent[key]!==undefined) dna[key]=parent[key];
 }
 return {
   inherited:dna,
   chosen:recipientChoices,
   finalFormPredetermined:false,
   recipientAgency:true
 };
}

export function armorLineageNode({armorId,parentArmorId,generation,designRef}={}){
 return {
   armorId,parentArmorId:parentArmorId||null,generation,
   designRef:designRef||null,
   historicalRecord:true,
   mayOverwriteAncestor:false
 };
}
