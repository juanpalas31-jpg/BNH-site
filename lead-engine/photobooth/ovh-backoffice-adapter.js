// Protocol observed in the owner's machine-page HTML, 2026-11-02.
// request is an authenticated server-side transport, never a browser cookie export.
export const BACKOFFICE_ENDPOINT = 'api/admin_machines.php';

function nativeCommand(item) {
  switch (item.type) {
    case 'RESTART_APP': return 'restart_app';
    case 'GET_CAMERA_CONFIG': return 'get_camera_config';
    case 'TAKE_TEST_PHOTO': return 'take_test_photo';
    case 'CHANGE_EVENT': {
      const id = String(item.payload?.event_id ?? '');
      return /^[1-9]\d*$/.test(id) ? `change_event:${id}` : null;
    }
    default: return null; // PING/SYNC/PLAY_ANIMATION have no observed equivalents.
  }
}

export function createOvhBackofficeAdapter({
  boothId, request, readStatus, commands = new Map(), now = Date.now,
} = {}) {
  if (!boothId || typeof request !== 'function' || typeof readStatus !== 'function') {
    throw new TypeError('A registered booth, authenticated transport and live status reader are required');
  }
  const validBooth = id => id === boothId;
  return {
    async getStatus(id) {
      if (!validBooth(id)) return { reachable: false, state: 'BOOTH_MISMATCH' };
      // readStatus must get fresh authenticated status; never reuse the uploaded HTML.
      try {
        const status = await readStatus(id);
        return { ...status, reachable: status?.reachable === true };
      } catch { return { reachable: false, state: 'STATUS_UNAVAILABLE' }; }
    },

    async sendCommand(item = {}) {
      if (!validBooth(item.booth_id)) return { accepted: false, state: 'BOOTH_MISMATCH' };
      const command = nativeCommand(item);
      if (!command) return { accepted: false, state: 'COMMAND_NOT_MAPPED' };
      if (!item.command_id || item.state !== 'QUEUED') return { accepted: false, state: 'INVALID_COMMAND' };
      const created = Date.parse(item.created_at);
      const ttl = Number(item.expires_in_sec);
      if (!Number.isFinite(created) || !Number.isFinite(ttl) || ttl <= 0 || ttl > 300 ||
          created > now() || now() >= created + ttl * 1000) {
        return { accepted: false, state: 'COMMAND_EXPIRED_OR_INVALID' };
      }
      // Reserve before awaiting: concurrent calls and uncertain POST outcomes cannot replay.
      if (commands.has(item.command_id)) return { accepted: false, state: 'COMMAND_ALREADY_SUBMITTED' };
      commands.set(item.command_id, { state: 'SUBMISSION_UNKNOWN' });
      let res;
      try {
        res = await request({ path: BACKOFFICE_ENDPOINT, method: 'POST',
          body: new URLSearchParams({ a: 'queue', id: boothId, command }) });
      } catch { return { accepted: false, state: 'SUBMISSION_UNKNOWN' }; }
      if (res?.ok !== true) return { accepted: false, state: 'SERVER_REJECTED_OR_INVALID_RESPONSE' };
      if (!Number.isSafeInteger(res.queued_id) || res.queued_id <= 0 ||
          !Number.isFinite(res.server_time)) {
        return { accepted: false, state: 'SUBMISSION_UNKNOWN' };
      }
      const record = { state: 'QUEUED_ON_SERVER', queued_id: res.queued_id,
        since: res.server_time, family: command.split(':')[0] };
      commands.set(item.command_id, record);
      return { accepted: true, state: record.state, queued_id: record.queued_id };
    },

    async getAcknowledgement(commandId) {
      const record = commands.get(commandId);
      if (!record || record.state === 'SUBMISSION_UNKNOWN') {
        return { accepted: false, state: record?.state || 'COMMAND_UNKNOWN' };
      }
      if (record.result) return record.result;
      const query = new URLSearchParams({ a: 'poll', id: boothId, family: record.family,
        since: String(record.since), queued_id: String(record.queued_id) });
      let res;
      try { res = await request({ path: `${BACKOFFICE_ENDPOINT}?${query}`, method: 'GET' }); }
      catch { return { accepted: false, state: 'ACK_UNAVAILABLE' }; }
      if (res?.ok !== true) return { accepted: false, state: 'ACK_UNAVAILABLE' };
      // Not ready is pending, never successful execution. No command is resent.
      if (res.ready !== true) return { accepted: false, state: 'ACK_PENDING' };
      if (!res.entry || typeof res.entry.data !== 'object' || !res.entry.data) {
        return { accepted: false, state: 'ACK_INVALID' };
      }
      record.result = { accepted: !res.entry.data.error,
        state: res.entry.data.error ? 'DEVICE_ERROR' : 'DEVICE_ACKNOWLEDGED',
        queued_id: record.queued_id, family: record.family,
        received_at: res.entry.received_at ?? null };
      return record.result;
    },
  };
}
