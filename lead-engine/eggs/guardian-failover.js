export function resolveGuardian(guardians=[],statusByRef={}){
  const ordered=[...guardians].sort((a,b)=>(a.priority||999)-(b.priority||999));
  for(const g of ordered){
    const s=statusByRef[g.guardian_ref]||"unknown";
    if(s==="verified_available") return {guardian_ref:g.guardian_ref,status:"ready"};
  }
  return {guardian_ref:null,status:"no_verified_guardian",requires_external_recovery:true};
}

export function canDeliverEgg(input={}){
  const checks={
    guardian_authorized:input.guardian_authorized===true,
    recipient_verified:input.recipient_verified===true,
    milestone_reached:input.milestone_reached===true,
    integrity_verified:input.integrity_verified===true,
    legal_clearance:input.legal_clearance===true,
    recipient_consent:input.recipient_consent===true
  };
  return {allowed:Object.values(checks).every(Boolean),checks};
}
