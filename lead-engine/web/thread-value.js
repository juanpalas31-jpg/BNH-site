const safe=(n)=>Math.max(0,Number(n)||0);

export function threadValue(m={}){
  const visits=safe(m.visits), qualified=safe(m.qualified), appointments=safe(m.appointments), sales=safe(m.sales), revenue=safe(m.revenue);
  const qualification_rate=visits?qualified/visits:0;
  const appointment_rate=qualified?appointments/qualified:0;
  const sale_rate=appointments?sales/appointments:0;
  const revenue_per_visit=visits?revenue/visits:0;
  return {visits,qualified,appointments,sales,revenue,qualification_rate,appointment_rate,sale_rate,revenue_per_visit};
}

export function compareThreads(items=[]){
  return items.map(x=>({id:x.id,...threadValue(x.metrics)}))
    .sort((a,b)=>b.revenue_per_visit-a.revenue_per_visit||b.qualification_rate-a.qualification_rate);
}
