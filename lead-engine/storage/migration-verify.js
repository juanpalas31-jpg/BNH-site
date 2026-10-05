function indexBy(records,key){return new Map(records.filter(r=>r?.[key]).map(r=>[r[key],r]));}

export function compareStores({legacy=[],candidate=[],idField,fields=[]}){
  const a=indexBy(legacy,idField), b=indexBy(candidate,idField);
  const missing=[...a.keys()].filter(id=>!b.has(id));
  const unexpected=[...b.keys()].filter(id=>!a.has(id));
  const mismatches=[];

  for(const [id,left] of a){
    const right=b.get(id); if(!right) continue;
    const changed=fields.filter(f=>String(left?.[f]??'')!==String(right?.[f]??''));
    if(changed.length) mismatches.push({id,fields:changed});
  }

  return {
    ok:missing.length===0&&unexpected.length===0&&mismatches.length===0,
    legacy_count:legacy.length,candidate_count:candidate.length,
    missing_ids:missing,unexpected_ids:unexpected,field_mismatches:mismatches
  };
}

export function migrationGate({leadCheck,eventCheck,health,restore,isolation}){
  const checks={health:Boolean(health?.ok),leads:Boolean(leadCheck?.ok),events:Boolean(eventCheck?.ok),restore:Boolean(restore?.ok),isolation:Boolean(isolation?.ok)};
  return {ready:Object.values(checks).every(Boolean),checks};
}
