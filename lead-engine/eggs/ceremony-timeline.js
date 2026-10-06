const PHASES=[
 {id:"silence",minSeconds:2},
 {id:"boot",minSeconds:4},
 {id:"recognition",minSeconds:3},
 {id:"spider_reveal",minSeconds:5},
 {id:"founder_presence",minSeconds:8},
 {id:"personal_message",minSeconds:1},
 {id:"bonding",minSeconds:5},
 {id:"legacy_unlock",minSeconds:3}
];

export function ceremonyTimeline(profile={}){
 return PHASES.map((phase,index)=>({
  ...phase,
  order:index+1,
  skippable:!["recognition","founder_presence"].includes(phase.id),
  intensity:profile[phase.id]?.intensity||"adaptive"
 }));
}
