const REQUIRED=["ancestral_genome","dna_manifest","instincts","behavioral_states","organ_registry","reconstruction_plan","integrity","lineage"];

export function validateEmbryo(manifest={},availableComponents=[]){
 const ids=new Set((manifest.required_components||[]).map(x=>x.id));
 const available=new Set(availableComponents);
 const schemaMissing=REQUIRED.filter(x=>!ids.has(x));
 const payloadMissing=REQUIRED.filter(x=>!available.has(x));
 const invariants=Array.isArray(manifest.invariants)?manifest.invariants:[];
 return {
  schema_valid:schemaMissing.length===0,
  payload_complete:payloadMissing.length===0,
  schema_missing:schemaMissing,
  payload_missing:payloadMissing,
  invariant_count:invariants.length,
  reconstructible:schemaMissing.length===0&&payloadMissing.length===0,
  automatic_execution:false
 };
}
