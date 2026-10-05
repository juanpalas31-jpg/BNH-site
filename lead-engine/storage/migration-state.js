export const MIGRATION_STATES = Object.freeze({
  LEGACY_PRIMARY: 'legacy_primary',
  SHADOW_WRITE: 'shadow_write',
  NEW_PRIMARY: 'new_primary',
  LEGACY_RETIRED: 'legacy_retired'
});

export function assertMigrationTransition(from, to, checks = {}) {
  const allowed = {
    [MIGRATION_STATES.LEGACY_PRIMARY]: [MIGRATION_STATES.SHADOW_WRITE],
    [MIGRATION_STATES.SHADOW_WRITE]: [MIGRATION_STATES.NEW_PRIMARY],
    [MIGRATION_STATES.NEW_PRIMARY]: [MIGRATION_STATES.LEGACY_RETIRED],
    [MIGRATION_STATES.LEGACY_RETIRED]: []
  };

  if (!allowed[from]?.includes(to)) throw new Error(`Unsafe migration transition: ${from} -> ${to}`);

  if (to === MIGRATION_STATES.NEW_PRIMARY) {
    if (!checks.primary_healthcheck) throw new Error('Primary healthcheck required');
    if (!checks.shadow_counts_match) throw new Error('Shadow record-count verification required');
    if (!checks.sample_integrity_verified) throw new Error('Sample integrity verification required');
  }

  if (to === MIGRATION_STATES.LEGACY_RETIRED) {
    if (!checks.export_verified) throw new Error('Verified export required before retiring legacy storage');
    if (!checks.restore_test_passed) throw new Error('Restore test required before retiring legacy storage');
  }

  return { ok: true, from, to };
}
