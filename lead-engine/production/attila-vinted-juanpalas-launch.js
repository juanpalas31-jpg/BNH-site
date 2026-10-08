/** ATTILA — Juanpalas Vinted launch mission. Real destination; no invented item URLs. */
export const JUANPALAS_VINTED=Object.freeze({
 profileUrl:'https://www.vinted.fr/member/279658359-juanpalas',
 memberId:'279658359',handle:'juanpalas',priority:'PRIMARY_REVENUE_CHANNEL'
});
const THEMES=Object.freeze([
 {id:'pink-floyd',query:'affiche Pink Floyd décoration rock',angle:'Décoration musicale : choisir et encadrer une affiche Pink Floyd'},
 {id:'jim-morrison',query:'affiche Jim Morrison décoration rock vintage',angle:'Créer un mur rock vintage autour d’une affiche Jim Morrison'},
 {id:'marilyn-monroe',query:'affiche Marilyn Monroe décoration cinéma',angle:'Décoration cinéma : mettre en valeur une affiche Marilyn Monroe'},
 {id:'jazz',query:'affiche jazz Miles Davis Dexter Gordon décoration',angle:'Créer un coin musique avec des affiches de jazz'}
]);
export function buildVintedLaunchQueue({verifiedListings=[]}={}){
 if(!Array.isArray(verifiedListings))throw Error('INVALID_LISTINGS');
 const byTheme=new Map(verifiedListings.filter(x=>x&&x.verified===true&&typeof x.url==='string').map(x=>[x.theme,x]));
 return THEMES.map((t,i)=>{
  const listing=byTheme.get(t.id);
  return {priority:i+1,theme:t.id,seoQuery:t.query,articleAngle:t.angle,
   destination:listing?.url||JUANPALAS_VINTED.profileUrl,
   destinationLevel:listing?'VERIFIED_LISTING':'VERIFIED_PROFILE_FALLBACK',
   tasks:['SEO_ARTICLE','LANDING_PAGE','SHORT_VIDEO','REEL','PIN'],
   publishReady:Boolean(listing),status:listing?'READY_FOR_CONTENT_BUILD':'NEEDS_VERIFIED_ITEM_URL'};
 });
}
