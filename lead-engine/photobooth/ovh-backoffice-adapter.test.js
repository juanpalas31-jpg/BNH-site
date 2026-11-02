import test from 'node:test';
import assert from 'node:assert/strict';
import { createOvhBackofficeAdapter } from './ovh-backoffice-adapter.js';

const now = Date.parse('2026-11-02T20:30:00Z');
const item = (extra = {}) => ({ command_id: 'local-1', booth_id: 'registered',
  type: 'RESTART_APP', state: 'QUEUED', created_at: new Date(now).toISOString(),
  expires_in_sec: 300, ...extra });
function setup(replies = []) {
  const calls = [];
  const adapter = createOvhBackofficeAdapter({ boothId: 'registered', now: () => now,
    readStatus: async () => ({ reachable: false }),
    request: async args => { calls.push(args); const reply = replies.shift();
      if (reply instanceof Error) throw reply; return reply; } });
  return { adapter, calls };
}
test('encodes the observed queue protocol and polls the exact server command', async () => {
  const {adapter, calls} = setup([{ok:true,queued_id:42,server_time:1234},
    {ok:true,ready:false}, {ok:true,ready:true,entry:{data:{},received_at:'time'}}]);
  assert.equal((await adapter.sendCommand(item())).accepted, true);
  assert.equal(calls[0].body.toString(), 'a=queue&id=registered&command=restart_app');
  assert.equal((await adapter.getAcknowledgement('local-1')).state, 'ACK_PENDING');
  assert.equal((await adapter.getAcknowledgement('local-1')).accepted, true);
  const poll = new URL(calls[1].path, 'https://example.test/');
  assert.equal(poll.searchParams.get('queued_id'), '42');
  assert.equal(poll.searchParams.get('since'), '1234');
  await adapter.getAcknowledgement('local-1');
  assert.equal(calls.length, 3);
});
test('a device error must not count as success', async () => {
  const {adapter} = setup([{ok:true,queued_id:1,server_time:1234},
    {ok:true,ready:true,entry:{data:{error:'unknown_command'}}}]);
  await adapter.sendCommand(item());
  assert.deepEqual((await adapter.getAcknowledgement('local-1')).state, 'DEVICE_ERROR');
  assert.equal((await adapter.getAcknowledgement('local-1')).accepted, false);
});
test('never retries an uncertain POST, including a concurrent duplicate', async () => {
  const {adapter,calls} = setup([new Error('timeout')]);
  const results = await Promise.all([adapter.sendCommand(item()),adapter.sendCommand(item())]);
  assert.deepEqual(results.map(r=>r.state), ['SUBMISSION_UNKNOWN','COMMAND_ALREADY_SUBMITTED']);
  assert.equal(calls.length,1);
});
test('rejects other booths, stale commands and unsupported mappings before network access', async () => {
  const {adapter,calls} = setup();
  for (const change of [{booth_id:'other'}, {type:'PING'}, {type:'PLAY_ANIMATION'},
    {type:'CHANGE_EVENT',payload:{event_id:'1&command=reboot'}},
    {created_at:new Date(now-300000).toISOString()}]) {
    assert.equal((await adapter.sendCommand(item(change))).accepted,false);
  }
  assert.equal(calls.length,0);
  assert.equal((await adapter.getStatus('registered')).reachable,false);
});
test('change_event uses the existing event identifier, not a media URL', async () => {
  const {adapter,calls} = setup([{ok:true,queued_id:1,server_time:1234}]);
  await adapter.sendCommand(item({type:'CHANGE_EVENT',payload:{event_id:24}}));
  assert.equal(calls[0].body.get('command'),'change_event:24');
});
test('login HTML or malformed queue responses never imply execution', async () => {
  for (const reply of ['<!doctype html>',{ok:true},null]) {
    const {adapter} = setup([reply]);
    assert.equal((await adapter.sendCommand(item())).accepted,false);
    assert.equal((await adapter.getAcknowledgement('local-1')).accepted,false);
  }
});
