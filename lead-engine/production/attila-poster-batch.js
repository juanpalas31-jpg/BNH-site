/** ATTILA: batch-build a reviewable multi-product SEO funnel from owner-authorized listings. */
import {buildPosterLanding} from './attila-poster-web.js';
const xml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&apos;'}[c]));
const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
export function buildPosterFunnelBatch({workspaceId,posters,publicBaseUrl=null}={}){
 if(!Array.isArray(posters)||posters.length<1||posters.length>100)throw Error('INVALID_CATALOG');
 let base=null;
 if(publicBaseUrl){let u;try{u=new URL(publicBaseUrl)}catch{throw Error('INVALID_BASE_URL')}if(u.protocol!=='https:'||u.username||u.password)throw Error('INVALID_BASE_URL');base=u.origin;}
 const files={},index=[],seen=new Set();
 for(const p of posters){
  const page=buildPosterLanding({...p,workspaceId,publicBaseUrl:base});
  if(!page.slug||seen.has(page.slug))throw Error('DUPLICATE_OR_INVALID_SLUG');
  seen.add(page.slug);
  files['affiches/'+page.slug+'/index.html']=page.files['index.html'];
  index.push({title:p.title,platform:page.platform,slug:page.slug,path:'/affiches/'+page.slug+'/',priceCents:p.priceCents});
 }
 const cards=index.map(p=>'<li><a href=".'+p.path+'">'+html(p.title)+'</a> — '+html(p.platform)+' — '+(p.priceCents/100).toFixed(2)+' €</li>').join('');
 files['index.html']='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="index,follow"><title>Affiches et posters | Sélection</title><meta name="description" content="Découvrez une sélection d’affiches et retrouvez les annonces disponibles sur les plateformes partenaires."></head><body><main><h1>Affiches et posters</h1><p>Consultez les disponibilités et commandez directement sur les plateformes indiquées.</p><ul>'+cards+'</ul></main></body></html>';
 files['robots.txt']='User-agent: *\nAllow: /\n';
 if(base)files['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/',...index.map(p=>p.path)].map(path=>'<url><loc>'+xml(base+path)+'</loc></url>').join('')+'</urlset>';
 return {agent:'ATTILA',workspaceId,status:'SEO_BUILD_READY_FOR_OWNER_DEPLOYMENT',pages:index.length,files,inventory:index,publicationAuthorized:false,indexingEnabled:true,ordersRoutedToMarketplaces:true,analyticsPersisted:false};
}
