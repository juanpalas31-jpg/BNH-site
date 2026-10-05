/**
 * Spider proprioception.
 * Gives the organism an explicit inventory of what it can actually sense/do,
 * preventing imagined capabilities and unsafe actions.
 */

export function capabilityMap(modules=[]){
  const map={};
  for(const m of modules){
    if(!m?.name) continue;
    map[m.name]={
      available:m.available===true,
      verified:m.verified===true,
      mode:m.mode||'unknown',
      last_verified_at:m.last_verified_at||null
    };
  }
  return map;
}

export function canExecute(capabilities={},requirements=[]){
  const missing=[];
  const unverified=[];
  for(const name of requirements){
    const c=capabilities[name];
    if(!c?.available) missing.push(name);
    else if(!c?.verified) unverified.push(name);
  }
  return {
    allowed:missing.length===0&&unverified.length===0,
    missing,
    unverified,
    decision:missing.length?'capability_missing':unverified.length?'verification_required':'capability_verified'
  };
}

export function selfModel({dna_version=null,tenant_id=null,project_id=null,modules=[]}={}){
  const capabilities=capabilityMap(modules);
  return {
    dna_version,tenant_id,project_id,
    capabilities,
    available_count:Object.values(capabilities).filter(x=>x.available).length,
    verified_count:Object.values(capabilities).filter(x=>x.available&&x.verified).length,
    rule:'never_claim_or_execute_unverified_capability'
  };
}
