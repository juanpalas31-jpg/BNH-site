export function prioritizeThreads(rows=[]){
 return [...rows].map(row=>{
  const qualified=Number(row.qualifiedLeads||0);
  const appointments=Number(row.appointments||0);
  const quotes=Number(row.quotes||0);
  const sales=Number(row.sales||0);
  const revenue=Number(row.verifiedRevenue||0);
  const evidence=qualified+appointments+quotes+sales;
  const value=(qualified*4)+(appointments*8)+(quotes*12)+(sales*25)+Math.min(revenue/100,50);
  return {...row,evidence,value:Number(value.toFixed(2))};
 }).sort((a,b)=>b.value-a.value);
}

export function nextThreadAction(row={}){
 if(Number(row.sales||0)>0) return "reinforce_verified_winner";
 if(Number(row.quotes||0)>0) return "improve_close";
 if(Number(row.appointments||0)>0) return "improve_quote_path";
 if(Number(row.qualifiedLeads||0)>0) return "improve_booking";
 return "increase_high_intent_entries";
}
