const {test}=require('node:test');
const assert=require('node:assert/strict');
const {profiles,shotRange,target}=require('./player-skills.js');
const golfers=Object.keys(profiles);
const shot={club:'driver',power:100,lie:'Fairway',angle:0,origin:{x:0,y:0},wind:{x:0,y:10}};
test('driving power and wind control trade off rather than one golfer winning both',()=>{
 const shots=golfers.map(golfer=>target({...shot,golfer}));
 assert(shots[0].x<shots[1].x&&shots[1].x<shots[2].x);
 assert(shots[0].y<shots[1].y&&shots[1].y<shots[2].y);
 assert(shots[2].x/shots[0].x<1.15,'Distance advantage stays modest');
});
test('McCaffrey loses the least proportion of distance in rough and sand',()=>{
 for(const lie of ['Rough','Bunker'])for(const club of ['driver','iron','wedge']){
  const retained=golfers.map(golfer=>shotRange({...shot,golfer,club,lie})/shotRange({...shot,golfer,club}));
  assert(retained[1]>retained[0]&&retained[1]>retained[2]);
 }
});
test('putting is identical for all golfers and unaffected by wind',()=>{
 for(const lie of ['Green','Rough','Bunker'])for(const power of [5,50,100]){
  const shots=golfers.map(golfer=>target({...shot,golfer,lie,power,club:'putter'}));
  assert.deepEqual(shots[0],shots[1]);assert.deepEqual(shots[1],shots[2]);assert.equal(shots[0].y,0);
 }
});
test('power scales predictably and cannot exceed the golfer maximum',()=>{
 for(const golfer of golfers)for(const club of ['driver','iron','wedge','putter']){
  const full=shotRange({...shot,golfer,club});
  assert.equal(shotRange({...shot,golfer,club,power:50}),full/2);
  assert.equal(shotRange({...shot,golfer,club,power:150}),full);
  assert.equal(shotRange({...shot,golfer,club,power:-5}),0);
 }
});
test('target remains deterministic and does not mutate shot inputs',()=>{
 const options={...shot,golfer:'purdy'},before=structuredClone(options);
 assert.deepEqual(target(options),target(options));assert.deepEqual(options,before);
});
