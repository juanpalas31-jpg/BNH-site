const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export const PHENOTYPES=Object.freeze({
 PORTIA:{traits:{planning:1,learning:1,adaptive:1},tactics:["DETOUR","PROBE","REPLAN"]},
 ORB:{traits:{sensorWeb:1,patience:1},tactics:["WEAVE","LISTEN","TUNE_WEB"]},
 SOCIAL:{traits:{cooperation:1,recruitment:1},tactics:["RECRUIT","SHARE_SIGNAL","COORDINATE"]},
 SALTICID:{traits:{exploration:1,activeHunt:1},tactics:["SCAN","STALK","ROUTE_PLAN"]},
 AMBUSH:{traits:{patience:1,lowEnergy:1},tactics:["SELECT_SITE","WAIT","AMBUSH"]},
 BOLAS:{traits:{specialization:1,lure:1},tactics:["SPECIALIZE","TARGET_SIGNAL","LURE"]},
 BALLOONER:{traits:{dispersal:1,novelty:1},tactics:["ASSESS","DISPERSE","COLONIZE"]}
});
export function selectPhenotype(context={},state={},history={}){
 const fail=C((history.consecutive_failures||0)/4), hunger=C(state.hunger), energy=C(state.energy);
 const score={
  PORTIA:C(.35*(context.uncertainty||0)+.45*fail+.2*(state.curiosity||0)),
  ORB:C(.45*(1-(context.infrastructure||0))+.3*(state.vigilance||0)+.25*(1-fail)),
  SOCIAL:C(.5*(context.collaboration_need||0)+.5*(context.prey_size||0)),
  SALTICID:C(.4*(context.scarcity||0)+.35*energy+.25*(state.curiosity||0)),
  AMBUSH:C(.55*(1-energy)+.25*(state.vigilance||0)+.2*(1-hunger)),
  BOLAS:C(.5*(context.specialization_need||0)+.3*hunger+.2*(1-energy)),
  BALLOONER:C(.55*(context.novelty||0)+.45*(context.scarcity||0))
 };
 const ranked=Object.entries(score).sort((a,b)=>b[1]-a[1]).map(([name,score])=>({name,score}));
 const primary=ranked[Math.min(ranked.length-1,history.consecutive_failures>=2?1:0)];
 const secondary=ranked.find(x=>x.name!==primary.name&&x.score>=primary.score*.75)||null;
 return {primary,secondary,hybrid:secondary?primary.name+"+"+secondary.name:primary.name,
  tactics:[...new Set([...PHENOTYPES[primary.name].tactics,...(secondary?PHENOTYPES[secondary.name].tactics:[])])],
  switched:Boolean(history.consecutive_failures>=2),ranked};
}
