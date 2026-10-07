const text=(v,n=256)=>String(v??"").trim().slice(0,n);

export function createTurnkeyMission({owner_verified=false,client_consent=false,client={},budget={},term={}}={}){
 if(!owner_verified)return{ok:false,state:"OWNER_PROOF_REQUIRED"};
 if(!client_consent)return{ok:false,state:"CLIENT_CONSENT_REQUIRED"};
 const adCap=Math.max(0,Number(budget.ads_max||0));
 const domainCap=Math.max(0,Number(budget.domain_max||0));
 return{
  ok:true,
  protocol:"ATTILA_TURNKEY_CLIENT_MISSION_V1",
  client:{id:text(client.id,128),sector:text(client.sector,120),region:text(client.region,120)},
  financial_authority:{domain_max:domainCap,ads_max:adCap,currency:text(budget.currency||"EUR",8),open_ended_spend:false},
  lifecycle:[
   "BUSINESS_DISCOVERY","DOMAIN_IDEATION","DOMAIN_AVAILABILITY_CHECK",
   "DOMAIN_PURCHASE_GATE","SITE_OR_FUNNEL_BUILD","SEO_FOUNDATION",
   "ANALYTICS_AND_CONVERSION_SETUP","AD_PLAN","AD_SPEND_GATE",
   "PUBLISH","VERIFY","HANDOFF","GUARDIAN_PHASE","GUARDIAN_DISSOLUTION"
  ],
  external_confirmation:{captcha:"HUMAN_IF_REQUIRED",two_factor:"HUMAN_IF_REQUIRED",bank_confirmation:"HUMAN_IF_REQUIRED"},
  credentials:{discover:false,retain_after_mission:false},
  term:{guardian_days:Math.max(0,Math.min(Number(term.guardian_days||7),366))}
 };
}

export function domainDecision({mission,candidates=[]}={}){
 if(!mission?.ok)return{ok:false,state:"MISSION_REQUIRED"};
 return{
  ok:true,
  candidates:candidates.slice(0,12).map(x=>({
   domain:text(x.domain,253),
   available:x.available===true,
   price:Number(x.price||0),
   within_cap:Number(x.price||0)<=mission.financial_authority.domain_max
  })),
  purchase_requires:["REGISTRAR_CONNECTOR","AVAILABLE_DOMAIN","WITHIN_APPROVED_CAP"]
 };
}

export function adExecutionPlan({mission,channels=[],daily_budget=0}={}){
 if(!mission?.ok)return{ok:false,state:"MISSION_REQUIRED"};
 const daily=Math.max(0,Number(daily_budget||0));
 return{
  ok:daily<=mission.financial_authority.ads_max,
  channels:channels.slice(0,8).map(x=>text(x,80)),
  daily_budget:daily,
  maximum_authorized:mission.financial_authority.ads_max,
  no_budget_overrun:true,
  measurement_required:true,
  pause_on_tracking_failure:true
 };
}

export function spawnClientGuardians({mission}={}){
 if(!mission?.ok)return{ok:false,state:"MISSION_REQUIRED"};
 return{
  ok:true,
  protocol:"NANOTILA_GUARDIAN_V1",
  ttl_days:mission.term.guardian_days,
  workers:[
   {id:"NANO-UPTIME",task:"UPTIME_AND_HEALTH"},
   {id:"NANO-FUNNEL",task:"FORM_AND_FUNNEL_QA"},
   {id:"NANO-SEO",task:"SEO_HEALTH_AND_INDEXABILITY"},
   {id:"NANO-ADS",task:"AD_TRACKING_AND_BUDGET_GUARD"},
   {id:"NANO-LEADS",task:"LEAD_PIPELINE_HEALTH"}
  ],
  client_scope_only:true,
  destructive_actions:false,
  arbitrary_spend:false
 };
}

export function dissolveGuardians({guardians,summary={}}={}){
 if(!guardians?.ok)return{ok:false,state:"GUARDIANS_REQUIRED"};
 return{
  ok:true,state:"DISSOLVED",
  runtime_removed:true,
  temporary_access_revoked:true,
  return_to_attila:{
   structural_learning:true,
   aggregate_metrics:summary.aggregate_metrics||{},
   client_credentials:false,
   raw_leads:false,
   customer_pii:false
  },
  preserve_client_assets:true,
  preserve_legitimate_logs:true
 };
}
