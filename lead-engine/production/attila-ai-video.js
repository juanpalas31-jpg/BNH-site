/** ATTILA AI Video Orchestrator
 * Provider-neutral planning layer for lawful social/video generation.
 * Does not claim rendering until a configured renderer returns a verified asset.
 */
const PRESETS=Object.freeze({
 TIKTOK:{ratio:'9:16',seconds:15},
 INSTAGRAM_REELS:{ratio:'9:16',seconds:15},
 YOUTUBE_SHORTS:{ratio:'9:16',seconds:20},
 FACEBOOK_REELS:{ratio:'9:16',seconds:15},
 PINTEREST:{ratio:'9:16',seconds:15},
 X:{ratio:'16:9',seconds:20},
 LINKEDIN:{ratio:'1:1',seconds:20},
 YOUTUBE:{ratio:'16:9',seconds:30}
});
const clean=(x,n=500)=>typeof x==='string'?x.trim().replace(/\s+/g,' ').slice(0,n):'';
export const VIDEO_NETWORKS=Object.freeze(Object.keys(PRESETS));

export function createVideoMission({workspaceId,product,listingUrl,networks=VIDEO_NETWORKS,goal='CONVERSION',assets=[],facts=[]}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||''))throw Error('INVALID_WORKSPACE');
 if(!product||!clean(product.title,120)||!Number.isSafeInteger(product.priceCents)||product.priceCents<0)throw Error('INVALID_PRODUCT');
 let u;try{u=new URL(listingUrl)}catch{throw Error('INVALID_DESTINATION')}
 if(u.protocol!=='https:'||u.username||u.password)throw Error('INVALID_DESTINATION');
 if(!Array.isArray(networks)||!networks.length||networks.some(n=>!PRESETS[n]))throw Error('INVALID_NETWORK');
 if(!Array.isArray(assets)||!Array.isArray(facts))throw Error('INVALID_INPUT');
 const title=clean(product.title,120),truth=facts.map(x=>clean(x,120)).filter(Boolean).slice(0,10);
 const scenes=[
  {beat:'HOOK',instruction:'Open on the strongest authorized product visual; immediate motion; readable title.',voice:clean('Voici '+title+'.',160)},
  {beat:'DESIRE',instruction:'Show the product in a tasteful contextual setting without inventing product condition.',voice:'Une pièce visuelle pensée pour donner du caractère à votre décoration.'},
  {beat:'PROOF',instruction:'Use only supplied product facts and authorized close-ups.',voice:truth.join('. ')||'Regardez les détails réels de l’annonce.'},
  {beat:'CTA',instruction:'Finish with product visual and destination call-to-action.',voice:'Voir l’annonce et vérifier sa disponibilité.'}
 ];
 return {agent:'ATTILA',engine:'AI_VIDEO_ORCHESTRATOR',workspaceId,goal,sourceAssets:assets.map(x=>clean(x,500)).filter(Boolean).slice(0,20),truth,variants:networks.map(network=>({network,...PRESETS[network],scenes,caption:clean(title+' — voir l’annonce disponible.',300),destination:u.href,renderStatus:'NOT_RENDERED'})),render:{provider:null,status:'PROVIDER_REQUIRED',automaticPublishing:false},safety:{authorizedAssetsOnly:true,noDeceptiveClaims:true,noImpersonation:true,ownerReviewBeforePublish:true}};
}

export function buildRenderJobs(mission,{providerConfigured=false}={}){
 if(!mission||mission.engine!=='AI_VIDEO_ORCHESTRATOR'||!Array.isArray(mission.variants))throw Error('INVALID_VIDEO_MISSION');
 return mission.variants.map((v,i)=>({jobId:'video-'+String(i+1).padStart(2,'0'),network:v.network,ratio:v.ratio,seconds:v.seconds,status:providerConfigured?'READY_FOR_RENDERER':'BLOCKED_NO_RENDERER',brief:{scenes:v.scenes,assets:mission.sourceAssets,caption:v.caption},destination:v.destination}));
}

export function acceptRenderedAsset(job,{assetUrl,providerJobId,verified=false}={}){
 if(!job||job.status!=='READY_FOR_RENDERER'||verified!==true)throw Error('UNVERIFIED_RENDER');
 let u;try{u=new URL(assetUrl)}catch{throw Error('INVALID_ASSET_URL')}
 if(u.protocol!=='https:')throw Error('INVALID_ASSET_URL');
 return {...job,status:'RENDERED_VERIFIED',assetUrl:u.href,providerJobId:clean(providerJobId,120)};
}
