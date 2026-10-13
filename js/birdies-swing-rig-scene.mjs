import {SwingRigView} from './birdies-swing-rig-view.mjs';
const root=document.querySelector('.cb-swing'),stage=root.querySelector('.cb-swing-stage');
const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','Procedural swing rig review');canvas.setAttribute('role','img');
canvas.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:3';stage.append(canvas);
root.querySelector('.cb-swing-golfer').style.visibility='hidden';
const view=new SwingRigView(canvas);let width=0,height=0;
root.addEventListener('birdies:rig-progress',event=>{
 const {progress,tee,launch}=event.detail;
 if(width!==stage.clientWidth||height!==stage.clientHeight){width=stage.clientWidth;height=stage.clientHeight;view.resize(width,height);}
 const phase=progress<=launch?progress/launch*.65:Math.min(1,.65+(progress-launch)/.18*.35);
 // Use the same rig projection while retaining the original tee anchor.
 view.draw(phase,{anchor:tee,angle:.48});
});
