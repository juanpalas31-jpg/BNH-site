const C=v=>Math.max(0,Math.min(1,Number(v)||0));
export function heartbeat({energy=1,load=0,queue=0}={}){
 const pressure=C(.45*C(load)+.35*C(queue/32)+.20*(1-C(energy)));
 return {organ:"DIGITAL_HEART",pressure,rate:Math.round(40+120*pressure),
  circulation_budget:Math.max(1,Math.round(16*(1-pressure)))};
}
export function circulate({heart={},signals=[],resources={}}={}){
 const budget=Math.max(1,heart.circulation_budget||1);
 const priority=[...signals].sort((a,b)=>(b.priority||0)-(a.priority||0)).slice(0,budget);
 return {organ:"HEMOLYMPH_BUS",delivered:priority,deferred:signals.length-priority.length,
  resources:{energy:C(resources.energy??1),compute:C(resources.compute??1),memory:C(resources.memory??1)}};
}
export function respiration({computeDemand=0,thermalLoad=0,energy=.8}={}){
 const demand=C(computeDemand),heat=C(thermalLoad),e=C(energy);
 const capacity=C(1-.55*heat-.25*(1-e));
 return {organ:"DIGITAL_RESPIRATION",capacity,intake:Math.min(demand,capacity),
  mode:capacity<.25?"THROTTLE":capacity<.55?"CONSERVE":"NORMAL"};
}
