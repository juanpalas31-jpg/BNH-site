// Pure Bamak Event fleet health assessment. No network or device commands.
const STATES=Object.freeze({HEALTHY:"HEALTHY",DEGRADED:"DEGRADED",OFFLINE:"OFFLINE",UNKNOWN:"UNKNOWN"});
export function assessBamakFleet(inspection){
 if(inspection?.project!=="bamak-event"||inspection?.status!=="READ_ONLY"||!Array.isArray(inspection.booths))
  return Object.freeze({status:"INSPECTION_REQUIRED",health:STATES.UNKNOWN,alerts:[],summary:null});
 const booths=inspection.booths;
 const alerts=booths.filter(b=>b?.reachable!==true).map(b=>Object.freeze({
  boothId:String(b?.id??"").slice(0,128),severity:"WARNING",code:"BOOTH_UNREACHABLE"
 }));
 const healthy=booths.filter(b=>b?.reachable===true).length;
 const health=booths.length===0?STATES.UNKNOWN:healthy===booths.length?STATES.HEALTHY:healthy===0?STATES.OFFLINE:STATES.DEGRADED;
 return Object.freeze({status:"ASSESSED",health,alerts,summary:Object.freeze({
  total:booths.length,reachable:healthy,unreachable:booths.length-healthy
 }),requiresHumanReview:alerts.length>0,commandsSent:0});
}
