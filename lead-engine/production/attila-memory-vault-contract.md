# Attila memory vault — implementation requirements

Private deployment only. Never commit recordings, transcripts, credentials, or child profiles.

- Encrypt media with authenticated encryption (AES-256-GCM) using a randomly generated nonce per object and keys held outside the repository.
- Verify caller identity and guardian/participant permissions server-side before read, write, export or deletion.
- Preserve originals, store derivatives separately, and hash uploaded bytes.
- Keep consent for private archiving separate from consent for podcast release.
- Maintain a tamper-evident audit trail and verified encrypted backups.
- Use transactional queue acknowledgements and recovery tests.
- Do not treat a public GitHub repository or static web host as private storage.

Status: specification only; no vault provisioned or media ingested.
