const clean=(v,n=160)=>String(v??"").trim().slice(0,n);
const SERVICES=Object.freeze({
 FUNNEL:{label:"Tunnel de vente",unit:"MISSION"},
 WEBSITE:{label:"Site internet",unit:"MISSION"},
 LANDING_PAGE:{label:"Page internet",unit:"MISSION"},
 LEAD_ENGINE:{label:"Acquisition de prospects",unit:"MONTH"},
 SEO_GUARD:{label:"SEO + surveillance",unit:"MONTH"},
 FULL_MISSION:{label:"Attila mission complète",unit:"MONTH"}
});

export function serviceCatalog(){return SERVICES;}

export function createServiceQuote({service,months=1,pricing={},currency="EUR",payment_method="FIAT"}={}){
 if(!SERVICES[service])return{ok:false,state:"UNKNOWN_SERVICE"};
 const duration=Math.max(1,Math.min(Number(months)||1,12));
 const amount=Number(pricing[service]??0);
 if(!Number.isFinite(amount)||amount<0)return{ok:false,state:"VALID_PRICE_REQUIRED"};
 return{
  ok:true,protocol:"ATTILA_SERVICE_QUOTE_V1",
  service,label:SERVICES[service].label,months:duration,
  amount,currency:clean(currency,12).toUpperCase(),
  payment_method:payment_method==="CRYPTO"?"CRYPTO":"FIAT",
  price_authority:"OWNER_OR_CONFIGURED_CATALOG",
  quote_only:true
 };
}
