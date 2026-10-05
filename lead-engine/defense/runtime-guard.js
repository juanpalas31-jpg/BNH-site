const DEFAULT_LIMITS = Object.freeze({
  maxBodyBytes: 32 * 1024,
  maxStringLength: 4000,
  maxKeys: 80
});

export function validateInboundRecord(record, limits = DEFAULT_LIMITS) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return { ok: false, reason: 'invalid_payload' };
  }

  const raw = JSON.stringify(record);
  if (Buffer.byteLength(raw, 'utf8') > limits.maxBodyBytes) {
    return { ok: false, reason: 'payload_too_large' };
  }

  const keys = Object.keys(record);
  if (keys.length > limits.maxKeys) return { ok: false, reason: 'too_many_fields' };

  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string' && value.length > limits.maxStringLength) {
      return { ok: false, reason: 'field_too_large', field: key };
    }
  }

  return { ok: true };
}

export function safePublicError(error, requestId) {
  // Keep implementation/provider details out of public API responses.
  return {
    ok: false,
    error: 'storage_unavailable',
    request_id: requestId || null,
    retryable: true
  };
}

export function defenseSignal({ type, tenant_id, project_id, request_id, detail = {} }) {
  return {
    schema_version: 1,
    type,
    tenant_id,
    project_id,
    request_id,
    detected_at: new Date().toISOString(),
    detail
  };
}
