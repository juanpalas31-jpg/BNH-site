/** Attila defensive training curriculum: public, lawful, non-operational material.
 * No classified tactics, weapon instruction, assault tactics, or real-world operations.
 * This module is a catalog, not an endorsement by any named public agency.
 */
export const DEFENSIVE_TRAINING_POLICY=Object.freeze({
 version:1,sourceScope:'PUBLIC_AND_LAWFUL_ONLY',classification:'EDUCATIONAL',
 restricted:['CLASSIFIED_TACTICS','WEAPON_USE','BREACHING','SURVEILLANCE_EVASION','OFFENSIVE_OPERATIONS','RESTRAINT_TECHNIQUES'],
 childPolicy:'AGE_APPROPRIATE_NON_CONTACT_ONLY',physicalContactRequiresQualifiedInstructor:true,
 legalReviewRequired:true,realWorldOperations:false
});
export const DEFENSIVE_TRAINING_MODULES=Object.freeze([
 {id:'situational-awareness',title:'Observation et conscience de l’environnement',domains:['SELF_DEFENSE','CLOSE_PROTECTION'],minAge:7,mode:'OBSERVATION',skills:['repérer les sorties','identifier les zones sûres','demander de l’aide']},
 {id:'verbal-deescalation',title:'Désescalade et communication',domains:['SELF_DEFENSE','CLOSE_PROTECTION'],minAge:7,mode:'ROLEPLAY',skills:['garder son calme','poser des limites','éviter l’affrontement']},
 {id:'safe-movement',title:'Déplacement et évitement',domains:['SELF_DEFENSE','CLOSE_PROTECTION'],minAge:7,mode:'NON_CONTACT',skills:['garder une distance de sécurité','rejoindre une sortie','préserver son équilibre']},
 {id:'protective-planning',title:'Prévention et planification familiale',domains:['CLOSE_PROTECTION','CIVIL_PREPAREDNESS'],minAge:12,mode:'TABLETOP',skills:['plan de rendez-vous','contacts d’urgence','itinéraires alternatifs publics']},
 {id:'emergency-response',title:'Premiers secours et alerte',domains:['CIVIL_PREPAREDNESS','SELF_DEFENSE'],minAge:7,mode:'SIMULATION',skills:['appeler les secours','se mettre à l’abri','suivre les consignes des secouristes']},
 {id:'public-institutions',title:'Institutions et cadre légal',domains:['PUBLIC_SECURITY_STUDIES'],minAge:12,mode:'THEORY',skills:['missions publiques des institutions','droits et obligations','respect de la vie privée']},
 {id:'stress-regulation',title:'Gestion du stress',domains:['SELF_DEFENSE','CLOSE_PROTECTION'],minAge:7,mode:'BREATHING',skills:['respiration','prise de décision calme','retour au calme']},
 {id:'adult-protection-ethics',title:'Éthique de la protection rapprochée',domains:['CLOSE_PROTECTION'],minAge:18,mode:'THEORY',skills:['prévention','proportionnalité','recours aux professionnels agréés']}
].map(x=>Object.freeze({...x,domains:Object.freeze(x.domains),skills:Object.freeze(x.skills)})));
const ID=/^[a-z0-9-]{1,64}$/;
export function listDefensiveTraining({age,domain}={}){
 if(!Number.isInteger(age)||age<0||age>120)throw Error('INVALID_AGE');
 if(domain!==undefined&&(typeof domain!=='string'||!['SELF_DEFENSE','CLOSE_PROTECTION','CIVIL_PREPAREDNESS','PUBLIC_SECURITY_STUDIES'].includes(domain)))throw Error('INVALID_DOMAIN');
 return DEFENSIVE_TRAINING_MODULES.filter(m=>age>=m.minAge&&(!domain||m.domains.includes(domain))).map(m=>({id:m.id,title:m.title,mode:m.mode,skills:[...m.skills]}));
}
export function buildDefensiveSession({age,moduleId,durationMinutes=15}={}){
 if(!ID.test(moduleId)||!Number.isInteger(durationMinutes)||durationMinutes<5||durationMinutes>60)throw Error('INVALID_SESSION');
 const module=DEFENSIVE_TRAINING_MODULES.find(m=>m.id===moduleId);
 if(!module||!Number.isInteger(age)||age<module.minAge||age>120)throw Error('MODULE_NOT_ALLOWED_FOR_AGE');
 return {moduleId,title:module.title,durationMinutes,mode:module.mode,skills:[...module.skills],
  instructions:'Practice only in a safe environment; stop if uncomfortable. No physical confrontation.',
  supervision:age<18?'RESPONSIBLE_ADULT':'SELF_GUIDED_NON_CONTACT',
  completion:'NOT_STARTED',verifiedCompetence:false};
}
