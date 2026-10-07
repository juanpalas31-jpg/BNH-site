export function createPaymentRequest({quote,provider="",destination_ref=""}={}){
 if(!quote?.ok)return{ok:false,state:"VALID_QUOTE_REQUIRED"};
 if(!provider)return{ok:false,state:"PAYMENT_PROVIDER_REQUIRED"};
 return{
  ok:true,protocol:"ATTILA_PAYMENT_GATE_V1",
  provider:String(provider).slice(0,80),
  destination_ref:String(destination_ref).slice(0,160),
  amount:quote.amount,currency:quote.currency,
  method:quote.payment_method,
  status:"PENDING",
  stores_private_key:false,
  stores_bank_credentials:false
 };
}

export function verifyPayment({request,provider_evidence={}}={}){
 if(!request?.ok)return{ok:false,state:"PAYMENT_REQUEST_REQUIRED"};
 const paid=provider_evidence.status==="PAID"&&
  Number(provider_evidence.amount)===Number(request.amount)&&
  String(provider_evidence.currency).toUpperCase()===String(request.currency).toUpperCase();
 return{
  ok:paid,
  state:paid?"PAYMENT_VERIFIED":"PAYMENT_NOT_VERIFIED",
  provider_reference:paid?String(provider_evidence.reference||"").slice(0,160):null
 };
}
