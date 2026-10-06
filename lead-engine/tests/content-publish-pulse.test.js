import assert from "node:assert/strict";
import {publicationGate} from "../content/publication-gate.js";
import {threadPulse} from "../senses/thread-pulse.js";
import {internalSilk} from "../content/internal-silk.js";

assert.equal(publicationGate({usefulContent:true}).publishable,false);
assert.equal(threadPulse({impressions:100,clicks:5,engaged:3}).state,"VIBRATION");
assert.equal(threadPulse({impressions:100,clicks:0}).next,"improve_search_match");
assert.ok(internalSilk("comprendre-dpe-a-g").related.includes("dpe-f-g-consequences-proprietaire"));
