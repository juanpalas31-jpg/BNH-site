/** Attila Financial Universe: multi-sense arachnid market observer. Paper-only. */
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const std=a=>{const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)));};
const valid=x=>typeof x==='number'&&Number.isFinite(x);
export const FINANCIAL_UNIVERSE_POLICY=Object.freeze({
  mode:'PAPER_ONLY',minBars:30,maxBars:1000,
  riskLabels:['DOCILE','CAUTION','DANGEROUS','EXTREME','UNKNOWN'],
  autonomousLiveOrders:false,autonomousSpending:false,brokerAccess:false,
  stopOnMissingData:true,stopOnAnomaly:true
});
/** Input: ordered OHLCV bars, optional spreadFraction, with no future data. */
export function senseMarket(bars,{market='UNSPECIFIED'}={}){
  if(!Array.isArray(bars)||bars.length<30||bars.length>1000)return {market,environment:'UNKNOWN',action:'RETREAT',reasons:['INSUFFICIENT_DATA'],senses:{}};
  if(!bars.every(b=>valid(b.open)&&valid(b.high)&&valid(b.low)&&valid(b.close)&&b.open>0&&b.low>0&&b.high>=Math.max(b.open,b.close)&&b.low<=Math.min(b.open,b.close)))return {market,environment:'UNKNOWN',action:'RETREAT',reasons:['INVALID_DATA'],senses:{}};
  const closes=bars.map(b=>b.close),returns=closes.slice(1).map((v,i)=>Math.log(v/closes[i]));
  const last=bars.at(-1),window=returns.slice(-20),vol=std(window),prior=returns.slice(-30,-10),priorVol=std(prior);
  const range=(last.high-last.low)/last.close;
  const recentHigh=Math.max(...bars.slice(-20).map(b=>b.high)),recentLow=Math.min(...bars.slice(-20).map(b=>b.low));
  const trend=(closes.at(-1)/mean(closes.slice(-20)))-1;
  const momentum=mean(returns.slice(-5));
  const spread=valid(last.spreadFraction)?last.spreadFraction:null;
  const volumePresent=bars.slice(-20).every(b=>valid(b.volume)&&b.volume>=0);
  const volumes=volumePresent?bars.slice(-20).map(b=>b.volume):[];
  const liquidity=volumePresent?last.volume/(mean(volumes)||1):null;
  const anomalies=[];
  if(vol>0.035||range>0.08)anomalies.push('EXTREME_VOLATILITY');
  if(priorVol>0&&vol>priorVol*2.5)anomalies.push('VOLATILITY_SHOCK');
  if(spread!==null&&spread>0.003)anomalies.push('WIDE_SPREAD');
  if(liquidity!==null&&liquidity<0.15)anomalies.push('LOW_RELATIVE_VOLUME');
  const missing=[];if(spread===null)missing.push('SPREAD_UNKNOWN');if(liquidity===null)missing.push('VOLUME_UNKNOWN');
  let environment='DOCILE';
  if(anomalies.length)environment=anomalies.some(x=>x==='EXTREME_VOLATILITY'||x==='VOLATILITY_SHOCK')?'EXTREME':'DANGEROUS';
  else if(vol>0.015||range>0.035||Math.abs(trend)>0.06||missing.length)environment='CAUTION';
  const senses={
    vibration:{volatility:vol,volatilityShock:priorVol>0?vol/priorVol:null},
    vision:{trend20:trend,momentum5:momentum,range20:(recentHigh-recentLow)/recentLow},
    touch:{lastBarRange:range,spreadFraction:spread},
    prey:{relativeVolume:liquidity},
    danger:{alerts:anomalies,missingSignals:missing}
  };
  return {market,environment,action:environment==='DOCILE'?'OBSERVE_OPPORTUNITY':environment==='CAUTION'?'WAIT':'RETREAT',senses,reasons:[...anomalies,...missing],liveOrdersPermitted:false,confidence:missing.length?'LIMITED':'DATA_DEPENDENT',note:'No market is risk-free. This classification is heuristic, not an investment recommendation.'};
}
/** Build a hypothetical web: signal -> paper research, never orders. */
export function weavePaperWeb(observation){
  const safe=observation?.environment==='DOCILE'&&observation?.action==='OBSERVE_OPPORTUNITY';
  return {market:observation?.market||'UNSPECIFIED',webType:'RESEARCH_ONLY',state:safe?'PAPER_BACKTEST_CANDIDATE':'RETRACTED',liveOrdersPermitted:false,steps:safe?['RECORD_SIGNAL','TEST_HISTORICAL_EDGE','CHECK_FEES_AND_SLIPPAGE','REVIEW_DRAWDOWN','HUMAN_REVIEW']:['DO_NOT_TRADE','WAIT_FOR_NEW_DATA'],incomePromise:false};
}
