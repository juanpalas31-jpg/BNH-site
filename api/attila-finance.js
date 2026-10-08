import { simulateSurvivalStrategy, SURVIVAL_POLICY } from '../lead-engine/production/attila-financial-survival-simulator.js';
const json=(res,status,data)=>res.status(status).json(data);
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method==='GET')return json(res,200,{app:'Attila Finance Lab',mode:'PAPER_ONLY',liveTrading:false,policy:SURVIVAL_POLICY,endpoints:{simulate:'POST /api/attila-finance',status:'GET /api/attila-finance'}});
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  let body;try{body=typeof req.body==='string'?JSON.parse(req.body):(req.body||{});}catch{return json(res,400,{ok:false,error:'Invalid JSON'});}
  if(body.action!=='simulate')return json(res,400,{error:'Only paper simulation is supported'});
  if(!Array.isArray(body.bars)||body.bars.length>500||body.bars.length<22)return json(res,400,{error:'Provide 22 to 500 historical bars'});
  const bars=body.bars.map(b=>({open:b?.open===undefined?NaN:Number(b.open),high:b?.high===undefined?NaN:Number(b.high),low:b?.low===undefined?NaN:Number(b.low),close:b?.close===undefined?NaN:Number(b.close),spreadFraction:b?.spreadFraction===undefined?0:Number(b.spreadFraction)}));
  try{const result=simulateSurvivalStrategy(bars);return json(res,200,{ok:true,market:typeof body.market==='string'?body.market.slice(0,32):'UNSPECIFIED',...result});}
  catch(e){return json(res,400,{ok:false,error:e.message});}
}