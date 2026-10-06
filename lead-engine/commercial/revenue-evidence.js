export function revenueEvidence(input={}){
 const required=["threadId","leadId","outcome"];
 const missing=required.filter(k=>!input[k]);
 if(missing.length) return {accepted:false,missing};
 const allowed=["qualified","appointment","quote","sale"];
 if(!allowed.includes(input.outcome)) return {accepted:false,reason:"invalid_outcome"};
 return {
  accepted:true,
  threadId:input.threadId,
  leadId:input.leadId,
  outcome:input.outcome,
  verifiedRevenue:input.outcome==="sale"?Number(input.verifiedRevenue||0):0,
  synthetic:false
 };
}
