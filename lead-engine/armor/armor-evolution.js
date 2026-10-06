export function proposeArmorEvolution({availableTech=[],recipientGoals=[],constraints=[]}={}){
 return {
   availableTech,
   recipientGoals,
   constraints,
   proposalOnly:true,
   requiresHumanEngineeringReview:true,
   requiresSafetyValidation:true,
   automaticPhysicalBuild:false
 };
}

export function technologyStatus(component={}){
 const allowed=new Set(["available","experimental","future","fiction"]);
 const status=allowed.has(component.status)?component.status:"unclassified";
 return {...component,status};
}
