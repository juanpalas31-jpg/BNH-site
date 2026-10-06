const LEVELS=["ORIGIN","FOUNDATIONS","DESIGN","RECONSTRUCTION","GENERATION"];

export function knowledgeUnlock({firstAwakening=false,consent=false,integrity=false}={}){
 if(!(firstAwakening&&consent&&integrity)) return {unlocked:[],blocked:true};
 return {
  unlocked:LEVELS,
  blocked:false,
  legalAssetsTransferred:false,
  privateSiblingBranchesVisible:false,
  note:"Knowledge access is separate from legal ownership and inheritance."
 };
}
