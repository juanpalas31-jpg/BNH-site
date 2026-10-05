export function verifyRestore({ before = [], restored = [], idField }) {
  if (!idField) throw new Error('idField is required');

  const beforeIds = new Set(before.map(r => r[idField]).filter(Boolean));
  const restoredIds = new Set(restored.map(r => r[idField]).filter(Boolean));

  const missing = [...beforeIds].filter(id => !restoredIds.has(id));
  const unexpected = [...restoredIds].filter(id => !beforeIds.has(id));

  return {
    ok: missing.length === 0 && unexpected.length === 0 && before.length === restored.length,
    before_count: before.length,
    restored_count: restored.length,
    missing_ids: missing,
    unexpected_ids: unexpected
  };
}

export function assertTenantIsolation(records = [], tenantId) {
  const foreign = records.filter(r => r.tenant_id !== tenantId);
  return {
    ok: foreign.length === 0,
    tenant_id: tenantId,
    checked: records.length,
    foreign_records: foreign.length
  };
}
