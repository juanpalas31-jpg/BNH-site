/** Spider Engine: superhero-inspired evolution timeline, grounded in verified milestones. */
export const EVOLUTION_DNA=Object.freeze({
 version:1,epochYear:2026,theme:'HEROIC_GENERATIONAL_CHRONICLE',
 eras:[{id:'ORIGIN',label:'Le Nid Originel',start:0,end:0},
 {id:'ASCENSION',label:"L'Ascension",start:1,end:3},
 {id:'FORTRESS',label:'La Forteresse',start:4,end:10},
 {id:'LEGACY',label:'Les Héritiers',start:11,end:null}],
 privacy:'NO_PERSONAL_IDENTIFIERS_IN_PUBLIC_CHRONICLE',
 transfer:'CAPABILITIES_ONLY_WITH_VERIFIED_AUTHORIZATION',
 disclaimer:'FUTURE_ERAS_ARE_STORY_GOALS_NOT_FORECASTS'
});
const safeInt=(n,min,max)=>Number.isInteger(n)&&n>=min&&n<=max;
export function calculateEvolution({year=2026,generation=1,milestones=[]}={}){
 if(!safeInt(year,EVOLUTION_DNA.epochYear,9999))throw Error('INVALID_YEAR');
 if(!safeInt(generation,1,999))throw Error('INVALID_GENERATION');
 if(!Array.isArray(milestones)||milestones.length>1000)throw Error('INVALID_MILESTONES');
 const age=year-EVOLUTION_DNA.epochYear;
 const era=EVOLUTION_DNA.eras.find(e=>age>=e.start&&(e.end===null||age<=e.end));
 const verified=milestones.filter(m=>m&&typeof m==='object'&&m.verified===true&&typeof m.id==='string'&&/^[A-Z0-9_-]{1,48}$/.test(m.id));
 const achievements=[...new Set(verified.map(m=>m.id))];
 const level=1+achievements.length;
 return {year,yearEquivalent:age,generation,era:era.id,eraTitle:era.label,
  heroTitle:generation===1?'FONDATEURS':'HERITIERS',
  level,verifiedAchievements:achievements,unverifiedMilestones:milestones.length-verified.length,
  timelineStatus:'NARRATIVE_PROGRESS_NOT_FINANCIAL_FORECAST',externalActions:false};
}
export function buildEvolutionTimeline({fromYear=2026,toYear=2036,generation=1,milestones=[]}={}){
 if(!safeInt(fromYear,2026,9999)||!safeInt(toYear,fromYear,9999)||toYear-fromYear>150)throw Error('INVALID_YEAR_RANGE');
 return Array.from({length:toYear-fromYear+1},(_,i)=>calculateEvolution({year:fromYear+i,generation,milestones:milestones.filter(m=>m?.year===fromYear+i)}));
}
