import { createHash } from 'node:crypto';

export function idempotencyKey(record={}){
  if(record.lead_id) return `lead:${record.lead_id}`;
  if(record.event_id) return `event:${record.event_id}`;
  const stable=JSON.stringify({
    tenant_id:record.tenant_id||'',project_id:record.project_id||'',
    session_id:record.session_id||'',record_type:record.record_type||'',
    received_at:record.received_at||'',event:record.event||''
  });
  return `hash:${createHash('sha256').update(stable).digest('hex')}`;
}

export function deduplicate(records=[]){
  const seen=new Set();
  return records.filter(r=>{const k=idempotencyKey(r);if(seen.has(k))return false;seen.add(k);return true;});
}
