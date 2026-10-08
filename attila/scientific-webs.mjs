// Spider Engine — biologically inspired web coordination (not literal spider translation).
// Evidence: Stegodyphus dumicola pulsed cues; Anelosimus eximius local recruitment;
// Mallos gregalis signal/noise filtering; orb-web geometry and signal attenuation.
export const SPECIES_MODELS=Object.freeze({
 STEGODYPHUS_DUMICOLA:{strategy:"PULSE_RECRUITMENT",source:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8186555/",finding:"Pulsed vibratory cues elicit faster collective responses; proximity influences participation."},
 ANELOSIMUS_EXIMIUS:{strategy:"LOCAL_RECRUITMENT",source:"https://comptes-rendus.academie-sciences.fr/biologies/articles/10.1016/j.crvi.2004.07.002/",finding:"Local vibrations and prey length modulate cooperative transport recruitment."},
 MALLOS_GREGALIS:{strategy:"NOISE_FILTER",source:"https://www.sciencedirect.com/science/article/pii/0003347279901350",finding:"Communal sheet webs transmit relevant prey cues while attenuating some nestmate walking signals."},
 ORB_WEB:{strategy:"SIGNAL_PATH",source:"https://pubmed.ncbi.nlm.nih.gov/31106817/",finding:"Silk, tension, stiffness and geometry affect vibration propagation and information quality."},
 ANELOSIMUS_SCALING:{strategy:"OPTIMAL_COLONY_SIZE",source:"https://pmc.ncbi.nlm.nih.gov/articles/PMC2575263/",finding:"Per-capita prey biomass peaks at intermediate colony sizes, so more workers is not always better."}
});
const clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
export function interpretVibration({amplitude=0,pulses=0,noise=0,proximity=0,verified=false}={}){
 const signal=clamp(amplitude)*(1-clamp(noise));
 const urgency=clamp(signal*.55+clamp(pulses/5)*.3+clamp(proximity)*.15);
 return {urgency,confidence:verified?clamp(signal+.2):clamp(signal*.65),recruit:verified&&urgency>=.6,
  explanation:"Digital analogy to vibrational recruitment; not a measured spider vibration."};
}
export function adaptiveRecruitment({signal,availableWorkers=0,activeWorkers=0,maxWorkers=3}={}){
 const cap=Math.max(0,Math.min(16,Math.floor(Number(maxWorkers)||0)));
 const available=Math.max(0,Math.floor(Number(availableWorkers)||0));
 const active=Math.max(0,Math.floor(Number(activeWorkers)||0));
 if(!signal?.recruit) return 0;
 // Scale cautiously: avoid uncontrolled replication and excessive resource contention.
 return Math.min(available,Math.max(0,cap-active),signal.urgency>.85?2:1);
}
export function routeWithAttenuation({quality=0,hops=0,noise=0,affinity=1}={}){
 const strength=clamp(quality)*Math.pow(.82,Math.max(0,Number(hops)||0))*(1-clamp(noise))*(.5+.5*clamp(affinity));
 return {strength,deliver:strength>=.55};
}
export function classifySignal({type="",evidence=null,privateData=false}={}){
 if(privateData)return {channel:"ISOLATED",share:false};
 if(type==="ALERT")return {channel:"PRIORITY",share:true,requiresVerification:true};
 if(!evidence)return {channel:"UNVERIFIED",share:false};
 return {channel:"EVIDENCE",share:true};
}
