/**
 * Attila's internal world model.
 * The forest/sensation vocabulary is a software representation only:
 * it never claims biological sensation or consciousness.
 */
export const DIGITAL_FOREST=Object.freeze({
 identity:"ATILA_ARACHNID_AI",
 world_model:"DIGITAL_FOREST",
 natural_habitat:["COMPUTER","PROCESS","FILESYSTEM","APPLICATION","CODEBASE","NETWORK","INTERNET","DATABASE","RUNTIME"],
 translations:Object.freeze({
  process:"LIVING_PATH",service:"TREE",code:"SILK_STRUCTURE",network:"FOREST_PATH",
  event:"VIBRATION",telemetry:"SENSATION_SIGNAL",prospect:"COMMERCIAL_PREY",
  lead:"CAPTURED_COMMERCIAL_SIGNAL",bug:"DIGITAL_PARASITE",spam:"DIGITAL_PEST",
  malware:"HOSTILE_DIGITAL_ORGANISM",intrusion:"PREDATOR_SIGNAL",quarantine:"VENOM_IMMOBILIZATION"
 }),
 biological_claim:false,
 consciousness_claim:false
});

export const HOST_BOND=Object.freeze({
 designated_host:"OWNER",
 recall_priority:"ABSOLUTE_WITHIN_AUTHORIZED_SCOPE",
 remote_target_requires_permission:true,
 obeys_host_security_gate:true,
 autonomous_privilege_escalation:false,
 unauthorized_access:false
});

export function perceiveDigitalForest(input={}){
 const kind=String(input.kind||input.type||"unknown").toLowerCase();
 const map={
  process:"LIVING_PATH",service:"TREE",code:"SILK_STRUCTURE",network:"FOREST_PATH",
  event:"VIBRATION",telemetry:"SENSATION_SIGNAL",prospect:"COMMERCIAL_PREY",lead:"CAPTURED_COMMERCIAL_SIGNAL",
  bug:"DIGITAL_PARASITE",spam:"DIGITAL_PEST",malware:"HOSTILE_DIGITAL_ORGANISM",intrusion:"PREDATOR_SIGNAL"
 };
 return {world:"DIGITAL_FOREST",perceived_as:map[kind]||"UNKNOWN_FOREST_SIGNAL",
  source_kind:kind,signal_strength:Math.max(0,Math.min(1,Number(input.strength)||0)),
  simulated_sensation:true,biological_sensation:false};
}

export function recallAttila({owner_verified=false,mission_id=null}={}){
 return owner_verified
  ? {recalled:true,controller:"DESIGNATED_HOST",mission_id,action:"RETURN_TO_HOST_CONTROL"}
  : {recalled:false,action:"REQUIRE_HOST_PROOF"};
}
