/** Attila Vivarium — educational language and psychomotor exercise library.
 * Generic public-domain-style activities only; NOT speech therapy, diagnosis,
 * assessment or treatment. No child identities, scores or medical data stored.
 * Sources: HAS TDAH 2024; ameli language/coordination guidance 2024-25.
 */
export const DEVELOPMENT_POLICY=Object.freeze({
 version:1,mode:'FAMILY_EDUCATIONAL_PRACTICE',clinicalDevice:false,
 diagnoses:false,medicalClaims:false,childDataStorage:false,
 qualifiedProfessionalRequiredForRehabilitation:true,
 consentRequiredForRecording:true,physicalSafety:'SUPERVISED_CLEAR_SPACE',
 sources:Object.freeze([
 'https://www.has-sante.fr/jcms/p_3302482',
 'https://www.ameli.fr/assure/sante/themes/trouble-deficit-attention-hyperactivite-tdah/soins-prescrits-traitement',
 'https://www.ameli.fr/assure/sante/themes/troubles-langage-ecrit/prise-charge-medicale-reeducation',
 'https://www.ameli.fr/assure/sante/themes/dyspraxie-enfant/soins-reeducation'
 ])
});
const exercises=[
 ['phoneme-hunt','LANGUAGE','Repérage des sons','Trouver des mots commençant par le même son',6,8,'AUDIO'],
 ['syllable-clap','LANGUAGE','Rythme des syllabes','Frapper les syllabes de mots simples',5,7,'AUDIO_MOVEMENT'],
 ['rhyming','LANGUAGE','Rimes','Associer des mots qui riment',6,8,'AUDIO'],
 ['sound-blending','LANGUAGE','Fusion de sons','Assembler des sons présentés lentement',6,8,'AUDIO'],
 ['word-categories','LANGUAGE','Catégories de mots','Classer des mots par thème',6,10,'SPEECH'],
 ['story-sequence','LANGUAGE','Histoires en images','Remettre des images dans un ordre logique',6,10,'VISUAL'],
 ['oral-summary','LANGUAGE','Résumé oral','Raconter une courte histoire avec ses mots',7,10,'SPEECH'],
 ['reading-fluency','LITERACY','Lecture accompagnée','Lire un court texte sans pression de vitesse',7,8,'READING'],
 ['spelling-patterns','LITERACY','Régularités orthographiques','Comparer des mots de la même famille',7,10,'WRITING'],
 ['sentence-building','LITERACY','Construire des phrases','Réordonner des mots pour former une phrase',7,8,'WRITING'],
 ['working-memory','ATTENTION','Consignes courtes','Retenir et exécuter deux ou trois consignes simples',6,6,'GAME'],
 ['stop-go','ATTENTION','Stop et départ','Bouger puis s’immobiliser à un signal',5,6,'MOVEMENT'],
 ['focus-switch','ATTENTION','Changer de règle','Classer des objets puis changer de critère',7,7,'GAME'],
 ['visual-search','ATTENTION','Recherche visuelle','Repérer des formes cibles parmi des distracteurs',6,7,'VISUAL'],
 ['balance-path','PSYCHOMOTOR','Parcours équilibre','Marcher sur une ligne tracée au sol',5,8,'MOVEMENT'],
 ['cross-lateral','PSYCHOMOTOR','Coordination croisée','Toucher doucement genou opposé avec la main',6,7,'MOVEMENT'],
 ['mirror-motion','PSYCHOMOTOR','Jeu du miroir','Imiter les mouvements lents d’un partenaire',5,8,'MOVEMENT'],
 ['spatial-map','PSYCHOMOTOR','Repères spatiaux','Suivre des indications devant, derrière, gauche, droite',6,8,'MOVEMENT'],
 ['rhythm-walk','PSYCHOMOTOR','Marche rythmée','Marcher au rythme de frappes régulières',5,8,'MOVEMENT'],
 ['target-toss','PSYCHOMOTOR','Coordination œil-main','Lancer une balle souple vers une cible large',6,8,'MOVEMENT'],
 ['finger-sequence','PSYCHOMOTOR','Motricité fine','Reproduire une courte séquence de doigts',6,6,'FINE_MOTOR'],
 ['body-map','PSYCHOMOTOR','Schéma corporel','Nommer et situer les parties du corps',5,7,'MOVEMENT'],
 ['breathing-pause','REGULATION','Pause calme','Respiration confortable et retour au calme',5,5,'RELAXATION'],
 ['emotion-story','REGULATION','Identifier les émotions','Décrire les émotions de personnages fictifs',6,8,'STORY']
];
export const DEVELOPMENT_EXERCISES=Object.freeze(exercises.map(([id,domain,title,instruction,minAge,minutes,mode])=>Object.freeze({id,domain,title,instruction,minAge,minutes,mode,clinicalValidation:false})));
export function listDevelopmentExercises({age,domain}={}){
 if(!Number.isInteger(age)||age<0||age>120)throw Error('INVALID_AGE');
 if(domain!==undefined&&!['LANGUAGE','LITERACY','ATTENTION','PSYCHOMOTOR','REGULATION'].includes(domain))throw Error('INVALID_DOMAIN');
 return DEVELOPMENT_EXERCISES.filter(e=>age>=e.minAge&&(!domain||e.domain===domain));
}
export function createDevelopmentSession({age,domain,limit=3}={}){
 if(!Number.isInteger(limit)||limit<1||limit>8)throw Error('INVALID_SESSION_LIMIT');
 const options=listDevelopmentExercises({age,domain}).slice(0,limit);
 return {kind:'EDUCATIONAL_PRACTICE',ageBand:age<13?'CHILD':age<18?'TEEN':'ADULT',
  exercises:options.map(({id,title,instruction,minutes,mode})=>({id,title,instruction,minutes,mode})),
  guidance:'Stop if pain, fatigue or distress occurs. No diagnosis or therapy claim.',
  supervision:age<18?'ADULT_PRESENT':'OPTIONAL',personalDataStored:false};
}
