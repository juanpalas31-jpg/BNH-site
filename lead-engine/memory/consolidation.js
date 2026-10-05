/**
 * Spider memory consolidation.
 * Separates short-lived observations from durable heritable learning.
 * Only aggregate, evidence-backed structural lessons can become DNA candidates.
 */

export function consolidateMemory(observations=[], options={}){
  const minEvidence=Math.max(10,Number(options.min_evidence||100));
  const minConfidence=Math.min(1,Math.max(0,Number(options.min_confidence||0.8)));

  return observations.map(o=>{
    const evidence=Math.max(0,Number(o.evidence||0));
    const confidence=Math.min(1,Math.max(0,Number(o.confidence||0)));
    const structural=o.structural_lesson===true;
    const containsCustomerData=o.contains_customer_data===true;

    const durable=
      evidence>=minEvidence &&
      confidence>=minConfidence &&
      structural &&
      !containsCustomerData &&
      o.policy_ok!==false;

    return {
      memory_id:o.memory_id||null,
      lesson:o.lesson||null,
      classification:durable?'long_term_candidate':'working_memory',
      evidence,
      confidence,
      heritable:durable,
      customer_data_inheritance:false,
      requires_human_review:durable
    };
  });
}

export function forgetWeakMemory(memories=[], options={}){
  const minEvidence=Math.max(1,Number(options.min_evidence||20));
  return memories.filter(m=>
    m.heritable===true ||
    Number(m.evidence||0)>=minEvidence ||
    m.pinned===true
  );
}

export function inheritancePayload(memories=[]){
  return memories
    .filter(m=>m.heritable===true && m.customer_data_inheritance!==true)
    .map(({memory_id,lesson,evidence,confidence})=>({
      memory_id,lesson,evidence,confidence,kind:'structural_learning'
    }));
}
