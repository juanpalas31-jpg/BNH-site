import test from 'node:test';
import assert from 'node:assert/strict';
import {
  runAtilaEndService,
  withAtilaEndService
} from '../microorganisms/atila-trame-service.js';

test('ATILA runs at end of execution and creates a bounded successor', async () => {
  const wrapped = await withAtilaEndService(
    async () => 'TRAME_OK',
    {
      recovered: [{ path: 'lost.js', fingerprint: 'lost' }],
      canonical: [],
      organism: { id: 'ATILA-G0', generation: 0 }
    }
  );

  assert.equal(wrapped.result, 'TRAME_OK');
  assert.equal(wrapped.atila.trigger, 'END_OF_EXECUTION');
  assert.equal(wrapped.atila.successor.generation, 1);
  assert.equal(wrapped.atila.destructive_actions_allowed, false);
  assert.equal(wrapped.atila.restoration[0].automatic_restore, false);
});

test('ATILA still runs when the wrapped execution fails', async () => {
  await assert.rejects(
    () => withAtilaEndService(
      async () => { throw new Error('execution failed'); },
      { recovered: [], canonical: [] }
    ),
    error => {
      assert.equal(error.message, 'execution failed');
      assert.equal(error.atila.completed, true);
      assert.equal(error.atila.trigger, 'END_OF_EXECUTION');
      return true;
    }
  );
});
