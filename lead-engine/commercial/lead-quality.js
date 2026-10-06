export function leadQuality(input={}){
 let score=0;
 if(input.serviceArea===true) score+=20;
 if(input.owner===true) score+=15;
 if(input.projectIdentified===true) score+=20;
 if(input.timelineKnown===true) score+=10;
 if(input.simulatorComplete===true) score+=10;
 if(input.requestedAssessment===true) score+=25;
 return {score,band:score>=70?"HIGH":score>=40?"MEDIUM":"LOW",autoReject:false};
}
