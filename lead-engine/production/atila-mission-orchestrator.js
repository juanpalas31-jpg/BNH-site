const PHASES=["INTAKE","CONSENT","DISCOVERY","DESIGN","BUILD","TEST","APPROVAL","PUBLISH","GROW","GUARD","HANDOFF","CLOSE"];
const clean=(v,n=256)=>String(v??"").trim().slice(0,n);

export function createMissionState({mission_id="",client_id="",sector="",consent=false}={}){
 if(!mission_id||!client_id)return{ok:false,state:"MISSION_AND_CLIENT_REQUIRED"};
 return{
  ok:true,protocol:"ATTILA_MISSION_ORCHESTRATOR_V1",
  mission_id:clean(mission_id,128),client_id:clean(client_id,128),sector:clean(sector,120),
  phase:consent?"DISCOVERY":"CONSENT",consent:Boolean(consent),
  approvals:[],artifacts:[],evidence:[],blockers:[],nano:[],history:[],
  started_at:new Date().toISOString()
 };
}

export function nextMissionAction(state={}){
 if(!state.ok)return{ok:false,state:"MISSION_REQUIRED"};
 if(!state.consent)return{ok:false,state:"WAITING_CLIENT_CONSENT"};
 if(state.blockers?.length)return{ok:false,state:"BLOCKED",blockers:state.blockers};

 const map={
  DISCOVERY:"COLLECT_AUTHORIZED_BUSINESS_CONTEXT",
  DESIGN:"DESIGN_DOMAIN_BRAND_FUNNEL",
  BUILD:"GENERATE_SITE_FUNNEL_SEO_MEASUREMENT",
  TEST:"RUN_QA_AND_SECURITY_CHECKS",
  APPROVAL:"REQUEST_REQUIRED_HUMAN_APPROVALS",
  PUBLISH:"USE_AUTHORIZED_CONNECTORS",
  GROW:"RUN_APPROVED_ACQUISITION_PLAN",
  GUARD:"SPAWN_NANOTILA_GUARDIANS",
  HANDOFF:"DELIVER_CLIENT_ASSETS_AND_STATUS",
  CLOSE:"DISSOLVE_GUARDIANS_AND_RETURN_LEARNING"
 };
 return{ok:true,phase:state.phase,action:map[state.phase]||"WAIT"};
}

export function advanceMission(state={},evidence={}){
 if(!state.ok)return{ok:false,state:"MISSION_REQUIRED"};
 const i=PHASES.indexOf(state.phase);
 if(i<0||i===PHASES.length-1)return{...state,phase:"CLOSE"};
 if(evidence.verified!==true)return{...state,blockers:[...(state.blockers||[]),"VERIFIED_EVIDENCE_REQUIRED"]};
 return{
  ...state,
  phase:PHASES[i+1],
  evidence:[...(state.evidence||[]),evidence],
  history:[...(state.history||[]),{from:PHASES[i],to:PHASES[i+1],at:new Date().toISOString()}]
 };
}

export function addMissionApproval(state={},approval={}){
 if(!state.ok)return{ok:false,state:"MISSION_REQUIRED"};
 if(approval.approved!==true)return state;
 return{...state,approvals:[...(state.approvals||[]),{
  type:clean(approval.type,80),scope:clean(approval.scope,160),
  cap:Number.isFinite(Number(approval.cap))?Number(approval.cap):null,
  at:new Date().toISOString()
 }]};
}

export function missionDashboard(state={}){
 return{
  mission_id:state.mission_id,client_id:state.client_id,phase:state.phase,
  blockers:state.blockers||[],approvals:(state.approvals||[]).length,
  artifacts:(state.artifacts||[]).length,evidence:(state.evidence||[]).length,
  guardians:(state.nano||[]).length,next:nextMissionAction(state)
 };
}
