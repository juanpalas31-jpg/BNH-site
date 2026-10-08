/** Spider Engine / Attila Habitat: private real-estate research, no autonomous transactions. */
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const money=x=>Math.round(x*100)/100;
export const HABITAT_DNA=Object.freeze({module:'ATTILA_HABITAT',ecosystem:'SPIDER_ENGINE',role:'FAMILY_NEST_AND_RENTAL_RESEARCH',mode:'RESEARCH_ONLY',livePurchases:false,autonomousOffers:false,ownerApprovalRequired:true,tenantPrivacyRequired:true,inheritance:'INDIVIDUAL_ESTATE_RULES',scouts:'NANO_TILA',searchData:'AUTHORIZED_SOURCES_ONLY'});
/** Conservative annual projection; inputs must be supplied, not invented. */
export function evaluateProperty(p){
 const required=['askingPrice','acquisitionCosts','renovationBudget','annualRent','annualPropertyTax','annualInsurance','annualMaintenance','annualOtherCosts','vacancyRate','managementRate','annualDebtService'];
 if(required.some(k=>!finite(p?.[k])||p[k]<0))throw Error('Missing or invalid financial inputs: '+required.filter(k=>!finite(p?.[k])||p[k]<0).join(','));
 if(p.askingPrice<=0||p.vacancyRate>1||p.managementRate>1)throw Error('Invalid price or percentage');
 const totalCost=p.askingPrice+p.acquisitionCosts+p.renovationBudget;
 const effectiveRent=p.annualRent*(1-p.vacancyRate);
 const management=effectiveRent*p.managementRate;
 const operatingCosts=p.annualPropertyTax+p.annualInsurance+p.annualMaintenance+p.annualOtherCosts+management;
 const netOperatingIncome=effectiveRent-operatingCosts;
 const annualCashFlow=netOperatingIncome-p.annualDebtService;
 const grossYield=p.annualRent/totalCost;
 const netYield=netOperatingIncome/totalCost;
 const coverage=p.annualDebtService>0?netOperatingIncome/p.annualDebtService:null;
 const missingChecks=['financing','zoning','tenant_safety','building_condition','energy_performance','local_rental_rules','taxation','ownership_structure'].filter(k=>p.checks?.[k]!=='VERIFIED');
 const riskFlags=[];
 if(annualCashFlow<0)riskFlags.push('NEGATIVE_CASH_FLOW');
 if(netYield<=0)riskFlags.push('NO_NET_YIELD');
 if(coverage!==null&&coverage<1.2)riskFlags.push('LOW_DEBT_COVERAGE');
 if(p.vacancyRate>=0.15)riskFlags.push('HIGH_VACANCY');
 if(missingChecks.length)riskFlags.push('DUE_DILIGENCE_INCOMPLETE');
 const habitatScore=Math.max(0,100-20*riskFlags.length);
 return {id:String(p.id||'UNKNOWN').slice(0,80),mode:'RESEARCH_ONLY',totalAcquisitionCost:money(totalCost),annualEffectiveRent:money(effectiveRent),annualOperatingCosts:money(operatingCosts),annualNetOperatingIncome:money(netOperatingIncome),annualDebtService:money(p.annualDebtService),annualCashFlowBeforeIncomeTax:money(annualCashFlow),grossYield,netYield,debtCoverage:coverage,habitatScore,riskFlags,missingChecks,decision:missingChecks.length?'VERIFY_FIRST':riskFlags.length?'REVIEW_RISK':'HUMAN_REVIEW',offerAuthorized:false,disclaimer:'Projection, not a valuation, loan approval, or guarantee of rental income. Income taxes, resale and capital gains excluded.'};
}
export function scoutListing(listing){
 const fields=['source','url','location','price','surfaceM2','units'];
 const missing=fields.filter(k=>listing?.[k]===undefined||listing[k]===null||listing[k]==='');
 const sourceUrl=String(listing?.url||'');
 const authorized=/^https:\/\//.test(sourceUrl);
 return {id:String(listing?.id||'UNKNOWN'),species:'NANO_TILA',mission:'FIND_FAMILY_NEST',source:listing?.source||null,sourceUrl:authorized?sourceUrl:null,location:listing?.location||null,missing,canEvaluate:missing.length===0&&authorized,action:missing.length||!authorized?'REQUEST_VERIFICATION':'QUEUE_DUE_DILIGENCE',purchaseAllowed:false};
}
export function defineNestRequirements({city='Toulouse',familyHome=true,privateOffice=true,rentalUnits=true,budgetCeiling=null}={}){
 return {habitat:'FAMILY_NEST',searchArea:city,features:{familyHome,privateOffice,rentalUnits,separateAccess:true,tenantSafety:true,privacyAndLegalCompliance:true},budgetCeiling:finite(budgetCeiling)&&budgetCeiling>0?budgetCeiling:null,status:'SEARCH_SPECIFICATION',noAutonomousPurchases:true};
}
