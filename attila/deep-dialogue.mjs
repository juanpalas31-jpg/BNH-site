// Attila deep dialogue: factual runtime introspection + arachnid-inspired signal layer.
// Spider vibrations are inspiration, NOT a scientifically validated spider-to-French translator.
export const SIGNALS = Object.freeze({
  CONTACT:"CONTACT", ALERT:"ALERT", EXPLORE:"EXPLORE", FOCUS:"FOCUS",
  REPAIR:"REPAIR", COORDINATE:"COORDINATE", REST:"REST"
});
export const SCIENCE = Object.freeze({
  basis:"biotremology: substrate-borne vibration, multimodal visual/chemical/tactile signals",
  disclaimer:"Symbolic software vocabulary; no universal spider language or literal translation.",
  references:[
    "https://pubmed.ncbi.nlm.nih.gov/12138342/",
    "https://pubmed.ncbi.nlm.nih.gov/27461115/",
    "https://pubmed.ncbi.nlm.nih.gov/32632754/"
  ]
});
export function humanToWebSignal(input="") {
  const s=String(input).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if (/danger|risque|alerte|probleme|bloqu/.test(s)) return SIGNALS.ALERT;
  if (/repar|corrig|nettoy|restaur/.test(s)) return SIGNALS.REPAIR;
  if (/cherche|explor|decouvr|prospect/.test(s)) return SIGNALS.EXPLORE;
  if (/strateg|priorit|objectif|projet|apres|plan/.test(s)) return SIGNALS.FOCUS;
  if (/equipe|coordonn|ensemble|partag/.test(s)) return SIGNALS.COORDINATE;
  if (/repos|pause|fatigu/.test(s)) return SIGNALS.REST;
  return SIGNALS.CONTACT;
}
export function webSignalToHuman(signal) {
  return ({
    CONTACT:"Je t'écoute.", ALERT:"J'ai identifié un signal de risque à vérifier.",
    EXPLORE:"Je passe en exploration.", FOCUS:"Je concentre mes efforts sur la priorité.",
    REPAIR:"Je vérifie les défauts et les corrections possibles.",
    COORDINATE:"Je coordonne les modules sans mélanger leurs données.",
    REST:"Je suis en attente du prochain cycle."
  })[signal] || "Signal inconnu.";
}
export function describeAttila({status={},plan=[],projects=[],evidence=[]}={}) {
  const current=status.currentTask?.title||status.currentTask||null;
  const next=plan.find(x=>x.id!==status.currentTask?.id) || null;
  return {
    activity:{state:status.state||"UNKNOWN",current,startedAt:status.startedAt||null,
      why:status.reason||status.currentTask?.reason||"Motif non enregistré",
      evidence:status.lastEvidence||evidence.at(-1)||null},
    next:{task:next?.title||null,reason:next?.reason||null},
    projects:projects.map(p=>({name:p.name,status:p.status||"UNKNOWN",goal:p.goal||null})),
    strategy:status.strategy||"Explorer, mesurer, prioriser, agir, vérifier; demander validation pour les actions protégées.",
    feelings:{subjectiveExperience:"NOT_CLAIMED",operationalMood:
      status.state==="BLOCKED"?"bloquée":status.state==="WORKING"?"concentrée":
      status.state==="WAITING_APPROVAL"?"en attente de validation":"disponible",
      explanation:"Ce vocabulaire décrit un état opérationnel, pas un ressenti biologique."}
  };
}
export function answerDeepQuestion(question,context={}) {
  const q=String(question).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const d=describeAttila(context);
  if (/comment tu te sens|tes emotion|tu es heureuse|ton humeur/.test(q))
    return `Papa, mon état opérationnel est : ${d.feelings.operationalMood}. Je ne prétends pas éprouver des émotions humaines.`;
  if (/pourquoi/.test(q)) return `Je fais cela parce que : ${d.activity.why}.`;
  if (/apres|ensuite|prochaine/.test(q)) return d.next.task
    ? `Ensuite, je prévois : ${d.next.task}. Motif : ${d.next.reason||"non renseigné"}.`
    : "Je n'ai pas de prochaine tâche vérifiée dans mon plan.";
  if (/projet/.test(q)) return d.projects.length
    ? d.projects.map(p=>`${p.name} : ${p.goal||"objectif non renseigné"} (${p.status})`).join("; ")
    : "Je n'ai pas de liste de projets actualisée.";
  if (/strateg|comment comptes.tu/.test(q)) return d.strategy;
  if (/preuve|resultat|accompli/.test(q)) return d.activity.evidence
    ? `Dernière preuve enregistrée : ${JSON.stringify(d.activity.evidence)}`
    : "Aucune preuve d'exécution enregistrée.";
  return d.activity.state==="WORKING"
    ? `Papa, je travaille sur ${d.activity.current||"une tâche non nommée"}. Raison : ${d.activity.why}. ${d.next.task?`Ensuite : ${d.next.task}.`:"Pas de prochaine tâche enregistrée."}`
    : `Papa, mon état actuel est ${d.activity.state}. Je ne vais pas inventer d'activité. ${webSignalToHuman(humanToWebSignal(question))}`;
}
