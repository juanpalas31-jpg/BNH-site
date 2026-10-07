import { createServiceQuote } from "./atila-service-marketplace.js";
import { createPaymentRequest,verifyPayment } from "./atila-payment-gate.js";
import { createRentalInstance } from "../production/atila-rental-instance.js";

const clean=(v,n=160)=>String(v??"").trim().slice(0,n);

export function createOwnerPriceBook({owner_verified=false,version="1",prices={}}={}){
 if(!owner_verified)return{ok:false,state:"OWNER_PROOF_REQUIRED"};
 const normalized={};
 for(const [service,entry] of Object.entries(prices||{})){
  const amount=Number(entry?.amount);
  if(Number.isFinite(amount)&&amount>=0)normalized[service]={
   amount,currency:clean(entry.currency||"EUR",12).toUpperCase(),
   fiat:entry.fiat!==false,crypto:entry.crypto===true
  };
 }
 return{ok:true,protocol:"ATTILA_OWNER_PRICE_BOOK_V1",version:clean(version,40),prices:normalized};
}

export function offerFromPriceBook({book,service,months=1,payment_method="FIAT"}={}){
 if(!book?.ok)return{ok:false,state:"PRICE_BOOK_REQUIRED"};
 const p=book.prices?.[service];
 if(!p)return{ok:false,state:"SERVICE_NOT_PRICED_BY_OWNER"};
 if(payment_method==="CRYPTO"&&!p.crypto)return{ok:false,state:"CRYPTO_NOT_AUTHORIZED_FOR_SERVICE"};
 if(payment_method!=="CRYPTO"&&!p.fiat)return{ok:false,state:"FIAT_NOT_AUTHORIZED_FOR_SERVICE"};
 return createServiceQuote({
  service,months,pricing:{[service]:p.amount},currency:p.currency,payment_method
 });
}

export function startCheckout({offer,provider,destination_ref}={}){
 return createPaymentRequest({quote:offer,provider,destination_ref});
}

export function settleAndActivate({checkout,provider_evidence,offer,client,authorization,nano_policy}={}){
 const settlement=verifyPayment({request:checkout,provider_evidence});
 if(!settlement.ok)return{ok:false,state:"PAYMENT_REQUIRED",settlement};
 const instance=createRentalInstance({client,quote:offer,payment:settlement,authorization,nano_policy});
 return{
  ok:instance.ok,
  state:instance.ok?"PAID_MISSION_ACTIVATED":instance.state,
  settlement,
  instance,
  next:instance.ok?"CONTINUE_AUTHORIZED_MISSION":"STOP"
 };
}

export function commercialAutonomyPolicy(){
 return{
  parallel_client_instances:true,
  owner_controls_prices:true,
  may_quote:true,
  may_create_checkout:true,
  may_activate_after_verified_payment:true,
  may_continue_paid_mission:true,
  private_crypto_keys_in_attila:false,
  bank_credentials_in_attila:false,
  arbitrary_price_changes:false,
  unverified_payment_activation:false
 };
}
