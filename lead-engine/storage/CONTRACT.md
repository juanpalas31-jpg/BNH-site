# Storage adapter contract

The API layer must depend on this contract, not on a specific database vendor.

Required operations:
- saveLead(payload): idempotent by lead_id
- saveEvent(payload): idempotent by event_id
- exportLeads(tenant_id, from, to)
- exportEvents(tenant_id, from, to)
- healthcheck()
- stats(tenant_id, period)

Rules:
- duplicate IDs must never create duplicate records;
- writes must preserve received_at supplied by the API;
- provider-specific credentials exist only in runtime environment variables;
- adapters must be replaceable without changing browser forms or analytics;
- failure of an optional mirror (for example Google Sheets) must not delete or invalidate the primary record.

Migration mode:
1. primary=legacy webhook, secondary=new store (shadow write);
2. compare counts and sampled records;
3. primary=new store, secondary=legacy mirror;
4. remove legacy dependency only after restore test passes.
