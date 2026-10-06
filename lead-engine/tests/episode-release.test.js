import assert from "node:assert/strict";
import {releaseMode} from "../legacy/episode-release-protocol.js";
import {lifetimeCoverage} from "../legacy/lifetime-coverage.js";

assert.equal(releaseMode({normal:true}).mode,"NORMAL");
assert.equal(releaseMode({seriousCircumstance:true,trustedHumanValidation:true}).mode,"ACCELERATED");
assert.equal(releaseMode({seriousCircumstance:true,recipientRequest:true,trustedHumanValidation:true}).mode,"COMPASSIONATE_FULL_ACCESS");

const c=lifetimeCoverage([
 {founder_priority:"ESSENTIAL",fallback_release:"ALWAYS_RELEASE_IF_COMPASSIONATE"},
 {founder_priority:"BONUS",fallback_release:"NORMAL_ONLY"}
]);
assert.equal(c.coverage,1);
