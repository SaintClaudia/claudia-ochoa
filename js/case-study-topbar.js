(function(){
  var topbar = document.querySelector('.topbar');
  if(!topbar || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lastY = window.scrollY;
  var ticking = false;
  function update(){
    var y = Math.max(window.scrollY, 0);
    if(window.__tocNav){ lastY = y; ticking = false; return; }
    if(y > topbar.offsetHeight){
      if(y > lastY + 4){
        topbar.classList.add('topbar-hidden');
      } else if(y < lastY - 4){
        topbar.classList.remove('topbar-hidden');
      }
    } else {
      topbar.classList.remove('topbar-hidden');
    }
    lastY = y;
    ticking = false;
  }
  function onScroll(){
    if(!ticking){ requestAnimationFrame(update); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
})();
