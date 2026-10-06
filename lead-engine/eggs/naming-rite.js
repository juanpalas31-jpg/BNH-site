const STATES=["UNNAMED","REFLECTION","PROPOSED","ACCEPTED"];

export function startNamingRite({branchId}={}){
 if(!branchId) throw new Error("branch_required");
 return {
  branchId,state:"REFLECTION",
  activationUnlocked:false,
  mission:{
   id:"NAME_THE_SPIDER",
   purpose:"Choose a name that has considered personal meaning.",
   prompts:[
    "What do you want this Spider to represent beside you?",
    "What part of your future does the name point toward?",
    "What story, value or idea gives this name meaning?",
    "Would you still choose it after sleeping on it?"
   ]
  }
 };
}

export function evaluateNameProposal({name,meaning,reflection,confirmedLater=false}={}){
 const clean=String(name||"").trim();
 const explanation=[meaning,reflection].filter(Boolean).join(" ").trim();
 if(clean.length<2) return {state:"REFLECTION",accepted:false,reason:"name_too_short"};
 if(explanation.length<20) return {state:"REFLECTION",accepted:false,reason:"meaning_not_yet_explained"};
 if(!confirmedLater) return {state:"PROPOSED",accepted:false,reason:"reflection_period_not_complete"};
 return {state:"ACCEPTED",accepted:true,name:clean,reason:"recipient_confirmed_meaning_after_reflection"};
}
