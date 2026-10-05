export function operationalMetrics({leads=[],events=[],errors=[]}={}){
  const now=Date.now(), hour=3600000;
  const recent=(rows)=>rows.filter(r=>{const t=Date.parse(r.received_at||r.created_at||'');return Number.isFinite(t)&&now-t<=hour;});
  const recentLeads=recent(leads), recentEvents=recent(events), recentErrors=recent(errors);
  return {
    generated_at:new Date().toISOString(),
    leads_total:leads.length,events_total:events.length,
    leads_last_hour:recentLeads.length,events_last_hour:recentEvents.length,
    errors_last_hour:recentErrors.length,
    error_rate_last_hour:(recentLeads.length+recentEvents.length+recentErrors.length)?recentErrors.length/(recentLeads.length+recentEvents.length+recentErrors.length):0
  };
}

export function healthFromMetrics(m,{max_error_rate=0.05}={}){
  return {ok:Number(m?.error_rate_last_hour||0)<=max_error_rate,threshold:max_error_rate,observed:Number(m?.error_rate_last_hour||0)};
}
