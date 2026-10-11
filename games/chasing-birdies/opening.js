/* Progressive enhancement: the clubhouse remains available without this intro. */
(() => {
  'use strict';
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(motion.matches)return;
  const root=document.documentElement;
  root.classList.add('intro-playing');
  let screen,shell,holdTimer,hideTimer;
  function finish() {
    if(!root.classList.contains('intro-playing'))return;
    clearTimeout(holdTimer);clearTimeout(fallbackTimer);
    const restoreFocus=screen?.contains(document.activeElement);
    root.classList.remove('intro-playing');
    if(shell)shell.inert=false;
    if(screen){
      screen.classList.add('is-leaving');screen.inert=true;
      hideTimer=setTimeout(()=>{screen.hidden=true;},450);
    }
    if(restoreFocus)document.getElementById('clubhouse-title')?.focus({preventScroll:true});
    document.removeEventListener('keydown',onKey);
    motion.removeEventListener('change',onMotion);
  }
  function onKey(event){if(event.key==='Escape')finish();}
  function onMotion(event){if(event.matches)finish();}
  // An unavailable logo or interrupted initialization must never block entry.
  const fallbackTimer=setTimeout(finish,6500);
  document.addEventListener('DOMContentLoaded',()=>{
    if(!root.classList.contains('intro-playing'))return;
    screen=document.getElementById('opening-screen');shell=document.getElementById('game-shell');
    if(!screen||!shell){finish();return;}
    screen.hidden=false;shell.inert=true;
    document.getElementById('skip-opening').addEventListener('click',finish);
    document.addEventListener('keydown',onKey);
    motion.addEventListener('change',onMotion);
    holdTimer=setTimeout(finish,4000);
  },{once:true});
  window.addEventListener('pagehide',()=>{finish();clearTimeout(hideTimer);if(screen)screen.hidden=true;});
})();
