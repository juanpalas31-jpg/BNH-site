import { huntLostCode, recoveryCoverage } from './atila-code-hunter.js';

const MAX_GENERATION = 32;

function safeClean(report) {
  return {
    duplicate_references: (report.duplicates || []).map(x => ({
      path: x.path,
      duplicate_of: x.duplicate_of
    })),
    removed_files: [],
    overwritten_files: [],
    destructive: false
  };
}

function restorationPlan(report) {
  return (report.recovery_candidates || []).map(x => ({
    path: x.path,
    reason: x.status,
    action: 'RESTORE_AFTER_VERIFICATION',
    automatic_restore: false,
    preserve_existing: true
  }));
}

export function duplicateAtila(parent = {}) {
  const generation = Math.min(
    MAX_GENERATION,
    Math.max(0, Number(parent.generation || 0)) + 1
  );
  return {
    organism: 'ATILA',
    service: 'TRAME_END_EXECUTION_SERVICE',
    generation,
    parent_id: parent.id || null,
    id: `ATILA-G${generation}`,
    active_for_next_cycle: generation < MAX_GENERATION,
    replication_mode: 'BOUNDED_SUCCESSOR',
    max_generation: MAX_GENERATION
  };
}

export function runAtilaEndService({
  recovered = [],
  canonical = [],
  knownCommitShas = [],
  organism = { id: 'ATILA-G0', generation: 0 }
} = {}) {
  const hunt = huntLostCode({ recovered, canonical, knownCommitShas });
  const coverage = recoveryCoverage(hunt);
  const cleanup = safeClean(hunt);
  const restoration = restorationPlan(hunt);
  const successor = duplicateAtila(organism);

  return {
    service: 'ATILA_TRAME_SERVICE',
    trigger: 'END_OF_EXECUTION',
    sequence: ['HUNT', 'VERIFY', 'CLEAN', 'RESTORE_PLAN', 'REPLICATE', 'REPORT'],
    hunt,
    coverage,
    cleanup,
    restoration,
    successor,
    completed: true,
    destructive_actions_allowed: false,
    automatic_overwrite_allowed: false
  };
}

export async function withAtilaEndService(execution, context = {}) {
  let result;
  let executionError = null;
  let atila = null;

  try {
    result = await execution();
  } catch (error) {
    executionError = error;
  } finally {
    atila = runAtilaEndService(context);
  }

  if (executionError) {
    executionError.atila = atila;
    throw executionError;
  }

  return { result, atila };
}
