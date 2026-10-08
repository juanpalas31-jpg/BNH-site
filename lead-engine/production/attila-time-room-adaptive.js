/** Attila Salle du Temps: age-, time- and space-adaptive brain/body sessions.
 * Educational simulator, no clinical claims or real-world tactical instruction.
 * No names, diagnoses or personal performance data are persisted.
 */
const DOMAINS=Object.freeze(['LOGIC','RUBIKS_CUBE','MATH','PHYSICS','MEMORY','OBSERVATION','LANGUAGE','COORDINATION','MOVEMENT','DECISION']);
const ACTIVITIES=Object.freeze([
 ['cube-basics','RUBIKS_CUBE',7,10,'DESK','Recognize faces, edges, corners; practice a simple first layer'],
 ['cube-patterns','RUBIKS_CUBE',10,12,'DESK','Practice a repeatable cube sequence and explain its effect'],
 ['logic-grids','LOGIC',7,8,'DESK','Solve a small deduction puzzle with visible clues'],
 ['logic-advanced','LOGIC',12,12,'DESK','Compare competing hypotheses using evidence'],
 ['mental-math','MATH',7,8,'DESK','Solve mental arithmetic patterns and explain steps'],
 ['physics-motion','PHYSICS',9,10,'CLEAR_SPACE','Predict and observe safe motion of a soft ball'],
 ['memory-chunks','MEMORY',7,7,'DESK','Memorize short sequences using chunking'],
 ['observation-change','OBSERVATION',7,7,'DESK','Spot changes in a displayed scene'],
 ['language-story','LANGUAGE',7,8,'DESK','Reconstruct a story and explain word choices'],
 ['coordination-mirror','COORDINATION',7,8,'CLEAR_SPACE','Mirror slow movements with a partner'],
 ['balance-line','MOVEMENT',7,8,'CLEAR_SPACE','Walk along a marked line without obstacles'],
 ['decision-safety','DECISION',9,8,'DESK','Choose safe, lawful responses to everyday scenarios']
].map(([id,domain,minAge,minutes,space,instruction])=>Object.freeze({id,domain,minAge,minutes,space,instruction})));
const HELP=Object.freeze(['DEMONSTRATION','STEP_BY_STEP','HINTS','INDEPENDENT']);
export const TIME_ROOM_ADAPTIVE_POLICY=Object.freeze({version:1,domains:DOMAINS,
 helpLevels:HELP,physicalSafety:'ADULT_SUPERVISION_FOR_MINORS',privateDataStored:false,
 professionalTherapy:false,externalSources:'REQUIRE_REVIEW_BEFORE_IMPORT'});
export function chooseAssistance({successfulAttempts=0,failedAttempts=0}={}){
 if(!Number.isInteger(successfulAttempts)||successfulAttempts<0||!Number.isInteger(failedAttempts)||failedAttempts<0)throw Error('INVALID_ATTEMPTS');
 if(failedAttempts>=3&&successfulAttempts===0)return 'DEMONSTRATION';
 if(successfulAttempts>=6)return 'INDEPENDENT';
 if(successfulAttempts>=3)return 'HINTS';
 return 'STEP_BY_STEP';
}
export function planTimeRoomSession({age,availableMinutes,space='DESK',domains=DOMAINS,successfulAttempts=0,failedAttempts=0}={}){
 if(!Number.isInteger(age)||age<5||age>120||!Number.isInteger(availableMinutes)||availableMinutes<5||availableMinutes>180||
 !['DESK','CLEAR_SPACE'].includes(space)||!Array.isArray(domains)||domains.length===0||domains.some(d=>!DOMAINS.includes(d)))throw Error('INVALID_SESSION_PREFERENCES');
 const assistance=chooseAssistance({successfulAttempts,failedAttempts});
 const available=ACTIVITIES.filter(a=>age>=a.minAge&&domains.includes(a.domain)&&(space==='CLEAR_SPACE'||a.space==='DESK'));
 const selected=[],used=new Set();let remaining=availableMinutes;
 while(true){
  const next=available.find(a=>!used.has(a.id)&&a.minutes<=remaining&&(!selected.length||a.domain!==selected[selected.length-1].domain))||
   available.find(a=>!used.has(a.id)&&a.minutes<=remaining);
  if(!next)break;
  selected.push({...next,assistance});used.add(next.id);remaining-=next.minutes;
 }
 return {mode:'EDUCATIONAL_IMMERSIVE_SESSION',ageBand:age<13?'CHILD':age<18?'TEEN':'ADULT',
  availableMinutes,plannedMinutes:availableMinutes-remaining,remainingMinutes:remaining,space,assistance,
  activities:selected,supervision:age<18?'ADULT_PRESENT':'OPTIONAL',actualSkillImprovement:'NOT_MEASURED',
  sourceReview:'REQUIRED_FOR_NEW_MATERIAL',physicalActionsExecuted:false};
}
