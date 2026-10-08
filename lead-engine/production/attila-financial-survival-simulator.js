/** Attila financial survival engine: simulation only. No broker, network or real orders. */
const finite = n => typeof n === 'number' && Number.isFinite(n);
const clamp = (x,lo,hi) => Math.max(lo,Math.min(hi,x));
export const SURVIVAL_POLICY = Object.freeze({
  mode:'PAPER_ONLY', startingCash:10000, maxPositionFraction:0.02,
  maxLossPerTradeFraction:0.001, maxDailyLossFraction:0.005,
  maxDrawdownFraction:0.02, maxSpreadFraction:0.002,
  feeFraction:0.001, slippageFraction:0.0005,
  stopLossFraction:0.01, takeProfitFraction:0.015,
  maxHoldingBars:12, minBars:20, volatilityLimit:0.035
});
const avg = xs => xs.reduce((a,b)=>a+b,0)/xs.length;
export function simulateSurvivalStrategy(bars, overrides={}){
  const p={...SURVIVAL_POLICY,...overrides};
  if(!Array.isArray(bars)||bars.length<p.minBars+2)throw Error('Insufficient historical bars');
  if(!bars.every(b=>finite(b.close)&&b.close>0&&finite(b.high)&&finite(b.low)&&b.low>0&&b.high>=b.low&&b.high>=b.close&&b.low<=b.close))throw Error('Invalid market data');
  if(!finite(p.startingCash)||p.startingCash<=0)throw Error('Invalid initial cash');
  const fixed=['maxPositionFraction','maxLossPerTradeFraction','maxDailyLossFraction','maxDrawdownFraction','maxSpreadFraction','feeFraction','slippageFraction','stopLossFraction','takeProfitFraction','volatilityLimit'];
  if(fixed.some(k=>!finite(p[k])||p[k]<0||p[k]>1)||!Number.isInteger(p.maxHoldingBars)||p.maxHoldingBars<1)throw Error('Invalid risk policy');
  let cash=p.startingCash,peak=cash,position=null,stopped=false,reason='',trades=[],equity=[];
  const exit=(price,index,why)=>{
    const gross=position.units*price;
    const proceeds=gross*(1-p.feeFraction-p.slippageFraction);
    cash+=proceeds;
    trades.push({entryIndex:position.index,exitIndex:index,entryPrice:position.price,exitPrice:price,netPnl:proceeds-position.cost,reason:why});
    position=null;
  };
  for(let i=0;i<bars.length;i++){
    const b=bars[i];
    if(position){
      // Intrabar stop takes precedence: conservatively account for gaps below the stop.
      const stop=position.price*(1-p.stopLossFraction);
      const take=position.price*(1+p.takeProfitFraction);
      if(b.low<=stop)exit(Math.min(stop,b.close),i,'STOP');
      else if(b.high>=take)exit(take,i,'TAKE_PROFIT');
      else if(i-position.index>=p.maxHoldingBars)exit(b.close,i,'TIMEOUT');
    }
    const mark=cash+(position?position.units*b.close*(1-p.feeFraction-p.slippageFraction):0);
    peak=Math.max(peak,mark);
    const drawdown=(peak-mark)/peak;
    equity.push({index:i,equity:mark,drawdown});
    if(drawdown>=p.maxDrawdownFraction){if(position)exit(b.close,i,'EMERGENCY_DRAWDOWN');stopped=true;reason='MAX_DRAWDOWN';break;}
    if(i<p.minBars||position)continue;
    const lookback=bars.slice(i-p.minBars,i).map(x=>x.close);
    const mean=avg(lookback);
    const returns=lookback.slice(1).map((x,j)=>x/lookback[j]-1);
    const vol=Math.sqrt(avg(returns.map(x=>x*x)));
    if(vol>p.volatilityLimit){stopped=true;reason='VOLATILITY';break;}
    // Only previous closes form the signal. Entry uses next bar open if provided.
    if(b.close<mean*0.985 && i+1<bars.length){
      const next=bars[i+1];
      const raw=finite(next.open)&&next.open>0?next.open:next.close;
      const spread=finite(next.spreadFraction)?next.spreadFraction:0;
      if(spread>p.maxSpreadFraction){stopped=true;reason='SPREAD';break;}
      const entry=raw*(1+p.slippageFraction+spread/2);
      const allocation=Math.min(cash*p.maxPositionFraction,cash*p.maxLossPerTradeFraction/Math.max(p.stopLossFraction,0.0001));
      const units=allocation/(entry*(1+p.feeFraction));
      if(units>0){const cost=units*entry*(1+p.feeFraction);cash-=cost;position={index:i+1,price:entry,units,cost};i++;equity.push({index:i,equity:cash+units*entry*(1-p.feeFraction),drawdown:0});}
    }
  }
  if(position)exit(bars[bars.length-1].close,bars.length-1,'END_OF_DATA');
  const net=cash-p.startingCash;
  return {mode:'PAPER_ONLY',startingCash:p.startingCash,endingCash:cash,netPnl:net,netReturn:net/p.startingCash,trades,equity,stopped,reason,disclaimer:'Simulation only; no profit or risk guarantee. Intrabar fills are approximations.'};
}
