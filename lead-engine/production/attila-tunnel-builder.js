/** Attila funnel compiler: produces deployable static HTML/CSS/JS source in memory. */
import {assignTunnelMission} from './attila-tunnel-factory.js';
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48);
export function suggestDomains(brand){
 if(typeof brand!=='string'||!brand.trim())throw Error('BRAND_REQUIRED');
 const root=slug(brand);return ['.fr','.com','.shop'].map(tld=>({domain:root+tld,availability:'NOT_CHECKED',purchaseAuthorized:false}));
}
export function generateTunnelSite(input){
 const mission=assignTunnelMission(input);
 const {brand,channel}=mission;
 const title=brand+' | Affiches et posters';
 const description='Découvrez notre sélection d’affiches et de posters. Consultez les annonces et les disponibilités sur '+channel+'.';
 const facts=mission.draft.facts.map(f=>'<li>'+esc(f)+'</li>').join('');
 const href=mission.draft.destinationUrl;
 const cta=href?'<a class="cta" id="outbound" rel="noopener noreferrer" href="'+esc(href)+'">Voir les annonces sur '+esc(channel)+'</a>':'<p>Les annonces seront bientôt accessibles.</p>';
 const html='<!doctype html>\n<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+esc(title)+'</title><meta name="description" content="'+esc(description)+'"><link rel="stylesheet" href="./style.css"></head><body><main><p class="eyebrow">Sélection d’affiches</p><h1>'+esc(brand)+'</h1><p>'+esc(description)+'</p><section><h2>À découvrir</h2><ul>'+facts+'</ul></section>'+cta+'<p class="note">Disponibilité et conditions de vente à vérifier sur la plateforme de destination.</p></main><script src="./analytics.js" defer></script></body></html>';
 const css=':root{font-family:system-ui,sans-serif;color-scheme:dark}*{box-sizing:border-box}body{margin:0;background:#0c1320;color:#f3f6ff}main{max-width:760px;margin:8vh auto;padding:32px}h1{font-size:clamp(2.2rem,6vw,4.5rem)}p,li{line-height:1.65}.eyebrow{color:#8bc8ff;text-transform:uppercase;letter-spacing:.2em}.cta{display:inline-block;margin:24px 0;padding:16px 22px;border-radius:12px;background:#86d5ff;color:#081320;font-weight:700}.note{font-size:.85rem;color:#aebdd1}';
 const js='document.getElementById("outbound")?.addEventListener("click",()=>{window.dispatchEvent(new CustomEvent("attila:outbound_click",{detail:{channel:'+JSON.stringify(channel)+'}}));});';
 return {missionId:mission.missionId,workspaceId:mission.workspaceId,agent:'ATTILA',status:'STATIC_SITE_GENERATED_NOT_DEPLOYED',domainSuggestions:suggestDomains(brand),seo:{title,description,robots:'noindex until review',channel},files:{'index.html':html,'style.css':css,'analytics.js':js},audit:[...mission.audit,{phase:'BUILD',status:'FILES_GENERATED'},{phase:'TEST',status:'NOT_RUN'},{phase:'DEPLOY',status:'NOT_AUTHORIZED'}],externalActions:false};
}
