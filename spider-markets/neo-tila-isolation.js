// Spider Markets — isolated Néo-Tila domains
// No financial state, learning history, portfolio or decisions are shared between members.
export const PALAS_NEO_TILA_ISOLATION = Object.freeze({
  tenancy: "ONE_PRIVATE_DOMAIN_PER_MEMBER",
  separateApplicationContext: true,
  separateNeoTila: true,
  sharedToolsOnly: true,
  sharedPortfolio: false,
  sharedMemory: false,
  sharedLearningHistory: false,
  sharedDecisionHistory: false,
  crossMemberMutation: false,
  defaultCrossMemberAccess: "DENY",
  liveTrading: "DISABLED"
});

export function authorizeNeoTilaDomain({authenticated=false, subjectId="", domainOwnerId=""}={}) {
  if (!authenticated) return {allowed:false, reason:"AUTHENTICATION_REQUIRED"};
  if (!subjectId || !domainOwnerId) return {allowed:false, reason:"IDENTITY_REQUIRED"};
  if (subjectId !== domainOwnerId) return {allowed:false, reason:"DOMAIN_ISOLATION"};
  return {allowed:true, reason:"OWNER_DOMAIN"};
}
