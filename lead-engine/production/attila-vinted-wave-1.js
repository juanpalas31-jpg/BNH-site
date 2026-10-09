/** ATTILA — first executable organic Vinted wave.
 * Uses only the verified profile URL until item URLs are verified.
 */
import {JUANPALAS_VINTED,buildVintedLaunchQueue} from './attila-vinted-juanpalas-launch.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function buildFirstVintedWave(){
 const queue=buildVintedLaunchQueue(),files={};
 for(const x of queue){
  const path='vinted/'+slug(x.theme)+'/index.html';
  const title=x.articleAngle;
  const body='<h1>'+esc(title)+'</h1><p>Une affiche peut devenir le point focal d’un mur sans surcharger la pièce. Commencez par choisir son emplacement, puis adaptez le cadre et les éléments voisins à son univers.</p><h2>Créer une composition cohérente</h2><p>Laissez de l’espace autour du visuel, évitez l’accumulation et choisissez un cadre qui complète l’affiche plutôt que de la dominer.</p><h2>Avant d’acheter</h2><p>Consultez toujours l’annonce pour vérifier les photos, le format, l’état, le prix et la disponibilité actuels.</p><p><a href="'+esc(x.destination)+'" rel="noopener noreferrer">Voir les affiches disponibles sur Vinted</a></p>';
  files[path]='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>'+esc(title).slice(0,70)+'</title><meta name="description" content="'+esc(('Idées de décoration autour de '+x.seoQuery+'. Découvrez les affiches actuellement proposées par juanpalas sur Vinted.').slice(0,155))+'"></head><body><main>'+body+'</main></body></html>';
 }
 files['vinted/index.html']='<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow,noarchive"><title>Affiches et posters vintage — sélection Vinted</title></head><body><main><h1>Affiches et posters</h1><p>Idées déco autour du cinéma, du rock et du jazz.</p>'+queue.map(x=>'<p><a href="./'+slug(x.theme)+'/">'+esc(x.articleAngle)+'</a></p>').join('')+'<p><a href="'+JUANPALAS_VINTED.profileUrl+'">Voir le profil Vinted juanpalas</a></p></main></body></html>';
 return {agent:'ATTILA',mission:'TOILE_D_OR_WAVE_1',files,pages:Object.keys(files).length,destination:JUANPALAS_VINTED.profileUrl,status:'BUILD_READY_NOT_DEPLOYED'};
}
