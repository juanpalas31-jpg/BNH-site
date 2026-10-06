import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSession, prioritizeSessions } from '../orchestrator.js';

test('connects sensed intent to a bounded hunt strategy', () => {
  const result = evaluateSession({
    session_id: 'S-HOT',
    tenant_id: 'bnh',
    project_id: 'bnh-site',
    events: [
      { event: 'page_view' },
      { event: 'simulator_complete' },
      { event: 'form_submit' }
    ]
  });

  assert.equal(result.intent, 'high');
  assert.equal(result.hunt.strategy, 'interception');
  assert.equal(result.automatic_contact, false);
  assert.equal(result.autonomous_action_allowed, false);
});

test('prioritizes stronger opportunities without crossing tenant/project identity', () => {
  const result = prioritizeSessions([
    {
      session_id: 'S-MED',
      tenant_id: 'bnh',
      project_id: 'bnh-site',
      events: [{ event: 'form_start' }, { event: 'content_engaged' }]
    },
    {
      session_id: 'S-HOT',
      tenant_id: 'bnh',
      project_id: 'bnh-site',
      events: [{ event: 'form_submit' }, { event: 'booking_intent' }]
    },
    {
      session_id: 'S-LOW',
      tenant_id: 'other',
      project_id: 'other-project',
      events: [{ event: 'page_view' }]
    }
  ]);

  assert.equal(result.queue.length, 2);
  assert.equal(result.next.session_id, 'S-HOT');
  assert.equal(result.next.tenant_id, 'bnh');
  assert.equal(result.next.project_id, 'bnh-site');
  assert.equal(result.automatic_contact, false);
});
