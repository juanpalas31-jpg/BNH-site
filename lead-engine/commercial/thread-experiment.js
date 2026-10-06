export function proposeThreadExperiment({threadId,hypothesis,variant,baseline}={}){
 if(!threadId||!hypothesis||!variant) throw new Error("experiment_fields_required");
 return {
  threadId,hypothesis,variant,baseline:baseline||"current",
  status:"PROPOSED",
  automaticPublication:false,
  automaticWinner:false,
  promotionRequires:["minimum_sample","measured_business_lift","human_review"]
 };
}

export function evaluateThreadExperiment({baselineSales=0,variantSales=0,baselineSamples=0,variantSamples=0,minSamples=100}={}){
 const enough=baselineSamples>=minSamples&&variantSamples>=minSamples;
 const baseRate=baselineSamples?baselineSales/baselineSamples:0;
 const variantRate=variantSamples?variantSales/variantSamples:0;
 return {enoughEvidence:enough,baseRate,variantRate,lift:baseRate?variantRate/baseRate-1:null,recommend:enough&&variantRate>baseRate?"REVIEW_VARIANT":"KEEP_LEARNING"};
}
