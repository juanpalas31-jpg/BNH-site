export function threadPulse({impressions=0,clicks=0,engaged=0,forms=0,appointments=0,sales=0}={}){
 const i=Number(impressions),c=Number(clicks),e=Number(engaged),f=Number(forms),a=Number(appointments),s=Number(sales);
 const ctr=i?c/i:0;
 const engagement=c?e/c:0;
 return {
  impressions:i,clicks:c,engaged:e,forms:f,appointments:a,sales:s,
  ctr:Number(ctr.toFixed(4)),
  engagement:Number(engagement.toFixed(4)),
  state:s?"CAPTURE":f||a?"COLLAGE":c||e?"VIBRATION":i?"THREAD_DETECTED":"SILENT",
  next:s?"reinforce":i&&!c?"improve_search_match":c&&!e?"improve_content_match":e&&!f?"improve_bridge_to_assessment":"collect_more_signal"
 };
}
