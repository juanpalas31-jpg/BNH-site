/** Spider Engine — Premier Envol. Original fictional legacy experience, not a real inheritance transfer. */
export const FIRST_FLIGHT_DNA=Object.freeze({
 id:'PREMIER_ENVOL',version:1,style:'CINEMATIC_HEROIC',origin:'NID_ORIGINEL',
 scenario:'FOUNDER_ABSENT',heirs:2,release:'SIMULTANEOUS',
 representation:{founder:'BLACK_FATHER',children:'MIXED_RACE_BROTHERS'},
 privacy:'NO_PRIVATE_MEMORIES_OR_MEDIA_EMBEDDED_IN_SOURCE',
 identity:'VERIFIED_EXTERNAL_AUTHENTICATION_REQUIRED',
 noAutomatedInheritance:true,noImpersonation:true
});
const chapters=Object.freeze([
 {id:'ORIGIN',title:'Le Nid Originel',narrator:'ATTILA',line:"Tout a commencé dans un garage. Avec une idée, du courage et beaucoup de travail."},
 {id:'MESSAGE',title:'La voix du fondateur',narrator:'FOUNDER_RECORDING',line:"Mes fils, si vous découvrez ceci, je ne suis plus à vos côtés. Mais je vous laisse une histoire et la liberté d'écrire la vôtre."},
 {id:'AWAKENING',title:'La rencontre',narrator:'ATTILA',line:"Bienvenue à vous deux. Votre père a préparé ce voyage pour que vous le découvriez ensemble."},
 {id:'LEGACY',title:'Deux héritiers',narrator:'ATTILA',line:"Vous accédez au même moment aux connaissances qui vous sont destinées. Chacun reste libre de son chemin."},
 {id:'TIMELINE',title:'Les générations',narrator:'ATTILA',line:"Chaque année révèle des accomplissements vérifiés. L'avenir n'est pas écrit."},
 {id:'FLIGHT',title:'Le Premier Envol',narrator:'ATTILA',line:"Deux héritiers. Une même origine. Des avenirs infinis."}
]);
export function getFirstFlightStoryboard(){return {dna:FIRST_FLIGHT_DNA,chapters:chapters.map(c=>({...c})),preview:true};}
export function requestFirstFlightActivation({heirIds=[],verified=false,founderMessageAuthorized=false}={}){
 const unique=Array.isArray(heirIds)&&heirIds.length===2&&heirIds.every(id=>typeof id==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(id))&&heirIds[0]!==heirIds[1];
 const eligible=unique&&verified===true&&founderMessageAuthorized===true;
 return {status:eligible?'READY_FOR_EXTERNAL_AUTHORIZED_RELEASE':'LOCKED',simultaneous:true,
  released:false,externalActions:false,reason:eligible?'EXTERNAL_RELEASE_SERVICE_REQUIRED':'BOTH_HEIRS_AND_AUTHORIZATION_REQUIRED'};
}
