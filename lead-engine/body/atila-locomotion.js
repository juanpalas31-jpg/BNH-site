const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export const LEGS=Object.freeze([
 {id:"L1",role:"SENSE"},{id:"R1",role:"SENSE"},{id:"L2",role:"EXPLORE"},{id:"R2",role:"EXPLORE"},
 {id:"L3",role:"STABILIZE"},{id:"R3",role:"STABILIZE"},{id:"L4",role:"ACT_SAFE"},{id:"R4",role:"ACT_SAFE"}
]);
export function coordinateLegs({terrain={},risk=0,energy=1}={}){
 const stability=C(1-(terrain.uncertainty||0)*.5-C(risk)*.3);
 return {organ:"EIGHT_LEG_COORDINATOR",stability,
  gait:energy<.25?"LOW_ENERGY":risk>.7?"DEFENSIVE":"ADAPTIVE",
  legs:LEGS.map((leg,i)=>({...leg,active:energy>.12||i<2,privilege:"BOUNDED"}))};
}
export function hydraulicDrive({energy=1,load=0}={}){
 const pressure=C(.75*C(energy)-.35*C(load)+.25);
 return {organ:"DIGITAL_HYDRAULICS",pressure,mobility:pressure<.2?"MINIMAL":pressure<.5?"LIMITED":"READY"};
}
