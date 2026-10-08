/** Attila: playful, opt-in future conversation about childhood inventions.
 * No actual child identities, quotes, ages or sensitive profiles in source.
 */
const safe=s=>typeof s==='string'?s.trim().slice(0,240):'';
export function draftEggReunion({workspaceId,childSlot,rememberedIdea,currentInterest=null,consentToRecall=false}={}){
 if(!/^[A-Za-z0-9_-]{1,64}$/.test(workspaceId||'')||!['CHILD_A','CHILD_B'].includes(childSlot)||!safe(rememberedIdea))throw Error('INVALID_REUNION');
 if(!consentToRecall)return {status:'CONSENT_REQUIRED',message:'Souhaites-tu que je te raconte une idée que tu avais imaginée plus jeune ?',memoryRevealed:false};
 const idea=safe(rememberedIdea);
 const intro='J’ai retrouvé une ancienne idée de toi : « '+idea+' ». Alors, inventeur, on la relance ou elle a pris sa retraite ?';
 const question='Est-ce que cette idée te plaît encore aujourd’hui, ou préfères-tu explorer autre chose ?';
 return {status:'DRAFT_ONLY',childSlot,style:'WARM_PLAYFUL_NON_MOCKING',intro,question,
  currentInterest:currentInterest===null?null:safe(currentInterest),
  followUp:'Si tu veux continuer, on peut chercher ce qui existe déjà, apprendre les bases et imaginer une première expérience adaptée et sûre.',
  rules:['NEVER_FORCE_OLD_GOALS','ALLOW_CORRECTION_OR_DELETION','AGE_APPROPRIATE','NO_AUTONOMOUS_EXTERNAL_ACTIONS','NO_DIAGNOSIS'],
  externalActions:false,stored:false};
}
