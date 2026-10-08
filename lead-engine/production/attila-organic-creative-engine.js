/** ATTILA Organic Creative Engine
 * Generates owned, unpaid ad creatives and SEO briefs. It does NOT buy ads,
 * impersonate users, spam, or publish without an authorized channel adapter.
 */
const CHANNELS=['TIKTOK','INSTAGRAM','FACEBOOK','PINTEREST','YOUTUBE_SHORTS','GOOGLE_SEO'];
const clean=(v,n=180)=>typeof v==='string'?v.trim().replace(/\s+/g,' ').slice(0,n):'';
const slug=s=>clean(s,90).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export function createOrganicCampaign({workspaceId,product,listingUrl,audience='amateurs de décoration',keywords=[],channels=CHANNELS,proof=[]}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||''))throw Error('INVALID_WORKSPACE');
 if(!product||!clean(product.title)||!Number.isSafeInteger(product.priceCents)||product.priceCents<0)throw Error('INVALID_PRODUCT');
 let target;try{target=new URL(listingUrl)}catch{throw Error('INVALID_LISTING_URL')}
 if(target.protocol!=='https:'||target.username||target.password)throw Error('INVALID_LISTING_URL');
 if(!Array.isArray(keywords)||!Array.isArray(channels)||channels.some(c=>!CHANNELS.includes(c)))throw Error('INVALID_CAMPAIGN');
 const kw=[...new Set(keywords.map(x=>clean(x,45)).filter(Boolean))].slice(0,12);
 const facts=[...new Set(proof.map(x=>clean(x,120)).filter(Boolean))].slice(0,8);
 const title=clean(product.title,100), price=(product.priceCents/100).toFixed(2)+' €';
 const hook='Une affiche qui change immédiatement l’ambiance d’un mur : '+title;
 const cta='Voir l’affiche disponible';
 const base={headline:title,hook,cta,destination:target.href,claims:facts,price,requiresOwnerReview:true};
 const creatives=channels.map(channel=>{
   if(channel==='GOOGLE_SEO')return {channel,type:'SEO_ARTICLE',...base,slug:slug(title),seoTitle:(title+' : affiche, décoration et idées pour l’encadrer').slice(0,60),metaDescription:('Découvrez '+title+', des idées de décoration et les détails de l’affiche actuellement proposée.').slice(0,155),outline:['Pourquoi cette affiche attire le regard','Où l’installer','Quel cadre choisir','Format et état : points à vérifier','Voir l’annonce disponible']};
   if(channel==='TIKTOK'||channel==='YOUTUBE_SHORTS')return {channel,type:'SHORT_VIDEO',...base,script:[{seconds:'0-2',shot:'Gros plan sur le visuel',voice:hook},{seconds:'2-7',shot:'Affiche présentée sur un mur',voice:'Une idée simple pour donner du caractère à votre décoration.'},{seconds:'7-12',shot:'Détails, format et état réels',voice:'Regardez les détails avant de choisir votre cadre.'},{seconds:'12-15',shot:'Affiche + appel à l’action',voice:cta}]};
   if(channel==='PINTEREST')return {channel,type:'PIN',...base,pinTitle:(title+' | idée déco murale').slice(0,100),caption:clean([title,'idée déco',...kw].join(' · '),500)};
   return {channel,type:'SOCIAL_POST',...base,caption:clean(hook+' '+facts.join(' ')+' '+cta,500)};
 });
 return {agent:'ATTILA',engine:'ORGANIC_CREATIVE',workspaceId,mode:'OWNED_UNPAID_MEDIA',paidMedia:false,product:{title,priceCents:product.priceCents},audience:clean(audience,100),keywords:kw,creatives,publication:{automatic:false,reason:'CHANNEL_ADAPTER_AND_OWNER_AUTHORIZATION_REQUIRED'},measurement:{required:['IMPRESSION','VISIT','OUTBOUND_CLICK','VERIFIED_ORDER','REVENUE_CENTS']}};
}

export function rankOrganicCreatives(metrics=[]){
 if(!Array.isArray(metrics))throw Error('INVALID_METRICS');
 return metrics.map(m=>{
  const impressions=Math.max(0,Number(m.impressions)||0),clicks=Math.max(0,Number(m.clicks)||0),orders=Math.max(0,Number(m.verifiedOrders)||0);
  return {...m,ctr:impressions?clicks/impressions:0,conversionRate:clicks?orders/clicks:0};
 }).sort((a,b)=>(b.verifiedOrders-a.verifiedOrders)||(b.conversionRate-a.conversionRate)||(b.ctr-a.ctr));
}
