import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateBnhOpportunity } from '../adapters/bnh-opportunity-adapter.js';

test('BNH form becomes a traceable callable Spider opportunity', () => {
  const result = evaluateBnhOpportunity({
    session_id: 'S-BNH-1',
    telephone: '0600000000',
    service_area: true,
    owner: true,
    project: 'pompe-a-chaleur',
    timeline: '30-days',
    simulator_complete: true,
    requested_assessment: true,
    contact_consent: true,
    source: 'organic',
    utm_source: 'google',
    utm_campaign: 'dpe-2026'
  });

  assert.equal(result.tenant_id, 'bnh');
  assert.equal(result.project_id, 'bnh-site');
  assert.equal(result.commercial_status, 'CALL_PRIORITY');
  assert.equal(result.contact.callable, true);
  assert.equal(result.attribution.utm_source, 'google');
  assert.equal(result.automatic_contact, false);
});

test('BNH lead without consent is never callable automatically', () => {
  const result = evaluateBnhOpportunity({
    session_id: 'S-BNH-2',
    telephone: '0600000000',
    service_area: true,
    owner: true,
    project: 'dpe',
    requested_assessment: true
  });

  assert.equal(result.contact.callable, false);
  assert.notEqual(result.commercial_status, 'CALL_PRIORITY');
  assert.equal(result.automatic_contact, false);
});
