/** Spider Engine: Attila's observable, project-independent funnel planning factory.
 * No automatic publication, account login or external writes. */
export const TUNNEL_FACTORY_DNA=Object.freeze({
 engine:'SPIDER_ENGINE',agent:'ATTILA',role:'AUTONOMOUS_DRAFT_WITH_HUMAN_APPROVAL',
 independence:'EACH_FUNNEL_HAS_OWN_BRAND_CHANNEL_AND_WORKSPACE',
 phases:['DISCOVER','DESIGN','SEO','BUILD_SPEC','REVIEW','PUBLISH_AFTER_APPROVAL'],
 channels:['VINTED','LEBONCOIN','WEB','OTHER'],externalPublishing:false,
 requirements:['SOURCE_PROVENANCE','NO_FABRICATED_PRODUCT_DETAILS','UTM_TRACKING','EVENT_ANALYTICS','LEGAL_REVIEW']
});
const valid=(v)=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(v);
export function assignTunnelMission({missionId,workspaceId,channel,brand,productFacts=[],destinationUrl=null}={}){
 if(!valid(missionId)||!valid(workspaceId)||!TUNNEL_FACTORY_DNA.channels.includes(channel)||typeof brand!=='string'||!brand.trim()||brand.length>100)throw Error('INVALID_MISSION');
 if(!Array.isArray(productFacts)||productFacts.length>100||productFacts.some(f=>typeof f!=='string'||f.length>300))throw Error('INVALID_PRODUCT_FACTS');
 if(destinationUrl!==null){let u;try{u=new URL(destinationUrl)}catch{throw Error('INVALID_DESTINATION')};if(u.protocol!=='https:')throw Error('HTTPS_REQUIRED');}
 const slug=(brand+'-'+channel).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
 return {missionId,workspaceId,assignedAgent:'ATTILA',channel,brand:brand.trim(),
  status:'DRAFT_FOR_OBSERVATION',publishAllowed:false,externalActions:false,
  proposedRoute:'/tunnels/'+slug,
  seo:{title:brand.trim()+' — affiches et posters',description:'Découvrir la sélection disponible et accéder aux annonces.',indexing:'REVIEW_BEFORE_PUBLICATION'},
  draft:{headline:'Découvrez nos affiches',facts:productFacts.slice(),cta:destinationUrl?'Voir les annonces':'Lien vers les annonces à renseigner',destinationUrl},
  telemetry:['page_view','cta_click','outbound_click','lead_if_applicable'],
  audit:[{phase:'DISCOVER',status:'COMPLETED_FROM_SUPPLIED_FACTS'},{phase:'DESIGN',status:'DRAFT'},{phase:'SEO',status:'DRAFT'},{phase:'BUILD_SPEC',status:'READY_FOR_REVIEW'},{phase:'PUBLISH',status:'BLOCKED_PENDING_HUMAN_APPROVAL'}]};
}
