export function continuityCheck(state = {}) {
  const checks = {
    recipient: state.recipientVerified === true,
    milestone: state.milestoneReached === true,
    integrity: state.integrityVerified === true,
    consent: state.consent === true,
    legalReview: state.legalReview === true
  };
  const missing = Object.keys(checks).filter((key) => !checks[key]);
  return {
    ready: missing.length === 0,
    missing,
    assetTransferHandledExternally: true
  };
}
