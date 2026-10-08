// Néo-Tila Reine — famille Palas. Internal accounting only, not a bank, insurer or trust.
// No transfers, legal beneficiary designation or death verification are performed here.
export const QUEEN_POLICY = Object.freeze({
  ownerRole: 'QUEEN', communication: 'MESSAGES_ONLY_NO_CROSS_TENANT_WRITE',
  allocationBasis: 'VERIFIED_REALIZED_NET_PROFIT_AFTER_FEES_TAX_RESERVE',
  dailyAllocationBps: 100, // 1% of a day's positive eligible net profit, NOT 1% of capital or accumulated balance.
  lifetimeShareBps: 5000, legacyShareBps: 5000,
  defaultMode: 'PROPOSAL_ONLY', payoutsEnabled: false,
  inheritanceExecutionEnabled: false, tradingEnabled: false
});
const integer = x => Number.isSafeInteger(x) && x >= 0;
export function proposeQueenAllocation(day, existingSourceIds = []) {
  if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day.date || '')) throw Error('INVALID_DAY');
  if (!day.verified || !day.settled || !day.ownerApproved) throw Error('UNVERIFIED_OR_UNAPPROVED_PROFIT');
  if (!day.sourceId || existingSourceIds.includes(day.sourceId)) throw Error('DUPLICATE_OR_MISSING_SOURCE');
  if (!Number.isSafeInteger(day.netProfitCents)) throw Error('INVALID_NET_PROFIT');
  if (!integer(day.taxReserveCents || 0)) throw Error('INVALID_TAX_RESERVE');
  const eligible = Math.max(0, day.netProfitCents - (day.taxReserveCents || 0));
  const total = Math.floor(eligible * QUEEN_POLICY.dailyAllocationBps / 10000);
  const lifetime = Math.floor(total * QUEEN_POLICY.lifetimeShareBps / 10000);
  return Object.freeze({
    sourceId: day.sourceId, date: day.date, eligibleProfitCents: eligible,
    proposedTotalCents: total, lifetimeGiftCents: lifetime,
    legacyReserveCents: total - lifetime,
    status: 'PROPOSAL_NOT_FUNDED', moneyMoved: false,
    insuranceContractCreated: false, beneficiaryRightsCreated: false
  });
}
export function authorizeQueenMessage({authenticated=false,fromDomain='',toDomain='',messageOnly=false}={}) {
  return {allowed: Boolean(authenticated && fromDomain && toDomain && fromDomain !== toDomain && messageOnly),
    crossDomainWriteAllowed: false};
}
