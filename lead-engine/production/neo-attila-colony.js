/** Neo-Attila colony. Deterministic paper-only multi-agent simulation, no brokers or live orders. */
import { senseMarket, weavePaperWeb } from './attila-financial-universe.js';
const finite=x=>typeof x==='number'&&Number.isFinite(x);
export const NEO_ATTILA_POLICY=Object.freeze({
 mode:'PAPER_ONLY',agents:10,seedCapitalCents:1,maxAgents:100,
 feeRate:0.001,slippageRate:0.0005,
 targetMultiplier:2,maxLossFraction:0.10,
 dailyCyclesLimit:365,liveOrders:false,brokerAccess:false,
 stopOnDanger:true,neverPromiseReturns:true
});
/** Each cycle is a day. Agents cannot reuse future candles when deciding. */
export function simulateNeoAttilaColony(bars,options={}){
 const p={...NEO_ATTILA_POLICY,...options};
 if(!Array.isArray(bars)||bars.length<32||bars.length>2000)throw Error('Need 32–2000 ordered OHLC bars');
 if(!Number.isInteger(p.agents)||p.agents<1||p.agents>100||!Number.isInteger(p.dailyCyclesLimit)||p.dailyCyclesLimit<1||p.dailyCyclesLimit>365)throw Error('Invalid colony size or cycle count');
 if(!finite(p.seedCapitalCents)||p.seedCapitalCents<=0||!finite(p.feeRate)||p.feeRate<0||p.feeRate>=1||!finite(p.slippageRate)||p.slippageRate<0||p.slippageRate>=1||!finite(p.maxLossFraction)||p.maxLossFraction<0||p.maxLossFraction>1)throw Error('Invalid financial parameters');
 const colony=Array.from({length:p.agents},(_,i)=>({id:'NEO-'+String(i+1).padStart(3,'0'),balanceCents:p.seedCapitalCents,missions:0,wins:0,losses:0,retreated:0,alive:true}));
 const journal=[];let days=0;
 for(let i=30;i<bars.length-1&&days<p.dailyCyclesLimit;i++,days++){
   const observation=senseMarket(bars.slice(Math.max(0,i-999),i+1),{market:'SIMULATED'});
   const web=weavePaperWeb(observation);
   const today=bars[i],next=bars[i+1];
   if(!finite(today.close)||!finite(next.close)||today.close<=0||next.close<=0)throw Error('Invalid price');
   for(const neo of colony){
     if(!neo.alive)continue;
     if(web.state!=='PAPER_BACKTEST_CANDIDATE'){
       neo.retreated++;journal.push({day:days+1,agent:neo.id,action:'RETREAT',environment:observation.environment});continue;
     }
     // Simulate only one day exposure; a market move can lose money.
     const grossReturn=next.close/today.close-1;
     const netReturn=grossReturn-2*(p.feeRate+p.slippageRate);
     const before=neo.balanceCents;
     neo.balanceCents=Math.max(0,before*(1+netReturn));
     neo.missions++;
     if(netReturn>0)neo.wins++;else neo.losses++;
     if(neo.balanceCents<=p.seedCapitalCents*(1-p.maxLossFraction))neo.alive=false;
     journal.push({day:days+1,agent:neo.id,action:'PAPER_TRADE',beforeCents:before,afterCents:neo.balanceCents,netReturn,environment:observation.environment});
   }
 }
 const total=colony.reduce((s,x)=>s+x.balanceCents,0);
 return {mode:'PAPER_ONLY',days,initialCapitalCents:p.agents*p.seedCapitalCents,finalCapitalCents:total,netPnlCents:total-p.agents*p.seedCapitalCents,agents:colony,journal:journal.slice(-500),targetReached:colony.filter(x=>x.balanceCents>=p.seedCapitalCents*p.targetMultiplier).length,liveOrders:false,disclaimer:'No guarantee of doubling; simulated fractional cents and simplified execution. Real cent-sized orders may be impossible.'};
}
