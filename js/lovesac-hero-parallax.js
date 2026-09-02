(function(){
  var background = document.querySelector('.hero-bg');
  if(!background || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(background.hasAttribute('data-parallax-desktop-only') && window.matchMedia('(max-width:860px)').matches) return;

  var hero = background.parentElement;
  var ticking = false;
  function update(){
    background.style.transform = 'translateY(' + (-hero.getBoundingClientRect().top * 0.15) + 'px)';
    ticking = false;
  }
  function onScroll(){
    if(ticking) return;
    requestAnimationFrame(update);
    ticking = true;
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  update();
})();
