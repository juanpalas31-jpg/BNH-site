import assert from "node:assert/strict";
import {validateJourney,weakestTransition} from "../commercial/funnel-stage-engine.js";
import {leadQuality} from "../commercial/lead-quality.js";
import {learningGate} from "../commercial/learning-gate.js";

assert.equal(validateJourney(["organic_entry","content_engaged","qualified_lead","sale"]).valid,true);
assert.equal(validateJourney(["appointment","form_start"]).valid,false);

const weak=weakestTransition({organic_entry:1000,content_engaged:500,simulator_start:200,simulator_complete:100,form_start:40,qualified_lead:20,appointment:5,quote:4,sale:2});
assert.equal(weak.from,"qualified_lead");
assert.equal(weak.to,"appointment");

assert.equal(leadQuality({serviceArea:true,owner:true,projectIdentified:true,timelineKnown:true,requestedAssessment:true}).band,"HIGH");
assert.equal(learningGate({samples:200,verifiedOutcomes:10,lift:.15,confidence:.9}).pass,true);
assert.equal(learningGate({samples:20,verifiedOutcomes:1,lift:.5,confidence:.95}).pass,false);
