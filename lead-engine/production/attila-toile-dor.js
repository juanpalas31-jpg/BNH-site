/** ATTILA — Toile d'Or. Priority: amplify existing poster sales without inventing conversions. */
export const TOILE_DOR_DNA=Object.freeze({agent:'ATTILA',engine:'SPIDER_ENGINE',priority:'P0',goal:'VERIFIED_REVENUE_X3_TO_X4',channels:['VINTED','LEBONCOIN'],externalActions:false});
const safe=(s,n=180)=>typeof s==='string'?s.trim().slice(0,n):'';
export function planPosterGrowth({workspaceId,posters=[],baselineRevenueCents=null,periodDays=30}={}){
 if(!/^[a-zA-Z0-9_-]{1,80}$/.test(workspaceId||'')||!Array.isArray(posters)||posters.length>5000||!Number.isInteger(periodDays)||periodDays<1||periodDays>366)throw Error('INVALID_INPUT');
 if(baselineRevenueCents!==null&&(!Number.isSafeInteger(baselineRevenueCents)||baselineRevenueCents<0))throw Error('INVALID_BASELINE');
 const targets=baselineRevenueCents===null?null:{x3:baselineRevenueCents*3,x4:baselineRevenueCents*4};
 const missions=posters.map((p,i)=>{
  if(!p||!safe(p.title)||!['VINTED','LEBONCOIN'].includes(p.platform)||!Number.isSafeInteger(p.priceCents)||p.priceCents<0)throw Error('INVALID_POSTER');
  let url=null;
  if(p.listingUrl){let u;try{u=new URL(p.listingUrl)}catch{throw Error('INVALID_URL')};if(u.protocol!=='https:'||u.username||u.password)throw Error('INVALID_URL');url=u.href;}
  const sold=Number.isSafeInteger(p.verifiedSalesCount)&&p.verifiedSalesCount>=0?p.verifiedSalesCount:null;
  const title=safe(p.title);
  return {id:'poster_'+(i+1),title,platform:p.platform,priceCents:p.priceCents,verifiedSalesCount:sold,listingUrl:url,
   priority:sold!==null&&sold>0?'PROVEN_SELLER':'VALIDATE_DEMAND',
   actions:['REVIEW_LISTING_TITLE','REVIEW_PHOTOS','BUILD_SEO_LANDING_PAGE','DRAFT_SOCIAL_POSTS','TRACK_OUTBOUND_CLICKS'],
   publication:'OWNER_APPROVAL_REQUIRED',saleAttribution:'NOT_ASSUMED'};
 }).sort((a,b)=>(b.verifiedSalesCount||0)-(a.verifiedSalesCount||0));
 return {agent:'ATTILA',mission:'TOILE_D_OR',status:'PLAN_ONLY',workspaceId,periodDays,targets,baselineVerified:false,
 missions,requiredNextInputs:['PUBLIC_LISTING_URLS','VERIFIED_30_DAY_SALES','AVAILABLE_STOCK'],
 constraints:['PLATFORM_TERMS','NO_AUTOMATIC_MARKETPLACE_ORDER_CREATION','NO_UNAUTHORIZED_ACCOUNT_ACCESS'],externalActions:false};
}
