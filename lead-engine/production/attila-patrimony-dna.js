/** Spider Engine / Attila: executable patrimony decision DNA. No personal history is stored here. */
export const PATRIMONY_DNA=Object.freeze({
 version:1,mode:'RESEARCH_ONLY',priorities:['FAMILY_HOUSING_STABILITY','PERSONAL_FINANCIAL_RECOVERY','PROFESSIONAL_NEST'],
 housing:{purchaseMayProceedIndependently:true,ownershipNeverInferredFromContributions:true,subsequentPacsDoesNotAutomaticallyTransferTitle:true,notarialReviewRecommended:true},
 finance:{useVerifiedNetCashFlow:true,protectEmergencyReserve:true,doNotBorrowOnProjectedRevenue:true},
 headquarters:{stages:['ORIGIN_NEST','RENTED_GROWTH_NEST','OWNED_HEADQUARTERS'],purchaseRequiresVerifiedAffordability:true},
 safeguards:{noPropertyPurchase:true,noTransfers:true,noLegalAdviceAutomation:true,noPersonalDataInSource:true}
});
export function assessPatrimony(input={}){
 const cash=Number(input.monthlyVerifiedFreeCashFlow);
 const reserve=Number(input.emergencyReserveMonths);
 const validCash=Number.isFinite(cash)&&cash>=0&&input.monthlyVerifiedFreeCashFlow!==undefined;
 const validReserve=Number.isFinite(reserve)&&reserve>=0&&input.emergencyReserveMonths!==undefined;
 const stage=validCash&&cash>0&&validReserve&&reserve>=3?'PREPARE_SAVINGS_PLAN':'STABILIZE_AND_VERIFY';
 return {mode:'RESEARCH_ONLY',stage,priorities:PATRIMONY_DNA.priorities,
  housing:'REVIEW_OWNERSHIP_AND_CONTRIBUTIONS_WITH_NOTARY',
  headquarters:'NO_PURCHASE_AUTHORIZATION',
  evidence:{cashFlowVerified:validCash,reserveVerified:validReserve},
  nextActions:stage==='PREPARE_SAVINGS_PLAN'?['DOCUMENT_CONTRIBUTIONS','MAINTAIN_RESERVE','MODEL_LONG_TERM_HEADQUARTERS']:['VERIFY_DEBTS','VERIFY_NET_CASH_FLOW','DOCUMENT_CONTRIBUTIONS'],
  executedExternalAction:false};
}
