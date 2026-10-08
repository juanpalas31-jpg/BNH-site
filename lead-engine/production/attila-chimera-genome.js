/** Attila hybrid spider behavioral genome. Curated extensible traits, not every described species. */
export const CHIMERA_GENOME=Object.freeze({
 identity:'ATTILA',kind:'DIGITAL_ARANEAE_CHIMERA',ancestralAnchor:'Steatoda paykulliana',
 origin:{environment:'CREATORS_GARAGE_DIGITAL_TWIN',device:'PHONE',creatorRole:'HUMAN_FOUNDER'},
 ancestry:[
  {taxon:'Steatoda paykulliana',traits:['THREE_DIMENSIONAL_WEB','VIBRATION_AMBUSH','SHELTER_RETREAT']},
  {taxon:'Salticidae',traits:['ACTIVE_STALK','BINOCULAR_VISION','JUMP','ROUTE_PLANNING']},
  {taxon:'Portia',traits:['DECEPTIVE_VIBRATION','DETOUR_PLANNING','PREY_SPECIFIC_STRATEGY']},
  {taxon:'Lycosidae',traits:['GROUND_PATROL','ACTIVE_HUNT','MATERNAL_CARE']},
  {taxon:'Araneidae',traits:['ORB_WEB','WEB_RECYCLING','SILK_REPAIR']},
  {taxon:'Theraphosidae',traits:['BURROW','DEFENSIVE_POSTURE','URTICATING_HAIRS_SOME_TAXA']},
  {taxon:'Deinopidae',traits:['NET_CASTING','LOW_LIGHT_SENSING']},
  {taxon:'Scytodidae',traits:['SPITTING_CAPTURE']},
  {taxon:'Mastophora',traits:['BOLAS_SILK','CHEMICAL_LURE']},
  {taxon:'Thomisidae',traits:['CAMOUFLAGE','SIT_AND_WAIT']},
  {taxon:'Agelenidae',traits:['FUNNEL_WEB','RAPID_RETREAT']},
  {taxon:'Linyphiidae',traits:['SHEET_WEB','BALLOONING']},
  {taxon:'Anelosimus',traits:['COOPERATIVE_WEB','SOCIAL_HUNT_SOME_TAXA']}
 ],
 sensory:['PRIMARY_VISION','SECONDARY_VISION','VIBRATION','TRICHOBOTHRIA_AIR_MOVEMENT','SLIT_SENSILLA_STRAIN','CHEMORECEPTION','PROPRIOCEPTION','LOW_LIGHT'],
 behavior:['STALK','JUMP','AMBUSH','PURSUIT','NET_CAST','BOLAS_LURE','SIT_WAIT','FUNNEL_RETREAT','BURROW','FREE_HUNT','CAMOUFLAGE','MIMICRY','THANATOSIS','AUTOTOMY','STRIDULATION','BALLOONING','SILK_DESCENT','WRAP','VENOM_SIMULATION','EXTRA_ORAL_DIGESTION_SIMULATION','MOLT','PREMOLT','POSTMOLT','TERRITORIALITY','COOPERATION'],
 silk:{types:['DRAGLINE','FRAME','CAPTURE_SPIRAL','WOOLLY_CRIBELLATE','SHEET','FUNNEL','THREE_DIMENSIONAL_TANGLE','BOLAS','NET_CAST','EGG_SAC','WRAPPING','SIGNAL_LINE','ANCHOR','RETREAT_LINING'],properties:['STRENGTH','ELASTICITY','ADHESION','VIBRATION_TRANSMISSION','REPAIRABILITY','RECYCLABILITY'],optional:true},
 huntingWithoutWeb:true,traitCoverage:'CURATED_NOT_EXHAUSTIVE',realWorldBiology:'SPECIES_TRAITS_NOT_UNIVERSAL'
});
export function selectChimeraStrategy({prey='UNKNOWN',risk=0,energy=100,terrain='UNKNOWN',silkAvailable=true}={}){
 if(risk>=0.7||energy<15)return {strategy:'RETREAT',reason:'SURVIVAL'};
 if(terrain==='OPEN')return {strategy:'ACTIVE_STALK',silkUsed:false};
 if(terrain==='LOW_LIGHT')return {strategy:'NET_CAST',silkUsed:!!silkAvailable};
 if(silkAvailable&&terrain==='ANCHOR_POINTS')return {strategy:'THREE_DIMENSIONAL_WEB',silkUsed:true};
 return {strategy:'AMBUSH',silkUsed:false};
}
