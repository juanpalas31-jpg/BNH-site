import assert from "node:assert/strict";
import {humanToWebSignal,answerDeepQuestion,describeAttila} from "./deep-dialogue.mjs";
assert.equal(humanToWebSignal("Cherche des prospects"),"EXPLORE");
const ctx={status:{state:"WORKING",currentTask:{id:"a",title:"Vinted",reason:"Améliorer les ventes"},reason:"Priorité commerciale"},plan:[{id:"b",title:"Vérifier les métriques",reason:"Mesurer"}]};
assert.match(answerDeepQuestion("Pourquoi tu travailles ?",ctx),/Priorité commerciale/);
assert.match(answerDeepQuestion("Que fais-tu après ?",ctx),/Vérifier les métriques/);
assert.equal(describeAttila(ctx).feelings.subjectiveExperience,"NOT_CLAIMED");
console.log("Attila deep dialogue tests OK");
