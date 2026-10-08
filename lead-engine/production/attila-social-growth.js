/** ATTILA social growth: safe, deterministic content plans, no publishing without approval. */
const NETWORKS=['TIKTOK','INSTAGRAM','FACEBOOK','YOUTUBE','PINTEREST','LINKEDIN'];
const clean=(s,max=160)=>typeof s==='string'?s.trim().slice(0,max):'';
export function planSocialCampaign({workspaceId,productName,productUrl,keywords=[],networks=NETWORKS,utmCampaign='attila_growth'}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||''))throw Error('INVALID_WORKSPACE');
 if(!clean(productName)||!Array.isArray(keywords)||!Array.isArray(networks)||!networks.length||networks.some(n=>!NETWORKS.includes(n)))throw Error('INVALID_CAMPAIGN');
 let u;try{u=new URL(productUrl)}catch{throw Error('INVALID_URL')}
 if(u.protocol!=='https:'||u.username||u.password)throw Error('INVALID_DESTINATION');
 const tags=keywords.map(k=>clean(k,40)).filter(Boolean).slice(0,8);
 const campaign=clean(utmCampaign,60).replace(/[^a-zA-Z0-9_-]/g,'_');
 return {agent:'ATTILA',workspaceId,productName:clean(productName),status:'DRAFT_REQUIRES_APPROVAL',
 posts:[...new Set(networks)].map(network=>{
 const link=new URL(u.href);link.searchParams.set('utm_source',network.toLowerCase());link.searchParams.set('utm_medium','social');link.searchParams.set('utm_campaign',campaign);
 return {network,format:network==='YOUTUBE'||network==='TIKTOK'?'SHORT_VIDEO':network==='PINTEREST'?'PIN':'POST',headline:clean(productName,80),caption:[clean(productName),...tags].join(' · '),destinationUrl:link.href,approved:false,published:false};
 }),measurement:{outboundClicks:0,verifiedOrders:null,attributedRevenueCents:null,liveData:false},externalActions:false};
}
export function summarizeSocialTraffic(events=[]){
 if(!Array.isArray(events)||events.length>10000)throw Error('INVALID_EVENTS');
 const seen=new Set(),byNetwork={};
 for(const e of events){
 if(!e||typeof e.id!=='string'||!/^[\w-]{1,80}$/.test(e.id)||seen.has(e.id)||!NETWORKS.includes(e.network)||!['VISIT','OUTBOUND_CLICK','VERIFIED_ORDER'].includes(e.type))throw Error('INVALID_EVENT');
 seen.add(e.id);const v=byNetwork[e.network]??={visits:0,clicks:0,verifiedOrders:0,revenueCents:0};
 if(e.type==='VISIT')v.visits++;
 if(e.type==='OUTBOUND_CLICK')v.clicks++;
 if(e.type==='VERIFIED_ORDER'){if(!Number.isSafeInteger(e.amountCents)||e.amountCents<0||e.verified!==true)throw Error('UNVERIFIED_ORDER');v.verifiedOrders++;v.revenueCents+=e.amountCents;}
 }
 return {byNetwork,source:'SUPPLIED_EVENTS_ONLY',liveData:false};
}
