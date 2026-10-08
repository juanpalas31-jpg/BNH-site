/** Attila / Spider Engine — evidence provenance for future egg memories.
 * Schema only. NEVER commit children's actual words, identity or psychological profiles.
 * Store actual entries in a private, parent-controlled encrypted system when available.
 */
const ROLES=['CHILD','PARENT','OTHER'];
const TYPES=['QUESTION','ANSWER','SPONTANEOUS_STATEMENT','OBSERVATION','INTERPRETATION','CORRECTION'];
export function draftEvidenceRecord({workspaceId,childSlot,turns=[],interpretations=[]}={}){
 if(typeof workspaceId!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(workspaceId)||!['CHILD_A','CHILD_B'].includes(childSlot))throw Error('INVALID_CONTEXT');
 if(!Array.isArray(turns)||turns.length>80||!Array.isArray(interpretations)||interpretations.length>20)throw Error('INVALID_ITEMS');
 const timeline=turns.map((t,i)=>{
  if(!t||!ROLES.includes(t.speaker)||!TYPES.includes(t.type)||t.type==='INTERPRETATION'||typeof t.text!=='string'||!t.text.trim()||t.text.length>1500)throw Error('INVALID_TURN');
  return {id:i+1,speaker:t.speaker,type:t.type,text:t.text.trim(),promptedBy:t.promptedBy===null?null:Number.isInteger(t.promptedBy)&&t.promptedBy>0&&t.promptedBy<=i?t.promptedBy:null};
 });
 const hypotheses=interpretations.map((h,i)=>{
  if(!h||typeof h.text!=='string'||!h.text.trim()||h.text.length>600||!Array.isArray(h.basedOn)||!h.basedOn.length||h.basedOn.some(n=>!Number.isInteger(n)||n<1||n>timeline.length))throw Error('INVALID_HYPOTHESIS');
  return {id:i+1,text:h.text.trim(),basedOn:[...new Set(h.basedOn)],certainty:'TENTATIVE',diagnosis:false,reviewRequired:true};
 });
 return {workspaceId,childSlot,status:'PRIVATE_DRAFT_NOT_PERSISTED',timeline,hypotheses,rights:{childMayCorrect:true,childMayDeclineRecall:true,parentReview:true},automaticPersonalityLabeling:false,publicUploadAllowed:false};
}
export function summarizeEvidence(record){
 if(!record||record.status!=='PRIVATE_DRAFT_NOT_PERSISTED')throw Error('INVALID_RECORD');
 return {childSlot:record.childSlot,childStatements:record.timeline.filter(t=>t.speaker==='CHILD').length,parentQuestions:record.timeline.filter(t=>t.speaker==='PARENT'&&t.type==='QUESTION').length,hypotheses:record.hypotheses.length,storage:'NOT_PERSISTED'};
}
