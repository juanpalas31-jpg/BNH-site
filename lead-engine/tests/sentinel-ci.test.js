import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyCiFailure,sentinelCiReport} from '../health/sentinel-ci.js';

test('Sentinel classifies runtime setup failure without auto repair',()=>{
 const run={id:1,head_sha:'abc',conclusion:'failure',steps:[{name:'Setup Node',conclusion:'failure'}]};
 const report=sentinelCiReport(run);
 assert.equal(report.state,'ALERT');
 assert.equal(report.diagnosis.organ,'RUNTIME');
 assert.equal(report.repair_authorized,false);
 assert.equal(report.requires_verification_after_repair,true);
});

test('Sentinel reports successful CI as healthy',()=>{
 const report=sentinelCiReport({id:2,head_sha:'def',conclusion:'success',steps:[]});
 assert.equal(report.state,'HEALTHY');
 assert.equal(report.diagnosis.detected,false);
});
