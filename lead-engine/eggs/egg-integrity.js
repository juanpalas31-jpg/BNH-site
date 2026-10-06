import crypto from "node:crypto";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  }
  return value;
}

export function canonicalEggPayload(egg) {
  const copy = structuredClone(egg);
  if (copy.integrity) {
    delete copy.integrity.checksum;
    delete copy.integrity.signature;
  }
  return JSON.stringify(stable(copy));
}

export function eggChecksum(egg) {
  return crypto.createHash("sha256").update(canonicalEggPayload(egg), "utf8").digest("hex");
}

export function verifyEggChecksum(egg, expected) {
  const actual = eggChecksum(egg);
  const a = Buffer.from(actual, "hex");
  const b = Buffer.from(String(expected || ""), "hex");
  return { valid: a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a,b), actual };
}
