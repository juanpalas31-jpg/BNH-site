import { randomUUID } from 'node:crypto';

export function createFailureEnvelope({record,error,stage}){
  return {
    schema_version:1,
    failure_id:`FAIL-${randomUUID()}`,
    tenant_id:record?.tenant_id||null,
    project_id:record?.project_id||null,
    record_type:record?.record_type||null,
    record_id:record?.lead_id||record?.event_id||null,
    stage,
    retryable:true,
    failed_at:new Date().toISOString(),
    error_class:error?.name||'Error'
  };
}

// Deliberately excludes the original payload and error message so credentials,
// contact details and provider internals are not copied into logs by default.
