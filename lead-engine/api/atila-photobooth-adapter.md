# Attila Photobooth API

Bridge contract for an authorized photobooth.

Supported commands: PING, SYNC, PLAY_ANIMATION, STOP_ANIMATION, REFRESH_GALLERY, REFRESH_QR.

The public API never embeds the owner secret. A booth command requires owner authentication and the physical/remote booth must acknowledge execution.

## Adapter boundary
The existing photobooth software/VPS protocol is not guessed. Its real endpoint, authentication and payload format must be mapped in a device adapter after inspecting the actual software configuration/API.

Until that adapter exists, a successful Attila API response means "command authorized and prepared", not "photobooth executed it".
