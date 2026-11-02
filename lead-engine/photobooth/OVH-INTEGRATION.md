# Photobooth OVH: observed protocol and integration boundary

Source: owner-provided HTML of the authenticated machine page, 2026-11-02.
No credentials or uploaded page contents are committed here.

## Confirmed browser-to-back-office protocol

- Endpoint: `api/admin_machines.php`, relative to the owner's existing HTTPS origin.
- Queue: POST URL-encoded form `a=queue&id=<registered booth>&command=<native command>`.
- Queue response fields used by the UI: `ok`, `queued_id`, `server_time`.
- Poll: GET `a=poll&id=<registered booth>&family=<command family>&since=<server_time>&queued_id=<queued_id>`.
- The UI considers `ok && ready` a device answer and reads `entry.data` and `entry.received_at`.
- `entry.data.error` is a device failure, even if `ok` and `ready` are true.
- A one-minute timeout does NOT cancel a command: the UI says it stays queued until reconnection.
- Confirmed native commands include `restart_app`, `get_camera_config`, `take_test_photo`,
  `change_event:<event id>`, `set_camera_<key>:<option index>`, and `reboot`.
  This adapter deliberately maps only the first four. Arbitrary commands are rejected.

## Adapter integration

`createOvhBackofficeAdapter` implements the existing adapter method names:
`getStatus`, `sendCommand`, `getAcknowledgement`.

The host must supply:

1. One explicitly registered `boothId`.
2. `request({path, method, body})`: an authenticated **server-side** transport for the
   owner's configured HTTPS origin, returning parsed JSON. Restrict it to this origin
   and endpoint, refuse cross-origin redirects, and impose a request timeout.
   Never collect/export the user's browser session cookies to configure it.
3. `readStatus(boothId)`: a fresh authenticated status reader returning an explicit
   `reachable` boolean. No status API route was confirmed by the uploaded HTML.
   An offline booth must remain unreachable; the captured historical status is not live data.
4. Command correlation storage appropriate for the deployment. The default Map is
   process-local and only suitable for a single-process integration test. Restarting it
   loses correlation; do not replay uncertain submissions. A production store must
   provide atomic reservation and durable records before supporting multiple workers.

`RESTART_APP` matches the existing control-plane allowlist. The adapter's
`GET_CAMERA_CONFIG`, `TAKE_TEST_PHOTO`, and `CHANGE_EVENT` mappings do not expand the
existing API/control-plane authorization rules: those hosts currently reject these
types, so exposing them requires an explicit reviewed change there.

`PLAY_ANIMATION` and `SYNC` are not mapped: selecting an event that restarts the app
does not prove support for uploading or playing an arbitrary animation.
`PING`, Bluetooth, gallery/QR updates and media upload have no observed mappings.

An acknowledgement to `restart_app` means the device accepted the restart command;
it does not verify that the application has restarted and become healthy. Follow up
with fresh status before reporting full recovery.

## Remaining blockers

This is a protocol adapter, not a deployed working remote connection. The current
public Attila handler still prepares commands only. Before wiring it into production,
establish a supported server-side authentication mechanism with the VPS owner/operator,
confirm a fresh status source, choose durable command storage, and test against an
online booth. Do not use the uploaded PIN as an assumed API credential.

First live check: authenticated read-only status. Queue no commands while offline.
For a subsequent restart test, confirm that no session will be interrupted. Do not
automatically retry POSTs after a timeout: the server may have queued the command.

## Validation

Run from `lead-engine`: `node --test photobooth/ovh-backoffice-adapter.test.js`.
Tests use mocked transport only: queue encoding, exact command correlation, pending
versus successful answers, device failure, uncertain delivery/duplicate prevention,
scope/expiry enforcement, event mapping, and malformed/login responses.
