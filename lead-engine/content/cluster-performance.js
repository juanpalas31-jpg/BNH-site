const n=v=>Math.max(0,Number(v)||0);

export function clusterPerformance(row={}){
  const views=n(row.views), engaged=n(row.engaged), cta=n(row.cta_clicks),
    forms=n(row.form_submits), appointments=n(row.appointments),
    sales=n(row.sales), revenue=n(row.revenue);
  return {
    cluster:row.cluster||"unknown",views,engaged,cta_clicks:cta,form_submits:forms,
    appointments,sales,revenue,
    engagement_rate:views?engaged/views:0,
    cta_rate:engaged?cta/engaged:0,
    lead_rate:views?forms/views:0,
    appointment_rate:forms?appointments/forms:0,
    sale_rate:appointments?sales/appointments:0,
    revenue_per_view:views?revenue/views:0
  };
}

export function rankClusters(rows=[]){
  return rows.map(clusterPerformance).sort((a,b)=>
    b.revenue_per_view-a.revenue_per_view ||
    b.appointment_rate-a.appointment_rate ||
    b.lead_rate-a.lead_rate
  );
}
