const clean=(v,n=160)=>String(v??"").trim().slice(0,n);

export function createRentalInstance({client={},quote,payment,authorization={},nano_policy={}}={}){
 if(!quote?.ok)return{ok:false,state:"QUOTE_REQUIRED"};
 if(!payment?.ok)return{ok:false,state:"VERIFIED_PAYMENT_REQUIRED"};
 if(authorization.client_consent!==true)return{ok:false,state:"CLIENT_CONSENT_REQUIRED"};
 const started=new Date();
 const expires=new Date(started);
 expires.setUTCMonth(expires.getUTCMonth()+quote.months);
 return{
  ok:true,protocol:"ATTILA_RENTAL_INSTANCE_V1",
  instance_id:"atila-client-"+clean(client.id||Date.now(),80),
  client:{id:clean(client.id,128),sector:clean(client.sector,120)},
  service:quote.service,
  isolation:"CLIENT_SCOPED",
  spider_engine:true,
  attila_profile:"MISSION_INSTANCE",
  nano:{
   enabled:true,
   ephemeral:true,
   roles:nano_policy.roles||["UPTIME","FUNNEL_QA","SEO_HEALTH","MEASUREMENT","LEAD_PIPELINE"]
  },
  lease:{started_at:started.toISOString(),expires_at:expires.toISOString(),months:quote.months},
  permissions:{
   client_consent:true,
   target_scope_only:true,
   spend_only_with_explicit_cap:true,
   no_privilege_escalation:true,
   no_security_bypass:true
  },
  exit:{
   revoke_temporary_access:true,
   dissolve_nano:true,
   remove_client_runtime:true,
   preserve_client_assets:true,
   return_structural_learning:true,
   return_credentials:false,
   return_raw_customer_data:false
  }
 };
}

export function rentalStatus(instance,now=new Date()){
 if(!instance?.ok)return{ok:false,state:"INSTANCE_REQUIRED"};
 const expired=now>=new Date(instance.lease.expires_at);
 return{ok:true,state:expired?"EXPIRED":"ACTIVE",expires_at:instance.lease.expires_at,
  action:expired?"CLOSE_AND_DISSOLVE":"CONTINUE_AUTHORIZED_MISSION"};
}
