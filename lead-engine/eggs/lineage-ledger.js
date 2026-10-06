import crypto from "node:crypto";

const digest=x=>crypto.createHash("sha256").update(JSON.stringify(x)).digest("hex");

export function lineageRecord({egg_id,parent_egg_id=null,generation,event,previous_hash=null,metadata={}}={}) {
  const body={egg_id,parent_egg_id,generation,event,previous_hash,metadata};
  return {...body,record_hash:digest(body)};
}

export function verifyLineageChain(records=[]) {
  for(let i=0;i<records.length;i++){
    const r=records[i];
    const body={egg_id:r.egg_id,parent_egg_id:r.parent_egg_id,generation:r.generation,event:r.event,previous_hash:r.previous_hash,metadata:r.metadata};
    if(digest(body)!==r.record_hash) return {valid:false,index:i,reason:"record_hash_mismatch"};
    if(i>0 && r.previous_hash!==records[i-1].record_hash) return {valid:false,index:i,reason:"broken_chain"};
  }
  return {valid:true,count:records.length,head:records.at(-1)?.record_hash||null};
}
