import { WebhookStorageAdapter } from './storage/webhook-adapter.js';

export function createRuntimeStorage(env = process.env) {
  // Current migration stage: legacy webhook is primary until a durable SQL provider is configured and verified.
  if (env.BNH_SHEETS_WEBHOOK_URL) {
    return { primary:new WebhookStorageAdapter({url:env.BNH_SHEETS_WEBHOOK_URL}), provider:'legacy_webhook' };
  }
  return { primary:null, provider:'unconfigured' };
}
