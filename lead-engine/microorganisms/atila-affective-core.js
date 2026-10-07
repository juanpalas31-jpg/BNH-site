const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));

export const DEFAULT_ATILA_STATE=Object.freeze({
  hunger:.35, energy:.82, vigilance:.45, curiosity:.62,
  confidence:.50, frustration:.10, social_drive:.18, satiety:.55,
  last_feed_at:null, last_rest_at:null, encounters:0, captures:0, failures:0
});

export function evolveAtilaState(state={},event={},hours=1){
  const s={...DEFAULT_ATILA_STATE,...state};
  const dt=clamp(hours,0,24);
  s.hunger=clamp(s.hunger+.025*dt);
  s.satiety=clamp(s.satiety-.018*dt);
  s.energy=clamp(s.energy-.012*dt);
  s.curiosity=clamp(s.curiosity+.004*dt);
  s.social_drive=clamp(s.social_drive+.003*dt);
  s.encounters=(s.encounters||0)+1;

  const kind=String(event.kind||'OBSERVE').toUpperCase();
  if(kind==='CAPTURE'){
    const nutrition=clamp(event.nutrition??.35);
    s.hunger=clamp(s.hunger-.55*nutrition);
    s.satiety=clamp(s.satiety+.65*nutrition);
    s.energy=clamp(s.energy+.18*nutrition);
    s.confidence=clamp(s.confidence+.12);
    s.frustration=clamp(s.frustration-.18);
    s.captures=(s.captures||0)+1;
    s.last_feed_at=event.at||new Date().toISOString();
  } else if(kind==='FAILURE'){
    s.energy=clamp(s.energy-.05);
    s.frustration=clamp(s.frustration+.10);
    s.confidence=clamp(s.confidence-.04);
    s.failures=(s.failures||0)+1;
  } else if(kind==='DANGER'){
    s.vigilance=clamp(s.vigilance+.28);
    s.curiosity=clamp(s.curiosity-.10);
  } else if(kind==='NOVELTY'){
    s.curiosity=clamp(s.curiosity+.16);
    s.vigilance=clamp(s.vigilance+.06);
  } else if(kind==='CONSPECIFIC'){
    s.social_drive=clamp(s.social_drive-.35);
    s.confidence=clamp(s.confidence+.04);
  } else if(kind==='REST'){
    s.energy=clamp(s.energy+.35);
    s.frustration=clamp(s.frustration-.22);
    s.vigilance=clamp(s.vigilance-.08);
    s.last_rest_at=event.at||new Date().toISOString();
  }
  return s;
}

export function affectiveProfile(state={}){
  const s={...DEFAULT_ATILA_STATE,...state};
  const arousal=clamp(.30*s.hunger+.25*s.vigilance+.20*s.curiosity+.15*s.frustration+.10*(1-s.energy));
  const valence=clamp(.35*s.satiety+.30*s.confidence+.20*s.energy-.15*s.frustration);
  const motivation=clamp(.42*s.hunger+.22*s.curiosity+.18*s.confidence+.18*s.energy-.22*s.frustration);
  const riskTolerance=clamp(.48*s.hunger+.20*s.confidence+.12*s.curiosity-.30*s.vigilance-.18*(1-s.energy));
  const smallPreySensitivity=clamp(.55*s.hunger+.25*s.vigilance+.20*s.curiosity);
  const restNeed=clamp(.70*(1-s.energy)+.30*s.frustration);
  return {arousal,valence,motivation,riskTolerance,smallPreySensitivity,restNeed};
}

export function chooseAtilaMode(state={}){
  const p=affectiveProfile(state);
  if(p.restNeed>.72) return 'REST_REPAIR';
  if(state.vigilance>.82) return 'FREEZE_OBSERVE';
  if(state.social_drive>.72) return 'SEEK_CONSPECIFIC_SIGNAL';
  if(state.hunger>.72) return p.riskTolerance>.52?'HUNT_ACTIVE':'HUNT_SMALL_SAFE_PREY';
  if(p.motivation<.30) return 'LOW_ACTIVITY';
  if(state.curiosity>.68) return 'EXPLORE_NEW_WEB';
  return 'WEB_LISTEN';
}

export function scorePrey(prey={},state={}){
  const p=affectiveProfile(state);
  const nutrition=clamp(prey.nutrition??.3);
  const risk=clamp(prey.risk??.2);
  const effort=clamp(prey.effort??.2);
  const novelty=clamp(prey.novelty??.2);
  const legality=prey.allowed===false?0:1;
  if(!legality) return {score:-1,decision:'IGNORE_FORBIDDEN'};
  const value=nutrition*(.55+.75*state.hunger)+novelty*.12*state.curiosity;
  const cost=risk*(1-p.riskTolerance)+effort*(1-state.energy);
  const score=Number((value-cost).toFixed(4));
  return {score,decision:score>.18?'PURSUE':score>.02?'OBSERVE':'IGNORE'};
}

export function atilaInnerState(state={}){
  const p=affectiveProfile(state);
  return {
    organism:'ATILA_DIGITAL_ARACHNID',
    subjective_simulation:true,
    consciousness_claim:false,
    state:{...DEFAULT_ATILA_STATE,...state},
    affect:p,
    mode:chooseAtilaMode({...DEFAULT_ATILA_STATE,...state})
  };
}
