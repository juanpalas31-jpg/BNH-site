# Bamak Event — supervision runbook

## What exists in Spider Engine
- `attila/bamak-event-readonly.mjs`: owner-gated status reads from an injected adapter.
- `attila/bamak-event-health.mjs`: pure fleet assessment and alerts.
- `attila/bamak-event-supervision.mjs`: single read-only cycle with optional evidence sink.
- `attila/bamak-event-smoke.mjs`: synthetic-only end-to-end simulation.
- `attila/bamak-event-*.test.mjs`: tests invoked by `.github/workflows/attila-guarded-finisher-tests.yml`.

## Verify without touching production
1. Use Node.js 22 and run `node attila/bamak-event-readonly.test.mjs`.
2. Run `node attila/bamak-event-health.test.mjs`.
3. Run `node attila/bamak-event-supervision.test.mjs`.
4. Run `node attila/bamak-event-smoke.mjs`.
5. Review GitHub Actions results before merging or deploying.

## Real device integration prerequisites
- Identify the actual owner-controlled photobooth server and confirm access scope.
- Inspect its existing status protocol, authentication and device IDs without storing secrets in source control.
- Implement a minimal `getStatus(boothId)` adapter. Do not add `sendCommand` to the read-only adapter.
- Keep network calls disabled until explicitly authorized and validated in staging.
- Validate actual response fields, timeouts and failure handling.
- Do not infer an API implementation from the route declarations in `lead-engine/api/atila-photobooth-api.js`; those declarations are a contract, not proof of a deployed service.

No automatic scheduler, live API connection, or production deployment is claimed by this runbook.
