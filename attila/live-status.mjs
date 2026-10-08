// Attila Live Status — truthful machine-readable activity state.
// The voice/UI can ask "Attila, qu'est-ce que tu fais ?" and render this state.
// Persistence adapter is injected so the runtime can use a real store later.

export const ATTILA_STATES = Object.freeze(["IDLE","WORKING","BLOCKED","WAITING_APPROVAL"]);

export function createStatusStore(adapter = null) {
  let memory = {
    state: "IDLE",
    currentTask: null,
    startedAt: null,
    updatedAt: new Date().toISOString(),
    lastEvidence: null,
    blocker: null
  };

  async function read() {
    if (adapter?.read) return (await adapter.read()) ?? memory;
    return memory;
  }

  async function write(patch) {
    const previous = await read();
    const next = Object.freeze({...previous, ...patch, updatedAt:new Date().toISOString()});
    if (!ATTILA_STATES.includes(next.state)) throw new Error("ATTILA_INVALID_STATE");
    if (adapter?.write) await adapter.write(next);
    memory = next;
    return next;
  }

  return Object.freeze({
    read,
    start: task => write({state:"WORKING",currentTask:task,startedAt:new Date().toISOString(),blocker:null}),
    evidence: proof => write({lastEvidence:proof}),
    blocked: reason => write({state:"BLOCKED",blocker:reason}),
    waitingApproval: task => write({state:"WAITING_APPROVAL",currentTask:task}),
    idle: () => write({state:"IDLE",currentTask:null,startedAt:null,blocker:null})
  });
}

export function answerWhatAreYouDoing(status) {
  switch (status?.state) {
    case "WORKING":
      return `Papa, je travaille actuellement sur : ${status.currentTask?.title || status.currentTask || "une tâche en cours"}. Démarré à ${status.startedAt || "heure inconnue"}.`;
    case "BLOCKED":
      return `Papa, je suis bloquée sur ${status.currentTask?.title || status.currentTask || "ma tâche"} : ${status.blocker || "raison non renseignée"}.`;
    case "WAITING_APPROVAL":
      return `Papa, j'attends ton autorisation pour : ${status.currentTask?.title || status.currentTask || "une action protégée"}.`;
    default:
      return "Papa, je ne suis pas en train d'exécuter une tâche maintenant. Je suis en attente de mon prochain cycle.";
  }
}

export function isLiveStatusQuestion(text="") {
  const s=text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  return /qu.?est.ce que tu fais|tu fais quoi|sur quoi tu travailles|es.tu en train de travailler|ton etat/.test(s);
}
