// Attila Voice — shared dedicated female speech profile for the Attila agent.
// Uses the browser SpeechSynthesis API. No secrets, no network calls.
// Note: the exact installed female voice depends on the user's device/browser.

export const ATTILA_VOICE_PROFILE = Object.freeze({
  agent: "ATTILA",
  genderPreference: "female",
  lang: "fr-FR",
  rate: 0.96,
  pitch: 1.08,
  volume: 1.0
});

const FEMALE_HINTS = [
  "Audrey", "Amelie", "Amélie", "Julie", "Marie", "Virginie",
  "Google français", "French Female", "female", "femme"
];

export function getAttilaVoice(synth = globalThis.speechSynthesis) {
  if (!synth?.getVoices) return null;
  const voices = synth.getVoices();
  const french = voices.filter(v => /^fr(-|_)/i.test(v.lang || ""));
  return (
    french.find(v => FEMALE_HINTS.some(h => (v.name || "").toLowerCase().includes(h.toLowerCase()))) ||
    french[0] ||
    voices.find(v => FEMALE_HINTS.some(h => (v.name || "").toLowerCase().includes(h.toLowerCase()))) ||
    null
  );
}

export function speakAsAttila(text, synth = globalThis.speechSynthesis) {
  if (!text || typeof text !== "string") throw new Error("ATTILA_TEXT_REQUIRED");
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
    return { spoken: false, reason: "SPEECH_SYNTHESIS_UNAVAILABLE" };
  }

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = ATTILA_VOICE_PROFILE.lang;
  utterance.rate = ATTILA_VOICE_PROFILE.rate;
  utterance.pitch = ATTILA_VOICE_PROFILE.pitch;
  utterance.volume = ATTILA_VOICE_PROFILE.volume;

  const voice = getAttilaVoice(synth);
  if (voice) utterance.voice = voice;

  synth.speak(utterance);
  return {
    spoken: true,
    selectedVoice: voice?.name || "device-default-fr-FR",
    requestedGender: ATTILA_VOICE_PROFILE.genderPreference
  };
}

// Explicit router: Jarvis never inherits Attila's speech profile.
export function routeAgentSpeech({ agent, text }, synth = globalThis.speechSynthesis) {
  if (String(agent).toUpperCase() !== "ATTILA") {
    return { spoken: false, reason: "NOT_ATTILA" };
  }
  return speakAsAttila(text, synth);
}
