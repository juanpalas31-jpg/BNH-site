# Attila memory worker — deployment contract
Attila runs without Jarvis after an operator deploys Node.js >=20 and schedules this process.
Current capabilities: deterministic checks only; NO recordings, transcripts, encrypted vault,
verified authentication, durable encrypted backups, private child profiles, or podcast rendering.
Never upload family data, real consent records, keys, or audio to this public repository.

## Command
From the repository root (with ESM support for .js modules):
```sh
node lead-engine/production/attila-memory-runtime.mjs family /private/attila/queue.json /private/attila/state.json /private/attila/report.json
```
The queue is JSON containing tasks with unique id, workspaceId, action, and minimal metadata
payload. Supported actions: CHECK_ACCESS, VERIFY_INTEGRITY, PLAN_RECOVERY. The report contains
metadata only. The queue is NOT automatically consumed; processed IDs in state prevent reruns
up to the bounded history. The runner should be scheduled by a process supervisor/cron on a
private machine. Run ONLY one process per workspace; no cross-process lock exists yet.
Queue/state/report paths MUST be in a restricted directory, not inside a public web root.
Do not put sensitive data in task identifiers or other free-text fields.

## Tests
```sh
node --test lead-engine/production/attila-memory-worker.test.mjs lead-engine/production/spider-private-memory-guard.test.mjs lead-engine/production/attila-memory-runtime.test.mjs
```
The repository must configure ESM (package.json type=module) for imported .js modules.
Tests were authored but have not been executed or verified in CI.

## Before production
1. Implement authenticated service identity and server-side authorization (caller-supplied
   booleans are NOT proof of identity or consent).
2. Add encrypted private object storage, external key management, retention/deletion and
   verified backups; hash actual bytes before recording integrity evidence.
3. Add a transactional queue with durable acknowledgements and per-workspace locks.
4. Add child assent, verified guardianship and separate podcast release approvals.
5. Add private audit logs, observability, tests in CI and a monitored supervisor.
6. Only then add speech transcription and searchable memory behind those controls.
