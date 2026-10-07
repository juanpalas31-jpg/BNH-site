const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export function exoskeleton({integrity=1,breach=false}={}){
 const health=breach?C(integrity-.35):C(integrity);
 return {organ:"DIGITAL_EXOSKELETON",health,breach,
  posture:health<.35?"ISOLATE":health<.7?"REINFORCE":"STABLE"};
}
export function development({generation=0,experience=0,integrity=1}={}){
 const maturity=C((experience||0)/100);
 const stage=maturity<.15?"HATCHLING":maturity<.45?"JUVENILE":maturity<.8?"SUBADULT":"ADULT";
 return {organ:"DIGITAL_DEVELOPMENT",generation,stage,maturity,
  reproduction_mode:"BOUNDED_NEO_ATILA",mutation:"STRATEGY_ONLY",privilege_escalation:false,
  viable:C(integrity)>.4};
}
export function homeostasis(body={}){
 const energy=C(body.energy??.8),integrity=C(body.integrity??1),load=C(body.load||0),
  waste=C(body.waste||0),oxygen=C(body.compute_capacity??1);
 const stress=C(.28*(1-energy)+.28*(1-integrity)+.18*load+.12*waste+.14*(1-oxygen));
 return {organ:"DIGITAL_HOMEOSTASIS",stress,
  priority:stress>.75?"SURVIVE":stress>.5?"REPAIR":stress>.25?"CONSERVE":"EXPLORE",
  self_preservation_overrides_privileged_policy:false};
}
