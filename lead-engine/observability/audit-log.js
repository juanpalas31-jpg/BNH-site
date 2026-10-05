import { randomUUID } from 'node:crypto';

export function createAuditRecord({
  tenant_id,
  project_id,
  actor = 'spider-engine',
  action,
  decision,
  request_id = null,
  metadata = {}
}) {
  return {
    schema_version: 1,
    audit_id: `AUD-${randomUUID()}`,
    tenant_id,
    project_id,
    actor,
    action,
    decision,
    request_id,
    created_at: new Date().toISOString(),
    metadata
  };
}

export function redactAuditMetadata(metadata = {}) {
  const blocked = new Set(['password','secret','token','authorization','cookie','api_key']);
  return Object.fromEntries(
    Object.entries(metadata).map(([k,v]) => [k, blocked.has(k.toLowerCase()) ? '[REDACTED]' : v])
  );
}
