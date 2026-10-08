/** Attila social connector factory: designs safe API adapters, does not call platforms. */
export const SOCIAL_CONNECTOR_DNA=Object.freeze({
 agent:'ATTILA',engine:'SPIDER_ENGINE',goal:'ATTRACT_MEASURABLE_TRAFFIC_TO_APPROVED_FUNNELS',
 providers:['TIKTOK','INSTAGRAM','FACEBOOK','YOUTUBE','PINTEREST','LINKEDIN','OTHER'],
 lifecycle:['DESIGN','REQUEST_OFFICIAL_APP_ACCESS','CONNECT_WITH_OAUTH','READ_APPROVED_METRICS','DRAFT_CONTENT','HUMAN_REVIEW','PUBLISH_IF_AUTHORIZED','MEASURE'],
 constraints:['OFFICIAL_APIS_ONLY','NO_PASSWORD_COLLECTION','NO_UNAUTHORIZED_SCRAPING','NO_UNAPPROVED_POSTING','PER_WORKSPACE_CREDENTIAL_ISOLATION'],
 externalActions:false
});
const id=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(s);
export function designSocialConnector({connectorId,workspaceId,provider,capabilities=['ANALYTICS','CONTENT_DRAFT'],destinationUrl=null}={}){
 if(!id(connectorId)||!id(workspaceId)||!SOCIAL_CONNECTOR_DNA.providers.includes(provider))throw Error('INVALID_CONNECTOR');
 const allowed=['ANALYTICS','CONTENT_DRAFT','CONTENT_PUBLISH','COMMENT_MODERATION','CAMPAIGN_REPORT'];
 if(!Array.isArray(capabilities)||capabilities.length>allowed.length||capabilities.some(c=>!allowed.includes(c)))throw Error('INVALID_CAPABILITIES');
 if(destinationUrl!==null){let u;try{u=new URL(destinationUrl)}catch{throw Error('INVALID_URL')};if(u.protocol!=='https:')throw Error('HTTPS_REQUIRED');}
 return {connectorId,workspaceId,provider,capabilities:[...new Set(capabilities)],destinationUrl,
  status:'DESIGN_ONLY',officialAppRegistrationRequired:true,oauthRequired:true,
  platformPermissionReviewRequired:true,credentialsStored:false,connected:false,
  metricsAvailable:false,publishingAuthorized:false,externalActions:false,
  audit:[{step:'DESIGN',status:'READY'},{step:'OFFICIAL_ACCESS',status:'PENDING'},{step:'OAUTH',status:'PENDING'},{step:'LIVE_SYNC',status:'NOT_STARTED'}]};
}
