export function cashEngine({verifiedRevenue=0,directCosts=0,reinvestmentCap=.2}={}){
 const revenue=Math.max(0,Number(verifiedRevenue));
 const costs=Math.max(0,Number(directCosts));
 const contribution=Math.max(0,revenue-costs);
 const cap=Math.min(.5,Math.max(0,Number(reinvestmentCap)));
 return {
  revenue,costs,contribution,
  maxSuggestedReinvestment:Number((contribution*cap).toFixed(2)),
  propertyCapitalCandidate:Number((contribution*(1-cap)).toFixed(2)),
  automaticTransfer:false,
  note:"Planning signal only; accounting, tax and legal treatment remain external."
 };
}
