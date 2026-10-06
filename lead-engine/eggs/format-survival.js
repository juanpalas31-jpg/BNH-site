/**
 * Long-horizon survivability scoring.
 * Prefers self-describing, documented, redundant representations over opaque compression.
 */
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,Number(n)||0));

export function formatSurvivalScore(asset={}){
  const documented=clamp(asset.documented);
  const open=clamp(asset.open_specification);
  const redundancy=clamp(asset.redundant_representations);
  const integrity=clamp(asset.integrity_protected);
  const dependencyRisk=clamp(asset.proprietary_dependency_risk);
  const score=(documented*.30)+(open*.25)+(redundancy*.20)+(integrity*.20)+((1-dependencyRisk)*.05);
  return {score,grade:score>=.85?"strong":score>=.65?"acceptable":"fragile"};
}

export function survivalRecommendations(asset={}){
  const r=[];
  if(!asset.documented) r.push("add_human_readable_specification");
  if(!asset.open_specification) r.push("add_open_or_plain_representation");
  if(!asset.redundant_representations) r.push("create_independent_representation");
  if(!asset.integrity_protected) r.push("add_checksum_and_manifest");
  if((asset.proprietary_dependency_risk||0)>.5) r.push("reduce_vendor_dependency");
  return r;
}
