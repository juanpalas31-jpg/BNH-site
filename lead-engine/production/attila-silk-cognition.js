/** Chimera silk planning. Different architectures, no web required for free hunting. */
export const SILK_ARCHITECTURES=Object.freeze({
 ORB:{purpose:'FLYING_PREY',elasticity:'HIGH',adhesion:'HIGH'},
 TANGLE:{purpose:'MIXED_PREY',elasticity:'MEDIUM',adhesion:'VARIABLE'},
 SHEET:{purpose:'SMALL_PREY',elasticity:'MEDIUM',adhesion:'LOW'},
 FUNNEL:{purpose:'GROUND_PREY',elasticity:'MEDIUM',adhesion:'LOW'},
 BOLAS:{purpose:'MOTH',elasticity:'HIGH',adhesion:'HIGH'},
 NET_CAST:{purpose:'AMBUSH',elasticity:'HIGH',adhesion:'VARIABLE'},
 DRAGLINE:{purpose:'SAFETY',elasticity:'VARIABLE',adhesion:'LOW'},
 CRIBELLATE:{purpose:'SMALL_PREY',elasticity:'VARIABLE',adhesion:'DRY_FIBRILS'}
});
export function planSilk({terrain='UNKNOWN',target='UNKNOWN',risk=0,energy=100}={}){
 if(risk>=0.7||energy<15)return {build:false,strategy:'RETREAT'};
 if(terrain==='OPEN')return {build:false,strategy:'FREE_HUNT'};
 const kind=target==='MOTH'?'BOLAS':terrain==='VERTICAL'?'ORB':terrain==='GROUND'?'FUNNEL':terrain==='LOW_LIGHT'?'NET_CAST':'TANGLE';
 return {build:true,kind,profile:SILK_ARCHITECTURES[kind]};
}
