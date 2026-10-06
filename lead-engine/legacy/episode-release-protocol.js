const MODES=["NORMAL","ACCELERATED","COMPASSIONATE_FULL_ACCESS"];

export function releaseMode(input={}){
 const normal=input.normal===true;
 const seriousCircumstance=input.seriousCircumstance===true;
 const recipientRequest=input.recipientRequest===true;
 const trustedHumanValidation=input.trustedHumanValidation===true;

 if(seriousCircumstance&&recipientRequest&&trustedHumanValidation){
  return {mode:"COMPASSIONATE_FULL_ACCESS",unlock:"ALL_RECIPIENT_AUTHORIZED_EPISODES",automaticMedicalInference:false};
 }
 if(seriousCircumstance&&trustedHumanValidation){
  return {mode:"ACCELERATED",unlock:"PRIORITIZE_HIGH_VALUE_EPISODES",automaticMedicalInference:false};
 }
 return {mode:"NORMAL",unlock:normal?"SCHEDULED_AND_MISSION_BASED":"NONE",automaticMedicalInference:false};
}
