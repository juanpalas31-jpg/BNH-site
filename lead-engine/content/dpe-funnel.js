import { routeContentIntent } from "./intent-router.js";

export const DPE_EVENTS=[
  "article_view","content_engaged","assessment_cta_click","form_start","form_submit"
];

export function dpeFunnelSignal(event={}){
  if(!DPE_EVENTS.includes(event.type)) return {accepted:false,reason:"unknown_event"};
  const route=routeContentIntent({
    intent:event.intent,
    engaged:["content_engaged","assessment_cta_click","form_start","form_submit"].includes(event.type),
    owner:event.owner===true,
    local:event.local===true
  });
  return {
    accepted:true,
    cluster:"dpe",
    article:event.article||null,
    event:event.type,
    route,
    claims_policy:{
      official_source_required:true,
      dpe_gain_guaranteed:false,
      savings_guaranteed:false,
      bnh_assessment_is_regulatory_dpe:false
    }
  };
}
