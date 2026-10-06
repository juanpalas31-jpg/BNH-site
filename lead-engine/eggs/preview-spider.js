/**
 * Preview Spider exposes capability descriptions and simulations only.
 * It grants no lineage authority, assets, secrets, customer data or control.
 */
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,Number(n)||0));

export function previewSession({guardian_mission_active=false,years_completed=0,integrity_ok=true,misuse_detected=false}={}){
  const years=clamp(years_completed,0,10);
  if(!integrity_ok||misuse_detected) return {
    mode:"terminated",
    access:"none",
    route:"seal_and_fallback",
    revoke_preview:true,
    destructive_action:false
  };
  if(!guardian_mission_active) return {mode:"locked",access:"none",destructive_action:false};
  return {
    mode:"preview",
    access:"simulation_only",
    progress:years/10,
    may_show:["capability_map","historical_story","safe_simulations","mission_progress"],
    never_show:["private_keys","recipient_identity","customer_data","financial_assets","unsealing_material"],
    ownership_granted:false,
    lineage_authority:false,
    destructive_action:false
  };
}
