# Attila Photobooth Control Plane

Prepared control path:

OWNER -> ATTILA DIRECT -> validated command -> registered booth -> real photobooth adapter -> existing server -> booth -> acknowledgement -> ATTILA.

The real adapter is the only missing protocol-specific component.

## Safe first integration sequence
1. Observe the existing back-office network request from the owner's computer.
2. Map status endpoint/authentication/command payload without exposing secrets.
3. Implement getStatus, sendCommand and getAcknowledgement.
4. Test PING/status first.
5. Test a reversible application refresh/restart only with owner approval.
6. Test animation synchronization.
7. Record acknowledgement/evidence.

No endpoint or credential belonging to the existing photobooth system is guessed.
