/** Attila: read-only marketplace event ingestion. No credentials, scraping or outbound platform calls. */
export const MARKETPLACE_DNA=Object.freeze({agent:'ATTILA',sources:['VINTED','LEBONCOIN'],modes:['OWNER_CONFIRMED','AUTHORIZED_IMPORT'],privacy:'NO_PERSONAL_BUYER_DATA',attribution:'NEVER_ASSUME_ATTILA_CAUSED_A_SALE',externalActions:false});
const id=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(s);
export function observeMarketplaceEvent({eventId,workspaceId,platform,type,amountCents=null,currency='EUR',itemTitle=null,source='OWNER_CONFIRMED',occurredAt=null,attribution='ORGANIC_OR_UNKNOWN'}={}){
 if(!id(eventId)||!id(workspaceId)||!MARKETPLACE_DNA.sources.includes(platform)||!['SALE','LISTING','REVIEW_SUMMARY','ACTIVITY_SUMMARY'].includes(type)||!MARKETPLACE_DNA.modes.includes(source))throw Error('INVALID_MARKETPLACE_EVENT');
 if(amountCents!==null&&(!Number.isSafeInteger(amountCents)||amountCents<0))throw Error('INVALID_AMOUNT');
 if(type==='SALE'&&amountCents===null)throw Error('SALE_AMOUNT_REQUIRED');
 if(currency!=='EUR'||(itemTitle!==null&&(typeof itemTitle!=='string'||itemTitle.length>180)))throw Error('INVALID_EVENT_DETAILS');
 if(!['ORGANIC_OR_UNKNOWN','ATTILA_TRACKED_CLICK','VERIFIED_ATTILA_CONVERSION'].includes(attribution))throw Error('INVALID_ATTRIBUTION');
 if(occurredAt!==null&&(typeof occurredAt!=='string'||!Number.isFinite(Date.parse(occurredAt))))throw Error('INVALID_DATE');
 return {eventId,workspaceId,platform,type,amountCents,currency,itemTitle,source,occurredAt,attribution,verifiedByPlatform:false,recordedForAnalysis:true,externalActions:false,privacy:'NO_BUYER_IDENTIFIERS'};
}
export function summarizeMarketplaceEvents(events=[]){
 if(!Array.isArray(events)||events.length>10000)throw Error('INVALID_EVENTS');
 const seen=new Set(),out={VINTED:{sales:0,revenueCents:0},LEBONCOIN:{sales:0,revenueCents:0}};
 for(const e of events){if(!e||!id(e.eventId)||seen.has(e.eventId)||!out[e.platform])throw Error('INVALID_OR_DUPLICATE_EVENT');seen.add(e.eventId);if(e.type==='SALE'){if(!Number.isSafeInteger(e.amountCents)||e.amountCents<0)throw Error('INVALID_SALE');out[e.platform].sales++;out[e.platform].revenueCents+=e.amountCents;}}
 return {byPlatform:out,events:events.length,source:'SUPPLIED_EVENTS_ONLY',notPlatformReconciled:true};
}
