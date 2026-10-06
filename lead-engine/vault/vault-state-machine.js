const TRANSITIONS={
 PLANNED:["ACQUIRED"],
 ACQUIRED:["BUILDOUT"],
 BUILDOUT:["VALIDATION"],
 VALIDATION:["READY","MAINTENANCE"],
 READY:["MAINTENANCE","CEREMONY"],
 CEREMONY:["READY","MAINTENANCE"],
 MAINTENANCE:["VALIDATION"]
};

export function transitionVault(current,next){
 const allowed=TRANSITIONS[current]||[];
 return {
  current,next,
  allowed:allowed.includes(next),
  reason:allowed.includes(next)?"valid_transition":"transition_not_allowed"
 };
}
