(function(){
  var nav = document.querySelector('nav');
  var menu = document.getElementById('mobileMenu');
  if(!nav || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  nav.addEventListener('focusin', function(){ nav.classList.remove('nav-hidden'); });
  var lastY = window.scrollY;
  var ticking = false;
  var holdUntil = 0;
  window.holdNavVisible = function(ms){
    holdUntil = Date.now() + (ms || 900);
    nav.classList.remove('nav-hidden');
  };
  function update(){
    var y = Math.max(window.scrollY, 0);
    var menuOpen = menu && menu.classList.contains('open');
    var dropdownOpen = nav.classList.contains('dropdown-open');
    if(menuOpen || dropdownOpen || y <= nav.offsetHeight || Date.now() < holdUntil){
      nav.classList.remove('nav-hidden');
    } else if(y > lastY + 4){
      nav.classList.add('nav-hidden');
    } else if(y < lastY - 4){
      nav.classList.remove('nav-hidden');
    }
    lastY = y;
    var openDrop = document.querySelector('.store-drop.open, .account-drop.open, .cart-drop.open');
    var openBackdrop = document.querySelector('.store-backdrop.open, .account-backdrop.open, .cart-backdrop.open');
    if(openDrop || openBackdrop){
      var navBottom = window.matchMedia('(max-width:860px)').matches ? '0px' : (nav.getBoundingClientRect().bottom + 'px');
      if(openDrop) openDrop.style.top = navBottom;
      if(openBackdrop) openBackdrop.style.top = navBottom;
    }
    ticking = false;
  }
  function onScroll(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
})();
