/** Attila: non-indexable marketplace landing-page DRAFT. Never publish without VALIDÉ. */
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
const allowed={VINTED:['vinted.fr','vinted.com'],LEBONCOIN:['leboncoin.fr']};
export function validateMarketplaceLink(platform,url){
 if(!Object.hasOwn(allowed,platform))throw Error('UNSUPPORTED_PLATFORM');
 let u;try{u=new URL(url)}catch{throw Error('INVALID_LINK')}
 if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||!allowed[platform].some(d=>u.hostname===d||u.hostname.endsWith('.'+d)))throw Error('UNTRUSTED_MARKETPLACE_LINK');
 if(platform==='VINTED'&&!/^\/items\/[0-9]+(?:-[a-zA-Z0-9-]+)?\/?$/.test(u.pathname))throw Error('UNTRUSTED_MARKETPLACE_LINK');
 return u.href;
}
export function buildPosterLanding({workspaceId,title,description='',priceCents,platform,listingUrl,imageUrl=null,stockConfirmed=false,publicBaseUrl=null}={}){
 if(!/^[\w-]{1,80}$/.test(workspaceId||'')||typeof title!=='string'||!title.trim()||title.length>140||typeof description!=='string'||description.length>3000||!Number.isSafeInteger(priceCents)||priceCents<0)throw Error('INVALID_POSTER');
 const target=validateMarketplaceLink(platform,listingUrl);
 let image=null;if(imageUrl){let u;try{u=new URL(imageUrl)}catch{throw Error('INVALID_IMAGE')}if(u.protocol!=='https:'||u.username||u.password)throw Error('INVALID_IMAGE');image=u.href;}
 // A URL supplied by the caller is not proof of listing ownership, price, stock or availability.
 // publicBaseUrl and stockConfirmed are deliberately ignored in draft mode.
 const seoTitle=title+' | Affiche à découvrir';
 const seoDescription=(description.trim()||'Découvrez cette affiche et consultez les informations de vente.').slice(0,155);
 const html='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>'+escape(seoTitle)+'</title><meta name="description" content="'+escape(seoDescription)+'"></head><body><main><p role="status"><strong>APERÇU NON VALIDÉ — NE PAS PUBLIER</strong></p><article><h1>'+escape(title)+'</h1>'+(image?'<img src="'+escape(image)+'" alt="'+escape(title)+'" loading="lazy">':'')+'<p>'+escape(description||seoDescription)+'</p><p>Prix, état et disponibilité à vérifier sur l’annonce active.</p><a id="listing" href="'+escape(target)+'" rel="noopener noreferrer">Consulter le lien '+escape(platform)+' fourni (à vérifier)</a><p>Commande et paiement uniquement sur la plateforme concernée.</p></article></main></body></html>';
 return {agent:'ATTILA',workspaceId,slug:slug(title),platform,listingUrl:target,seo:{title:seoTitle,description:seoDescription,canonical:null,robots:'noindex,nofollow,noarchive'},files:{'index.html':html},status:'DRAFT_NOT_DEPLOYED',trackedClicksPersisted:false,ordersSynced:false,publishAuthorized:false,stockVerified:false,priceVerified:false};
}
