import test from 'node:test';
import assert from 'node:assert/strict';
import {SPEC,BALL,CHECKPOINTS,sampleSwing,auditPose,solveIK,v} from '../js/birdies-swing-rig.mjs';
const close=(a,b,tolerance=1e-6)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
test('real-world equipment dimensions and immutable specifications',()=>{
 close(SPEC.driver.length/.0254,45.5);close(SPEC.driver.gripLength/.0254,10.5);
 close(4/3*Math.PI*SPEC.driver.headRadii.reduce((a,b)=>a*b,1)*1e6,460);
 close(SPEC.ballRadius*2*1000,42.67);assert.ok(Object.isFrozen(SPEC.driver));
 assert.throws(()=>{SPEC.driver.length=1;},TypeError);
});
test('seven required swing positions retain grip, lengths, and bounded joint geometry',()=>{
 for(const point of CHECKPOINTS){const pose=sampleSwing(point.time),audit=auditPose(pose);assert.equal(audit.passed,true,`${point.name}: ${audit.issues}`);}
});
test('full trajectory maintains identity, attachment, rigid club, and collision proxies',()=>{
 const reference=sampleSwing(0),parts=['butt','shaftEnd','headCenter','face','sole'];
 let previous;
 for(let i=0;i<=4000;i++){
  const pose=sampleSwing(i/4000),audit=auditPose(pose);assert.equal(audit.passed,true,`Sample ${i}: ${audit.issues}`);
  assert.equal(pose.hands.left.gloved,true);assert.equal(pose.hands.right.gloved,false);
  assert.ok(pose.hands.left.station<pose.hands.right.station);
  for(let a=0;a<parts.length;a++)for(let b=a+1;b<parts.length;b++)close(v.distance(pose.club[parts[a]],pose.club[parts[b]]),v.distance(reference.club[parts[a]],reference.club[parts[b]]));
  for(const side of ['left','right'])close(v.distance(pose.hands[side].wrist,pose.club.point([side==='left'?.018:-.018,SPEC.handStations[side],.045])),0);
  if(previous){
   // Detect discontinuous flips, rather than accepting seven isolated poses.
   for(const side of ['left','right'])assert.ok(v.distance(pose.elbows[side],previous.elbows[side])<.025,`Elbow discontinuity ${i}`);
   assert.ok(v.distance(pose.club.sole,previous.club.sole)<.025,`Club discontinuity ${i}`);
  }
  previous=pose;
 }
});
test('address clearance and impact contact share the rig ball coordinate',()=>{
 const address=sampleSwing(0),impact=sampleSwing(.65);
 assert.ok(v.distance(address.club.face,BALL)>SPEC.ballRadius);
 close(auditPose(impact).contactError,0);close(impact.diagnostics.gripAdjustment,0);
 assert.ok(sampleSwing(1).feet.right.heel[1]>.2);assert.ok(sampleSwing(1).leadPressure>.9);
});
test('IK rejects unreachable geometry instead of stretching limbs',()=>{
 assert.throws(()=>solveIK([0,0,0],[2,0,0],.34,.31,[0,1,0]),/Unreachable/);
});
