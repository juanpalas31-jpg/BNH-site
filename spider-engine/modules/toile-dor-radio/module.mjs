/** Spider Engine — isolated vintage radio module contract.
 * BNH does not load or execute this module on its public site.
 * Only an explicitly configured Toile d'Or frontend may consume the manifest.
 */
export const radioModule = Object.freeze({
  id: "toile-dor-vintage-radio",
  owner: "spider-engine",
  project: "toile-dor",
  enabledInBNH: false,
  interfaceFiles: ["gallery-playlist.js", "radio-stations.js", "vintage-radio.js"],
  playback: {
    requiresUserGesture: true,
    autoplayOnPageLoad: false,
    volumeMin: 0,
    volumeMax: 1,
    defaultVolume: 0.35,
    transport: "https",
  },
  licensing: {
    commercialUseRequired: true,
    sourceEvidenceRequired: true,
    noUnverifiedStreams: true,
  },
  healthChecks: [
    "player-controls-render",
    "no-audio-before-interaction",
    "volume-persists-on-tune",
    "unavailable-stream-does-not-break-gallery",
    "bnh-site-has-no-radio-injection",
  ],
});
export function validateRadioStation(station) {
  if (!station || typeof station !== "object") return false;
  if (typeof station.name !== "string" || !station.name.trim()) return false;
  if (typeof station.url !== "string") return false;
  try {
    if (new URL(station.url).protocol !== "https:") return false;
  } catch { return false; }
  return station.authorized === true &&
    typeof station.rightsEvidence === "string" &&
    /^https:\/\//.test(station.rightsEvidence);
}
