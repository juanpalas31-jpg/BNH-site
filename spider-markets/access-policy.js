// Spider Markets — private access policy
// This policy expresses authorization intent. Enforcement requires authenticated identities.
export const PALAS_MARKETS_ACCESS = Object.freeze({
  visibility: "PRIVATE_FAMILY_ONLY",
  family: "PALAS",
  allowedRoles: Object.freeze(["FOUNDER","CHILD","GUARDIAN"]),
  publicAccess: false,
  anonymousAccess: false,
  defaultDecision: "DENY"
});

export function authorizePalasMarkets(subject = {}) {
  const role = String(subject.role || "").toUpperCase();
  const authenticated = subject.authenticated === true;
  const palaceFamilyMember = subject.palaceFamilyMember === true;
  const guardianAuthorized = subject.guardianAuthorized === true;
  if (!authenticated) return { allowed:false, reason:"AUTHENTICATION_REQUIRED" };
  if (role === "FOUNDER" && palaceFamilyMember) return { allowed:true, reason:"PALAS_FOUNDER" };
  if (role === "CHILD" && palaceFamilyMember) return { allowed:true, reason:"PALAS_CHILD" };
  if (role === "GUARDIAN" && guardianAuthorized) return { allowed:true, reason:"AUTHORIZED_GUARDIAN" };
  return { allowed:false, reason:"PALAS_PRIVATE_SYSTEM" };
}