const LEVELS=["legacy","current","advanced","unknown_future"];

export function adaptExperienceToEra({capabilities={},preferredLevel="current"}={}){
 const level=LEVELS.includes(preferredLevel)?preferredLevel:"current";
 const available=Object.entries(capabilities).filter(([,v])=>v===true).map(([k])=>k);
 return {
  level,
  available,
  preserveNarrativeOrder:true,
  preserveAuthenticatedFounderSource:true,
  mayUpgradeRendering:true,
  mayInventFounderStatements:false,
  fallback:["screen","audio","text"]
 };
}
