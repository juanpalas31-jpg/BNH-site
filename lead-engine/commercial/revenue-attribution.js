export function attributeRevenue({saleId,leadId,threadId,amount,verified=false}={}){
 if(!saleId||!leadId||!threadId) throw new Error("sale_lead_thread_required");
 const value=Number(amount||0);
 return {
  saleId,leadId,threadId,
  amount:value>0?value:0,
  verified:verified===true&&value>0,
  attributionModel:"direct_verified_thread",
  synthetic:false
 };
}

export function aggregateThreadRevenue(rows=[]){
 return Object.values(rows.filter(r=>r?.verified).reduce((acc,r)=>{
  const k=r.threadId;
  acc[k]??={threadId:k,sales:0,verifiedRevenue:0};
  acc[k].sales+=1;
  acc[k].verifiedRevenue+=Number(r.amount||0);
  return acc;
 },{})).sort((a,b)=>b.verifiedRevenue-a.verifiedRevenue);
}
