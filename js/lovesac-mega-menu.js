(function(){
  var navItems = document.querySelectorAll('.nav-item');
  if(!navItems.length) return;
  var navEl = document.querySelector('nav');
  var navMegaBackdrop = document.getElementById('navMegaBackdrop');
  function closeAll(restoreFocus){
    var openTrigger = document.querySelector('.nav-item.open .nav-trigger');
    navItems.forEach(function(item){
      item.classList.remove('open');
      var trigger = item.querySelector('.nav-trigger');
      if(trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    if(navEl) navEl.classList.remove('dropdown-open');
    if(navMegaBackdrop) navMegaBackdrop.classList.remove('open');
    if(window.__closeStoreDrop) window.__closeStoreDrop();
    if(window.__closeAccountDrop) window.__closeAccountDrop();
    if(window.__closeCartDrop) window.__closeCartDrop();
    if(window.__closeSpaceDrop) window.__closeSpaceDrop();
    if(restoreFocus && openTrigger) openTrigger.focus({preventScroll:true});
  }
  navItems.forEach(function(item){
    var trigger = item.querySelector('.nav-trigger');
    if(!trigger) return;
    trigger.addEventListener('click', function(){
      if(window.__closeSearchBars) window.__closeSearchBars(false);
      var isOpen = item.classList.contains('open');
      closeAll(false);
      if(!isOpen){
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        if(navEl) navEl.classList.add('dropdown-open');
        if(navMegaBackdrop) navMegaBackdrop.classList.add('open');
      }
    });
    item.querySelectorAll('.mega-menu a').forEach(function(link){
      link.addEventListener('click', function(){ closeAll(false); });
    });
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.nav-item')) closeAll(false);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAll(true);
  });

  var wideItems = document.querySelectorAll('.nav-item:has(.mega-menu.mega-wide)');
  var navLogo = document.querySelector('nav .logo');
  var navCart = document.querySelector('nav .icon-cart');
  function syncWideOffset(){
    if(!navLogo || !navCart) return;
    wideItems.forEach(function(item){
      var menu = item.querySelector('.mega-menu.mega-wide');
      if(!menu) return;
      var itemRect = item.getBoundingClientRect();
      var logoRect = navLogo.getBoundingClientRect();
      var cartRect = navCart.getBoundingClientRect();
      menu.style.setProperty('--mega-left', (logoRect.left - itemRect.left) + 'px');
      menu.style.setProperty('--mega-width', (cartRect.right - logoRect.left) + 'px');
    });
  }
  wideItems.forEach(function(item){
    item.addEventListener('mouseenter', syncWideOffset);
  });
  navItems.forEach(function(item){
    var trigger = item.querySelector('.nav-trigger');
    if(trigger) trigger.addEventListener('click', syncWideOffset);
  });
  window.addEventListener('resize', syncWideOffset);
  syncWideOffset();
})();
