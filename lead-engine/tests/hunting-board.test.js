import test from 'node:test';
import assert from 'node:assert/strict';
import { huntingCard, buildHuntingBoard } from '../commercial/hunting-board.js';

test('puts callable priority lead first and preserves attribution', () => {
  const cold = huntingCard({
    lead: { lead_id:'L1', nom:'Cold', source:'organic' },
    opportunity: {
      commercial_status:'NURTURE',
      engine_intent:'low',
      engine_score:2,
      lead_quality_score:10,
      contact:{ callable:false }
    }
  });
  const hot = huntingCard({
    lead: {
      lead_id:'L2',
      nom:'Hot',
      telephone:'0600000000',
      source:'organic',
      utm_source:'google',
      utm_campaign:'dpe-2026'
    },
    opportunity: {
      commercial_status:'CALL_PRIORITY',
      engine_intent:'high',
      engine_score:34,
      lead_quality_score:90,
      contact:{ callable:true }
    }
  });

  const board = buildHuntingBoard([cold, hot]);
  assert.equal(board.rows[0].lead_id, 'L2');
  assert.equal(board.next_call.lead_id, 'L2');
  assert.equal(board.next_call.utm_source, 'google');
  assert.equal(board.totals.call_priority, 1);
  assert.equal(board.automatic_contact, false);
});
