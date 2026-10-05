export async function engineHealth({ storage, checks = {} }) {
  const started = Date.now();
  const organs = {
    storage: { ok: false },
    defense: { ok: checks.defense !== false },
    senses: { ok: checks.senses !== false },
    learning: { ok: checks.learning !== false },
    regeneration: { ok: checks.regeneration !== false },
    reproduction: { ok: checks.reproduction !== false }
  };

  try {
    organs.storage = storage ? await storage.healthcheck() : { ok: false, reason: 'unconfigured' };
  } catch {
    organs.storage = { ok: false, reason: 'unavailable' };
  }

  const critical = ['storage','defense'];
  const healthy = critical.every(name => organs[name]?.ok === true);

  return {
    schema_version: 1,
    status: healthy ? 'healthy' : 'degraded',
    checked_at: new Date().toISOString(),
    duration_ms: Date.now() - started,
    organs
  };
}
