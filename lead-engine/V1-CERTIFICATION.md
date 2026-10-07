# Spider Engine V1 — Certification

Status: VERIFIED
Certification commit: bb62a0c268f52f79c5df90cf7bf60faf7c604791
CI run: 15 — SUCCESS

## Verified V1 invariants

- BNH remains a tenant/project of Spider Engine, not the engine itself.
- Opportunity flow preserves tenant/project isolation and attribution.
- Attila ranks opportunity quality; clicks alone are not assimilated as revenue.
- Revenue is assimilated only from collected value; realized margin is tracked separately.
- Consequential contact remains human-gated.
- Authorized-territory guard blocks hunting before MAIL/CRM access when permission is absent.
- Biological instinct selection is executable and tested.
- Idempotence prevents duplicate completion of the same operation.
- Failed recoverable work can be retried and exhausted work is quarantined rather than silently deleted.
- Storage migration guards reject unsafe promotion.
- Mirror-storage failure cannot invalidate a successful primary write.
- Sentinel classifies CI failures without silently repairing production.
- Integrated lifecycle test covers BNH opportunity -> authorization -> instinct -> idempotent processing -> collected value -> Attila assimilation -> memory -> next-hunt recommendation.

## V1 boundary

VERIFIED means the repository's automated V1 invariants passed CI. It does not mean every external production dependency is live.

Still requiring separate production validation:
- canonical Vercel deployment and environment variables;
- durable SQL provider configured as production primary;
- true restart persistence of recovery state;
- real BNH form-to-storage-to-commercial-desk round trip;
- live QR/review round trip;
- external provider permissions and credentials.

## Frozen doctrine

SENSE -> UNDERSTAND -> HUNT -> QUALIFY -> CONVERT -> MEASURE -> ASSIMILATE -> LEARN -> PROTECT -> RECOVER.

No deception, no bypass of access controls, no silent consequential action, no invented revenue, no cross-tenant data mixing.
