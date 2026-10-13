import {SwingRigView} from './birdies-swing-rig-view.mjs';
import {CHECKPOINTS,auditPose,sampleSwing,SPEC} from './birdies-swing-rig.mjs';
const canvas=document.querySelector('#rig'),scene=canvas.parentElement,view=new SwingRigView(canvas);
const scrub=document.querySelector('#scrub'),play=document.querySelector('#play'),bones=document.querySelector('#bones'),camera=document.querySelector('#camera');
let playing=false,start=0,frame;
const buttons=CHECKPOINTS.map((p,i)=>{
 const b=document.createElement('button');b.type='button';b.innerHTML=`${i+1}. ${p.name} <span>${auditPose(sampleSwing(p.time)).passed?'Pass':'Check'}</span>`;
 b.addEventListener('click',()=>{stop();scrub.value=p.time;draw();});document.querySelector('#checkpoints').append(b);return b;
});
function draw(){
 const t=Number(scrub.value),pose=view.draw(t,{debug:bones.checked,angle:Number(camera.value)});
 // The ball sits on the same metre-based projection as the club. It is hidden after contact.
 if(t<=.65){const ctx=view.ctx,[x,y]=view.projection.ball,r=SPEC.ballRadius*view.projection.scale;const g=ctx.createRadialGradient(x-r*.3,y-r*.4,r*.1,x,y,r);g.addColorStop(0,'#f5f3e7');g.addColorStop(1,'#a9ad9d');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 let nearest=0;CHECKPOINTS.forEach((p,i)=>{if(Math.abs(p.time-t)<Math.abs(CHECKPOINTS[nearest].time-t))nearest=i;});
 document.querySelector('#phase').textContent=CHECKPOINTS[nearest].name;buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===nearest)));
 const a=auditPose(pose);document.querySelector('#audit').textContent=a.passed?`Geometry checks pass · fixed limbs and grip. ${a.contactError!==null?'Impact contact error: '+(a.contactError*1000).toFixed(3)+' mm.':''}`:a.issues.join('; ');
}
function stop(){playing=false;cancelAnimationFrame(frame);play.textContent='Play swing';}
function tick(now){if(!playing)return;const elapsed=(now-start)/1000;
 // A deliberate backswing, quicker downswing, and a held finish; geometry is unchanged by playback.
 const t=elapsed<.95?elapsed/.95*.36:elapsed<1.35?.36+(elapsed-.95)/.4*.29:Math.min(1,.65+(elapsed-1.35)/.65*.35);
 scrub.value=t;draw();if(t<1)frame=requestAnimationFrame(tick);else stop();}
play.addEventListener('click',()=>{if(playing){stop();return;}scrub.value=0;playing=true;start=performance.now();play.textContent='Pause';frame=requestAnimationFrame(tick);});
document.querySelector('#reset').addEventListener('click',()=>{stop();scrub.value=0;draw();});
scrub.addEventListener('input',()=>{stop();draw();});bones.addEventListener('change',draw);camera.addEventListener('input',draw);
new ResizeObserver(()=>{view.resize(scene.clientWidth,scene.clientHeight);draw();}).observe(scene);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
