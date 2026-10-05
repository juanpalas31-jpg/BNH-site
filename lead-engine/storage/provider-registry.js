import { StorageAdapter } from './adapter.js';

const providers = new Map();

export function registerStorageProvider(name, factory) {
  if (!name || typeof factory !== 'function') throw new Error('Invalid storage provider');
  providers.set(name, factory);
}

export function createStorageProvider(name, config = {}) {
  const factory = providers.get(name);
  if (!factory) throw new Error(`Unknown storage provider: ${name}`);
  const adapter = factory(config);
  if (!(adapter instanceof StorageAdapter)) throw new Error('Provider must implement StorageAdapter');
  return adapter;
}

export function listStorageProviders() {
  return [...providers.keys()].sort();
}

// Provider names are configuration, not business logic.
// A tenant can move between PostgreSQL-compatible providers without changing API contracts.
