import assert from "node:assert/strict";
import {aggregateVibrations,webState} from "../senses/web-vibration-aggregator.js";
import {dualTrackController} from "../content/dual-track-controller.js";

const s=aggregateVibrations([{type:"impression"},{type:"organic_click"},{type:"content_engaged"}]);
assert.equal(s.total,3);
assert.equal(webState({organic_click:1}),"VIBRATION");
assert.equal(webState({form_submit:1}),"COLLAGE");
assert.equal(webState({sale:1}),"CAPTURE");

const d=dualTrackController({engineBacklog:["sense","learn"],contentBacklog:["a","b"],maxParallel:4});
assert.equal(d.engine.length,2);
assert.equal(d.content.length,2);
