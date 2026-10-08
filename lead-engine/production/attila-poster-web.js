/** Attila: SEO-ready poster landing pages with safe marketplace links. No checkout impersonation. */
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
const allowed={VINTED:['vinted.fr','vinted.com'],LEBONCOIN:['leboncoin.fr']};
export function validateMarketplaceLink(platform,url){
 if(!allowed[platform])throw Error('UNSUPPORTED_PLATFORM');
 let u;try{u=new URL(url)}catch{throw Error('INVALID_LINK')}
 if(u.protocol!=='https:'||u.username||u.password||!allowed[platform].some(d=>u.hostname===d||u.hostname.endsWith('.'+d)))throw Error('UNTRUSTED_MARKETPLACE_LINK');
 return u.href;
}
export function buildPosterLanding({workspaceId,title,description='',priceCents,platform,listingUrl,imageUrl=null,stockConfirmed=false,publicBaseUrl=null}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||'')||typeof title!=='string'||!title.trim()||title.length>140||typeof description!=='string'||description.length>3000||!Number.isSafeInteger(priceCents)||priceCents<0)throw Error('INVALID_POSTER');
 const target=validateMarketplaceLink(platform,listingUrl);
 let image=null;if(imageUrl){const u=new URL(imageUrl);if(u.protocol!=='https:')throw Error('INVALID_IMAGE');image=u.href;}
 let canonical=null;if(publicBaseUrl){const u=new URL(publicBaseUrl);if(u.protocol!=='https:')throw Error('INVALID_BASE_URL');canonical=new URL('/affiches/'+slug(title)+'/',u).href;}
 const seoTitle=title+' | Affiche à découvrir',seoDescription=(description.trim()||'Découvrez cette affiche et consultez les informations de vente.').slice(0,155);
 const jsonLd=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:title,description:seoDescription,...(image?{image:[image]}:{}),...(stockConfirmed?{offers:{'@type':'Offer',priceCurrency:'EUR',price:(priceCents/100).toFixed(2),availability:'https://schema.org/InStock',url:target}}:{})}).replace(/</g,'\\u003c');
 const cta='Voir cette affiche sur '+platform;
 const html='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(seoTitle)+'</title><meta name="description" content="'+escape(seoDescription)+'"><meta name="robots" content="noindex,nofollow">'+(canonical?'<link rel="canonical" href="'+escape(canonical)+'">':'')+'<script type="application/ld+json">'+jsonLd+'</script></head><body><main><article><h1>'+escape(title)+'</h1>'+(image?'<img src="'+escape(image)+'" alt="'+escape(title)+'" loading="lazy">':'')+'<p>'+escape(description||seoDescription)+'</p><p>Prix indiqué : '+(priceCents/100).toFixed(2)+' € — à confirmer sur la plateforme.</p><a id="buy" href="'+escape(target)+'" rel="noopener noreferrer">'+escape(cta)+'</a><p>La commande et le paiement s’effectuent sur '+escape(platform)+'.</p></article></main><script>document.getElementById("buy").addEventListener("click",function(){window.dispatchEvent(new CustomEvent("attila:outbound_click",{detail:{platform:'+JSON.stringify(platform)+'}}))})</script></body></html>';
 return {agent:'ATTILA',workspaceId,slug:slug(title),platform,listingUrl:target,seo:{title:seoTitle,description:seoDescription,canonical,robots:'noindex until owner approval'},files:{'index.html':html},status:'DRAFT_NOT_DEPLOYED',trackedClicksPersisted:false,ordersSynced:false,publishAuthorized:false};
}
