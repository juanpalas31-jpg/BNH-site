import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCommercialOpportunity,
  commercialDesk
} from '../commercial/opportunity-desk.js';

test('surfaces a consented high-quality lead for human calling', () => {
  const opportunity = buildCommercialOpportunity(
    {
      session_id: 'S1',
      tenant_id: 'bnh',
      project_id: 'bnh-site',
      events: [{ event: 'simulator_complete' }, { event: 'form_submit' }]
    },
    {
      serviceArea: true,
      owner: true,
      projectIdentified: true,
      timelineKnown: true,
      simulatorComplete: true,
      requestedAssessment: true,
      contact_consent: true,
      phone: '0600000000'
    }
  );

  assert.equal(opportunity.commercial_status, 'CALL_PRIORITY');
  assert.equal(opportunity.contact.callable, true);
  assert.equal(opportunity.automatic_contact, false);
  assert.equal(opportunity.human_action_required, true);
});

test('never marks a lead callable without explicit contact consent', () => {
  const desk = commercialDesk([{
    session: {
      session_id: 'S2',
      tenant_id: 'bnh',
      project_id: 'bnh-site',
      events: [{ event: 'form_submit' }, { event: 'booking_intent' }]
    },
    qualification: {
      serviceArea: true,
      owner: true,
      projectIdentified: true,
      requestedAssessment: true,
      phone: '0600000000'
    }
  }]);

  assert.equal(desk.opportunities[0].contact.callable, false);
  assert.equal(desk.next_human_call, null);
  assert.equal(desk.automatic_contact, false);
});
