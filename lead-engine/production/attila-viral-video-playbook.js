/** Attila: original, organic short-video playbook inspired by publicly described
 * creator workflow patterns (profile audit, hook, script, analytics, cross-post).
 * No Blow Up code, assets, private data or brand are copied.
 */
const CHANNELS=['TIKTOK','INSTAGRAM_REELS','YOUTUBE_SHORTS','FACEBOOK_REELS','PINTEREST'];
const compact=x=>String(x??'').trim().replace(/\s+/g,' ');
export function planViralVideo({workspaceId,product,listingUrl,channel='TIKTOK',signals={},verifiedFacts=[]}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||'')||!CHANNELS.includes(channel))throw Error('INVALID_SCOPE');
 if(!product||!compact(product.title)||!Array.isArray(verifiedFacts))throw Error('INVALID_PRODUCT');
 let url;try{url=new URL(listingUrl)}catch{throw Error('INVALID_URL')}
 if(url.protocol!=='https:'||url.username||url.password)throw Error('INVALID_URL');
 const title=compact(product.title).slice(0,90);
 const hooks=[
  'Une affiche, trois idées pour transformer un mur.',
  'Comment choisir le bon cadre pour cette affiche ?',
  'Le détail qui change une décoration musicale.'
 ];
 const audience=compact(signals.audience||'amateurs de décoration').slice(0,100);
 const metrics=signals.metrics||{};
 const hookIndex=Number.isSafeInteger(metrics.bestHookIndex)&&metrics.bestHookIndex>=0&&metrics.bestHookIndex<hooks.length?metrics.bestHookIndex:0;
 const facts=verifiedFacts.map(compact).filter(Boolean).slice(0,5);
 const scenes=[
  {seconds:[0,3],purpose:'HOOK',visual:'Vrai visuel produit autorisé',overlay:hooks[hookIndex]},
  {seconds:[3,9],purpose:'VALUE',visual:'Plan produit et mise en situation originale',overlay:title},
  {seconds:[9,13],purpose:'PROOF',visual:'Détails de l’annonce réellement vérifiés',overlay:facts.join(' • ')||'Vérifiez les détails dans l’annonce'},
  {seconds:[13,17],purpose:'CTA',visual:'Visuel produit et invitation à consulter',overlay:'Voir la disponibilité sur Vinted'}
 ];
 return {agent:'ATTILA',workspaceId,channel,goal:'VERIFIED_VINTED_CLICKS_AND_SALES',audience,
  originality:'OWN_SCRIPT_NO_SOURCE_VIDEO_COPY',productionModes:['NON_GENERATIVE_EDIT','AI_GENERATIVE_WITH_AUTHORIZED_ASSETS'],
  storyboard:scenes,caption:title+' — idées déco et disponibilité sur Vinted.',hashtags:['#affiche','#decoration','#poster'],
  destination:url.href,publication:{status:'DRAFT',requiresConnectedAuthorizedAccount:true},
  analytics:{views:null,watchTime:null,clicks:null,verifiedSales:null,source:'NOT_CONNECTED'}};
}
export function evaluateViralVideos(rows=[]){
 if(!Array.isArray(rows))throw Error('INVALID_ROWS');
 return rows.map(r=>{
  const views=Number.isSafeInteger(r.views)&&r.views>=0?r.views:0;
  const clicks=Number.isSafeInteger(r.clicks)&&r.clicks>=0?r.clicks:0;
  const sales=Number.isSafeInteger(r.verifiedSales)&&r.verifiedSales>=0?r.verifiedSales:0;
  return {id:r.id,views,clicks,verifiedSales:sales,clickRate:views?clicks/views:0,salesPerClick:clicks?sales/clicks:0};
 }).sort((a,b)=>b.verifiedSales-a.verifiedSales||b.salesPerClick-a.salesPerClick||b.clickRate-a.clickRate);
}
