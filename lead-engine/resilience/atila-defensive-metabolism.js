const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
export function defensiveMetabolism(state={},event={}){
 const s={energy:clamp(state.energy??1),load:clamp(state.load||0),
  suppressed:Number(state.suppressed)||0,handled:Number(state.handled)||0};
 const cost=clamp(event.cost??.04),duplicate=event.duplicate===true;
 if(duplicate){s.suppressed+=1;s.energy=clamp(s.energy-.002);return s;}
 s.handled+=1;s.energy=clamp(s.energy-cost);s.load=clamp(s.load+cost*.8);return s;
}
export function defenseThrottle(state={}){
 const energy=clamp(state.energy??1),load=clamp(state.load||0);
 if(energy<.18||load>.88)return {mode:"SURVIVAL",replicant_limit:1,merge_duplicates:true,wake_atila:true};
 if(energy<.38||load>.68)return {mode:"CONSERVE",replicant_limit:3,merge_duplicates:true,wake_atila:false};
 return {mode:"READY",replicant_limit:12,merge_duplicates:true,wake_atila:false};
}
export function recoverDefense(state={},rest=.1){
 return {...state,energy:clamp((state.energy??0)+rest),load:clamp((state.load||0)-rest*.75)};
}
