export function dualTrackController({engineBacklog=[],contentBacklog=[],maxParallel=4}={}){
 const slots=Math.max(2,Number(maxParallel)||4);
 const engineSlots=Math.ceil(slots/2),contentSlots=slots-engineSlots;
 return {
  engine:engineBacklog.slice(0,engineSlots),
  content:contentBacklog.slice(0,contentSlots),
  policy:"NEVER_STARVE_EITHER_TRACK",
  publishAutomatically:false,
  mutateDNAAutomatically:false
 };
}
