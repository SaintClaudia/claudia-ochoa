/* Deterministic arcade ball motion; shared by playback and collision tests. */
(function(root) {
  'use strict';
  const radius=6,diameter=radius*2,step=1/120;
  const length=v=>Math.hypot(v.x,v.y);
  function contact(a,b,center) {
    const dx=b.x-a.x,dy=b.y-a.y,ox=a.x-center.x,oy=a.y-center.y;
    const c=ox*ox+oy*oy-diameter*diameter;
    if(c<=0)return 0;
    const aa=dx*dx+dy*dy;
    if(!aa)return null;
    const bb=2*(ox*dx+oy*dy),disc=bb*bb-4*aa*c;
    if(disc<0)return null;
    const t=(-bb-Math.sqrt(disc))/(2*aa);
    return t>=0&&t<=1?t:null;
  }
  function simulate({balls,active,origin,destination,loft=0,duration=.95,pin,lieAt}) {
    const positions=balls.map(b=>({...b.position})),velocities=balls.map(()=>({x:0,y:0}));
    const eligible=balls.map((b,i)=>i===active||b.inPlay);
    const sunk=new Set(),hazards=new Map(),bumped=new Set(),frames=[],collisions=[],lastContact=new Map();
    const delta={x:destination.x-origin.x,y:destination.y-origin.y};
    // Match the original shot's ease-out deceleration so a bump cannot add range.
    const rollingFriction=Math.max(20,2*length(delta)/(duration*duration));
    let free=true,z=0,simulationTime=0;
    function record(time) {frames.push({time,z,positions:positions.map(p=>({...p}))});}
    function collide(i,j) {
      const a=positions[i],b=positions[j];
      let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
      if(d>diameter+.01)return;
      if(d<.001){dx=velocities[i].x-velocities[j].x;dy=velocities[i].y-velocities[j].y;d=Math.hypot(dx,dy)||1;if(!dx&&!dy)dx=1;}
      const nx=dx/d,ny=dy/d,closing=(velocities[i].x-velocities[j].x)*nx+(velocities[i].y-velocities[j].y)*ny;
      if(closing>0){
        // Equal masses, with a little energy lost at contact.
        const impulse=closing*(1+.78)/2;
        velocities[i].x-=impulse*nx;velocities[i].y-=impulse*ny;
        velocities[j].x+=impulse*nx;velocities[j].y+=impulse*ny;
        bumped.add(i);bumped.add(j);
        const pair=[i,j].sort().join(':');
        if(closing>.5&&simulationTime-(lastContact.get(pair)??-Infinity)>.06){
          collisions.push({time:simulationTime,speed:closing,players:[i,j]});
          lastContact.set(pair,simulationTime);
        }
      }
      const overlap=diameter-Math.hypot(b.x-a.x,b.y-a.y);
      if(overlap>0){const shift=(overlap+.01)/2;a.x-=nx*shift;a.y-=ny*shift;b.x+=nx*shift;b.y+=ny*shift;}
    }
    function settle(i) {
      if(!eligible[i]||sunk.has(i)||hazards.has(i))return;
      const p=positions[i],lie=lieAt(p);
      if(lie==='Water'||lie==='Out of bounds'){
        hazards.set(i,lie);velocities[i]={x:0,y:0};
        // A displaced player's ball returns to its safe spot without a penalty.
        positions[i]={...balls[i].position};return;
      }
      if(pin&&Math.hypot(p.x-pin.x,p.y-pin.y)<(loft===0&&i===active?13:10)){
        sunk.add(i);positions[i]={...pin};velocities[i]={x:0,y:0};
      }
    }
    positions[active]={...origin};record(0);
    const maxTime=duration+5;
    for(let tick=1;tick<=Math.ceil(maxTime/step);tick++) {
      const time=tick*step;simulationTime=time;
      if(free) {
        const t=Math.min(1,time/duration),ease=1-(1-t)**2;
        const previous=positions[active];
        const next={x:origin.x+delta.x*ease,y:origin.y+delta.y*ease};
        z=Math.sin(Math.PI*t)*loft;
        let hit=null,fraction=Infinity;
        if(z<=diameter)for(let j=0;j<balls.length;j++) {
          if(j===active||!eligible[j])continue;
          const f=contact(previous,next,positions[j]);
          if(f!==null&&f<fraction){hit=j;fraction=f;}
        }
        if(hit!==null) {
          positions[active]={x:previous.x+(next.x-previous.x)*fraction,y:previous.y+(next.y-previous.y)*fraction};
          velocities[active]={x:delta.x*2*(1-t)/duration,y:delta.y*2*(1-t)/duration};
          free=false;z=0;collide(active,hit);
        } else {
          positions[active]=next;
          if(z<=.01){settle(active);if(sunk.has(active)||hazards.has(active))free=false;}
          if(t===1)free=false;
        }
      } else {
        z=0;
        for(let i=0;i<balls.length;i++) {
          if(!eligible[i]||sunk.has(i)||hazards.has(i))continue;
          positions[i].x+=velocities[i].x*step;positions[i].y+=velocities[i].y*step;
        }
        // Iterate contacts so a three-ball chain transfers motion in one frame.
        for(let pass=0;pass<3;pass++)for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
          if(eligible[i]&&eligible[j]&&!sunk.has(i)&&!sunk.has(j)&&!hazards.has(i)&&!hazards.has(j))collide(i,j);
        }
        for(let i=0;i<balls.length;i++) {
          if(i!==active&&!bumped.has(i))continue;
          settle(i);
          const speed=length(velocities[i]);
          if(speed){const lie=lieAt(positions[i]),friction=rollingFriction*(lie==='Bunker'?2.7:lie==='Rough'?1.7:1);const scale=Math.max(0,speed-friction*step)/speed;velocities[i].x*=scale;velocities[i].y*=scale;}
        }
      }
      if(tick%2===0)record(time);
      if(!free&&velocities.every(v=>length(v)<.1)){record(time);break;}
    }
    // Keep safely restored hazard balls separate from the final resting balls.
    for(let pass=0;pass<4;pass++)for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
      if(eligible[i]&&eligible[j]&&!sunk.has(i)&&!sunk.has(j))collide(i,j);
    }
    record(frames.at(-1).time+step);
    return {frames,positions,collisions,sunk:[...sunk],hazards:[...hazards],bumped:[...bumped].filter(i=>i!==active)};
  }
  const api={simulate,radius};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.BirdiesBallPhysics=api;
})(typeof window!=='undefined'?window:globalThis);
