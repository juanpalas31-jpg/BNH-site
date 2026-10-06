export function vaultFundingGate(finance={}){
 const revenue=Number(finance.verifiedRevenue||0);
 const reserve=Number(finance.cashReserve||0);
 const purchaseBudget=Number(finance.purchaseBudget||0);
 const debtServiceSafe=finance.debtServiceSafe===true;
 const legalTaxReviewed=finance.legalTaxReviewed===true;

 return {
  metrics:{revenue,reserve,purchaseBudget},
  eligibleForPropertyDecision:
    revenue>0 && reserve>0 && purchaseBudget>0 && debtServiceSafe && legalTaxReviewed,
  automaticPurchase:false,
  reason:"Spider may measure readiness; a human makes the property decision."
 };
}
