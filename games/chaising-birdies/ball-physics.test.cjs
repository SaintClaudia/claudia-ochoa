const {test}=require('node:test');
const assert=require('node:assert/strict');
const {simulate}=require('./ball-physics.js');
const ball=(x,y=0,inPlay=true)=>({position:{x,y},inPlay});
const run=(balls,extra={})=>simulate({balls,active:0,origin:balls[0].position,destination:{x:100,y:0},loft:0,lieAt:()=> 'Fairway',...extra});
const gap=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
test('head-on impact transfers motion without adding shot range',()=>{
 const r=run([ball(0),ball(50)]);
 assert.deepEqual(r.bumped,[1]);assert(r.positions[0].x<50);assert(r.positions[1].x>50&&r.positions[1].x<101);assert(gap(...r.positions)>=12);
});
test('glancing impact sends the struck ball sideways',()=>{
 const r=run([ball(0),ball(50,8)]);
 assert(r.positions[0].y<0);assert(r.positions[1].y>8);assert(gap(...r.positions)>=12);
});
test('airborne ball passes above a resting ball',()=>{
 const r=run([ball(0),ball(50)],{loft:95});
 assert.deepEqual(r.bumped,[]);assert.deepEqual(r.positions,[{x:100,y:0},{x:50,y:0}]);
});
test('a ball landing at an occupied spot separates and bumps the resting ball',()=>{
 const r=run([ball(0),ball(100)],{loft:95});
 assert.deepEqual(r.bumped,[1]);assert(r.positions[1].x>100);assert(gap(...r.positions)>=12);
});
test('three-ball chain moves without leaving overlap',()=>{
 const r=run([ball(0),ball(50),ball(65)]);
 assert(r.bumped.includes(1)&&r.bumped.includes(2));assert(r.positions[2].x>65);
 for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)assert(gap(r.positions[i],r.positions[j])>=11.99);
});
test('unplayed tee balls and holed balls are excluded',()=>{
 const r=run([ball(0),ball(0,0,false),ball(50,0,false)]);
 assert.deepEqual(r.bumped,[]);assert.deepEqual(r.positions[0],{x:100,y:0});
});
test('rolling balls can enter the cup, including a ball bumped by another player',()=>{
 const r=run([ball(0),ball(50)],{pin:{x:85,y:0}});
 assert(r.sunk.includes(1));assert.deepEqual(r.positions[1],{x:85,y:0});
});
test('an active ball crossing a ground hazard is flagged',()=>{
 const r=run([ball(0)],{lieAt:p=>p.x>40?'Water':'Fairway'});
 assert.deepEqual(r.hazards,[[0,'Water']]);assert.deepEqual(r.positions[0],{x:0,y:0});
});
test('a bumped ball sent into a hazard is restored without overlapping',()=>{
 const r=run([ball(0),ball(50)],{lieAt:p=>p.x>70?'Water':'Fairway'});
 assert(r.hazards.some(([i])=>i===1));assert(gap(...r.positions)>=11.99);
});
test('inputs remain unchanged for animation playback',()=>{
 const balls=[ball(0),ball(50)];run(balls);assert.deepEqual(balls,[ball(0),ball(50)]);
});

test('collision cues identify the moment and force of each impact',()=>{
 const r=run([ball(0),ball(50)]);
 assert.equal(r.collisions.length,1);
 assert.deepEqual(r.collisions[0].players,[0,1]);
 assert(r.collisions[0].time>0&&r.collisions[0].time<r.frames.at(-1).time);
 assert(r.collisions[0].speed>0);
 assert.equal(run([ball(0),ball(50)],{loft:95}).collisions.length,0);
 const chain=run([ball(0),ball(50),ball(65)]);
 assert(chain.collisions.length>=2);
});
