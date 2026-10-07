/**
 * Spider Engine storage adapter contract.
 *
 * Runtime providers (Neon, Supabase, PostgreSQL, etc.) implement this interface.
 * API routes must depend on this contract, never on a provider directly.
 */
export class StorageAdapter {
  async saveLead(_lead) { throw new Error('saveLead not implemented'); }
  async saveEvent(_event) { throw new Error('saveEvent not implemented'); }

  // Attila aggregate state contains no raw PII. A provider is only considered
  // durable for Attila when it implements BOTH write and read.
  async saveAttilaState(_state) { throw new Error('saveAttilaState not implemented'); }
  async loadAttilaState(_tenantId, _projectId) { throw new Error('loadAttilaState not implemented'); }

  async healthcheck() { throw new Error('healthcheck not implemented'); }
  async stats(_tenantId, _projectId) { throw new Error('stats not implemented'); }
  async exportLeads(_tenantId, _projectId) { throw new Error('exportLeads not implemented'); }
  async exportEvents(_tenantId, _projectId) { throw new Error('exportEvents not implemented'); }
}

export function hasDurableAttilaMemory(adapter){
  return Boolean(
    adapter &&
    typeof adapter.saveAttilaState === 'function' &&
    typeof adapter.loadAttilaState === 'function' &&
    adapter.saveAttilaState !== StorageAdapter.prototype.saveAttilaState &&
    adapter.loadAttilaState !== StorageAdapter.prototype.loadAttilaState
  );
}

/**
 * Migration-safe write policy.
 * primary: authoritative storage once configured.
 * mirror: optional legacy/reporting destination.
 *
 * A mirror failure never changes a successful primary write into a failed lead.
 */
export async function dualWrite({ primary, mirror, kind, record }) {
  if (!primary) throw new Error('Primary storage adapter is required');

  const save = kind === 'lead' ? 'saveLead' : kind === 'event' ? 'saveEvent' : null;
  if (!save) throw new Error('Unsupported record kind');

  const primaryResult = await primary[save](record);
  let mirrorResult = null;
  let mirrorError = null;

  if (mirror) {
    try { mirrorResult = await mirror[save](record); }
    catch (error) { mirrorError = error instanceof Error ? error.message : String(error); }
  }

  return {ok:true,primary:primaryResult,mirror:mirrorResult,mirror_error:mirrorError};
}
