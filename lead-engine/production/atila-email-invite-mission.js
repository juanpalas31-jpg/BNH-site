const clean=(v,n=256)=>String(v??"").trim().slice(0,n);
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||""));

export function createEmailMissionInvitation({owner_verified=false,email="",mission={}}={}){
 if(!owner_verified)return{ok:false,state:"OWNER_PROOF_REQUIRED"};
 if(!emailOk(email))return{ok:false,state:"VALID_EMAIL_REQUIRED"};
 return{
  ok:true,
  protocol:"ATTILA_EMAIL_INVITE_V1",
  recipient:clean(email,254),
  mission:{
   type:"AUTHORIZED_SALES_FUNNEL_BUILD",
   sector:clean(mission.sector||"espaces verts",120),
   objective:clean(mission.objective||"create sales funnel",256)
  },
  state:"INVITATION_ONLY",
  grants_network_access:false,
  grants_device_access:false,
  requires_recipient_consent:true
 };
}

export function acceptMission({invitation,recipient_consent=false,connector={}}={}){
 if(!invitation?.ok||!recipient_consent)return{ok:false,state:"RECIPIENT_CONSENT_REQUIRED"};
 if(!connector?.authorized)return{ok:false,state:"AUTHORIZED_CONNECTOR_REQUIRED"};
 return{
  ok:true,
  protocol:"ATTILA_REMOTE_FUNNEL_MISSION_V1",
  scope:{
   target_id:clean(connector.target_id,128),
   capabilities:Array.isArray(connector.capabilities)?connector.capabilities.slice(0,32):[]
  },
  team:["ATTILA","NANOTILA"],
  spider_engine:true,
  stages:[
   "DISCOVER_AUTHORIZED_BUSINESS_CONTEXT",
   "DESIGN_FUNNEL",
   "GENERATE_PAGES",
   "GENERATE_EDITORIAL_PLAN",
   "CONFIGURE_MEASUREMENT",
   "TEST",
   "REQUEST_PUBLICATION_GATE",
   "VERIFY",
   "OBSERVE",
   "RETURN_HOME"
  ],
  boundaries:{
   email_is_transport_not_access:true,
   no_security_bypass:true,
   no_privilege_escalation:true,
   no_lateral_movement:true,
   no_credential_discovery:true
  }
 };
}

export function spawnNanoTilaFunnelTeam({mission}={}){
 if(!mission?.ok)return{ok:false,state:"AUTHORIZED_MISSION_REQUIRED"};
 return{
  ok:true,
  workers:[
   {id:"NANO-SEO",task:"KEYWORDS_AND_LOCAL_INTENT"},
   {id:"NANO-EDITOR",task:"ARTICLES_AND_LANDING_COPY"},
   {id:"NANO-FUNNEL",task:"FUNNEL_STRUCTURE_AND_CTA"},
   {id:"NANO-MEASURE",task:"EVENTS_AND_CONVERSION_MEASUREMENT"},
   {id:"NANO-QA",task:"LINKS_FORMS_AND_CONTENT_QA"}
  ],
  coordinator:"ATTILA",
  engine:"SPIDER_ENGINE",
  ephemeral:true,
  target_scope_only:true
 };
}

export function closeRemoteMission({mission,result={}}={}){
 if(!mission?.ok)return{ok:false,state:"AUTHORIZED_MISSION_REQUIRED"};
 return{
  ok:true,state:"RETURN_HOME",
  result:{built:Boolean(result.built),tested:Boolean(result.tested),published:Boolean(result.published),verified:Boolean(result.verified)},
  revoke_temporary_access:true,
  preserve_legitimate_logs:true,
  retain_target_credentials:false,
  retain_customer_data:false,
  structural_learning_only:true
 };
}
