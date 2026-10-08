import test from 'node:test';import assert from 'node:assert/strict';
import {createEditProject,planCinematicEdit,buildEditManifest} from './attila-cinematic-editor.js';
const p=createEditProject({workspaceId:'vinted-juanpalas',title:'Affiche rock',clips:[{assetId:'clip-1',durationSeconds:8,authorized:true},{assetId:'clip-2',durationSeconds:6,authorized:true}]});
test('keeps conventional edit non-generative',()=>{const x=planCinematicEdit(p);assert.equal(x.edit.generativePixels,false);assert.ok(x.edit.timeline.every(s=>s.generativeImage===false))});
test('requires authorized source media',()=>assert.throws(()=>createEditProject({workspaceId:'x',title:'x',clips:[{assetId:'x',durationSeconds:2,authorized:false}]})));
test('builds renderer-neutral mp4 manifest',()=>{const x=buildEditManifest(planCinematicEdit(p));assert.equal(x.output.container,'mp4');assert.equal(x.constraints.noGenerativePixels,true)});
