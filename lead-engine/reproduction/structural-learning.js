const ALLOWED_FIELDS = new Set([
  'event_taxonomy',
  'security_policy_version',
  'storage_contract_version',
  'backup_policy_version',
  'conversion_model_version',
  'validated_patterns'
]);

export function buildStructuralInheritance(source = {}) {
  const inherited = { schema_version: 1 };

  for (const [key, value] of Object.entries(source)) {
    if (ALLOWED_FIELDS.has(key)) inherited[key] = value;
  }

  return inherited;
}

export function assertNoTenantData(payload = {}) {
  const forbidden = [
    'leads','events','customers','contacts','emails','phones',
    'credentials','tokens','secrets','private_notes'
  ];

  const violations = forbidden.filter(k => Object.prototype.hasOwnProperty.call(payload, k));
  return { ok: violations.length === 0, violations };
}
