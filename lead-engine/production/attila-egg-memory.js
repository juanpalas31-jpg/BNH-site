/** ATTILA egg memory: evidence-based, revisable child observations.
 * DO NOT COMMIT real children's names, conversations, dates of birth, health or media.
 * The caller must store any private input separately in an access-controlled vault.
 */
const KINDS=['CHILD_QUOTE','OBSERVED_INTEREST','PARENT_INTERPRETATION','CHILD_CORRECTION','FOLLOW_UP'];
const validId=s=>typeof s==='string'&&/^[A-Za-z0-9_-]{1,64}$/.test(s);
export function makeEggMemoryDraft({workspaceId,childSlot,observations=[]}={}){
 if(!validId(workspaceId)||!['CHILD_A','CHILD_B'].includes(childSlot)||!Array.isArray(observations)||observations.length>30)throw Error('INVALID_EGG_INPUT');
 const items=observations.map((o,i)=>{
  if(!o||!KINDS.includes(o.kind)||typeof o.text!=='string'||!o.text.trim()||o.text.length>1500||typeof o.observedAt!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(o.observedAt))throw Error('INVALID_OBSERVATION');
  return {id:i+1,kind:o.kind,text:o.text.trim(),observedAt:o.observedAt,source:o.source==='CHILD'?'CHILD':'PARENT',confidence:o.kind==='PARENT_INTERPRETATION'?'HYPOTHESIS':'REPORTED',reviewable:true};
 });
 return {workspaceId,childSlot,status:'DRAFT_NOT_STORED',observations:items,privacy:'PRIVATE_VAULT_REQUIRED',diagnosis:false,personalityScore:null,adaptiveRule:'ASK_CHILD_BEFORE_PERSONALIZING',parentReviewRequired:true,childCorrectionAllowed:true,publicUploadAllowed:false};
}
export function proposeEggActivities(draft){
 if(!draft||draft.status!=='DRAFT_NOT_STORED'||!Array.isArray(draft.observations))throw Error('INVALID_DRAFT');
 const topics=draft.observations.filter(o=>o.kind==='OBSERVED_INTEREST'||o.kind==='CHILD_QUOTE').map(o=>o.text.slice(0,100));
 return {childSlot:draft.childSlot,topicsForConversation:topics.slice(0,5),suggestion:'Offer choices based on recent interests; ask child whether they still enjoy them.',status:'SUGGESTIONS_ONLY',diagnosis:false,externalActions:false};
}
