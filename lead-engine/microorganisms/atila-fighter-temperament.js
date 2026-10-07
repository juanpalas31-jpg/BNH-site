const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export const HOST_FIGHTER_TEMPERAMENT=Object.freeze({
 identity:"OWNER_DERIVED_FIGHTER_MODEL",
 symbolic_profile:"ARIES_21_MARCH",
 initiative:.94,persistence:.96,courage:.92,decisiveness:.90,
 adaptability:.86,protectiveness:.98,composure:.88,tactical_patience:.91,
 impulsivity_raw:.72,impulsivity_allowed:.18,
 retaliation_allowed:false
});
export function fighterState({pressure=0,failures=0,uncertainty=0}={}){
 const p=clamp(pressure),f=clamp(failures/5),u=clamp(uncertainty);
 return {
  initiative:clamp(HOST_FIGHTER_TEMPERAMENT.initiative-.18*u),
  persistence:clamp(HOST_FIGHTER_TEMPERAMENT.persistence+.03*f),
  composure:clamp(HOST_FIGHTER_TEMPERAMENT.composure+.08*p),
  tactical_patience:clamp(HOST_FIGHTER_TEMPERAMENT.tactical_patience+.06*u),
  action_threshold:clamp(.52+.18*u+.12*p),
  replication_bias:clamp(.30+.35*p+.20*f),
  retaliation_allowed:false
 };
}
export function fighterDecision(input={}){
 const s=fighterState(input);
 if(input.owner_verified===false)return {mode:"PROTECT_HOST",action:"CONTAIN",state:s};
 if(clamp(input.risk)>=.55)return {mode:"ESCALATE_DEFENSE",action:"QUARANTINE",state:s};
 if((input.failures||0)>=2)return {mode:"ADAPT",action:"CHANGE_STRATEGY",state:s};
 if(clamp(input.pressure)>=.25)return {mode:"SWARM",action:"REPLICATE_EPHEMERAL",state:s};
 return {mode:"WATCH",action:"OBSERVE",state:s};
}
