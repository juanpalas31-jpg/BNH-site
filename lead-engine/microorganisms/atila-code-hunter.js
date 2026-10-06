import { createHash } from 'node:crypto';

const normalizePath = (value = '') =>
  String(value).trim().replaceAll('\\', '/').replace(/^\.\//, '');

const fingerprint = (value = '') =>
  createHash('sha256').update(String(value)).digest('hex');

export function buildCodeSpecimen({
  source = 'unknown',
  path = '',
  content = '',
  commit_sha = null,
  conversation_id = null,
  observed_at = new Date().toISOString()
} = {}) {
  return {
    source,
    path: normalizePath(path),
    fingerprint: fingerprint(content),
    bytes: Buffer.byteLength(String(content), 'utf8'),
    commit_sha,
    conversation_id,
    observed_at
  };
}

export function huntLostCode({
  recovered = [],
  canonical = [],
  knownCommitShas = []
} = {}) {
  const canonicalPaths = new Set(canonical.map(x => normalizePath(x.path)));
  const canonicalFingerprints = new Set(canonical.map(x => x.fingerprint).filter(Boolean));
  const commits = new Set(knownCommitShas.filter(Boolean));
  const recovery_candidates = [];
  const accounted_for = [];
  const duplicates = [];

  for (const specimen of recovered) {
    const path = normalizePath(specimen.path);
    const sameFingerprint =
      specimen.fingerprint && canonicalFingerprints.has(specimen.fingerprint);
    const knownCommit = specimen.commit_sha && commits.has(specimen.commit_sha);

    if (sameFingerprint || knownCommit) {
      accounted_for.push({ ...specimen, path, status: 'ACCOUNTED_FOR' });
      continue;
    }

    const duplicate = recovery_candidates.find(
      x => x.fingerprint && specimen.fingerprint && x.fingerprint === specimen.fingerprint
    );
    if (duplicate) {
      duplicates.push({
        ...specimen,
        path,
        status: 'RECOVERED_DUPLICATE',
        duplicate_of: duplicate.path || duplicate.fingerprint
      });
      continue;
    }

    recovery_candidates.push({
      ...specimen,
      path,
      status: canonicalPaths.has(path)
        ? 'VERSION_MISMATCH'
        : 'MISSING_FROM_CANONICAL',
      action: 'HUMAN_REVIEW'
    });
  }

  return {
    organism: 'ATILA_CODE_HUNTER',
    mode: 'READ_ONLY',
    scanned: recovered.length,
    accounted_for,
    recovery_candidates,
    duplicates,
    safe_to_auto_write: false,
    destructive_actions_allowed: false
  };
}

export function recoveryCoverage(report = {}) {
  const scanned = Number(report.scanned || 0);
  const unresolved = (report.recovery_candidates || []).length;
  const resolved = Math.max(0, scanned - unresolved);
  return {
    scanned,
    resolved,
    unresolved,
    coverage: scanned === 0 ? 1 : Number((resolved / scanned).toFixed(4)),
    complete: scanned > 0 && unresolved === 0
  };
}
