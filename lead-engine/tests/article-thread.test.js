import assert from "node:assert/strict";
import {articleToThread} from "../content/article-to-thread.js";
const t=articleToThread({slug:"dpe-electricite-changement-2026",intent:"high",cta:"bilan_residentiel_gratuit"});
assert.equal(t.threadId,"content:dpe-electricite-changement-2026");
assert.equal(t.destination,"bilan_residentiel_gratuit");
assert.equal(t.publicationAutomatic,false);
