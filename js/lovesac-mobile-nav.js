(function(){
  var btn = document.getElementById('hamburgerBtn');
  var menu = document.getElementById('mobileMenu');
  if(!btn || !menu) return;
  var navEl = document.querySelector('nav');
  var tiers = document.getElementById('mobileTiers');
  var tier1 = menu.querySelector('.mobile-tier-1');
  var activeTier = tier1;
  var focusScope = window.createLovesacFocusScope ? window.createLovesacFocusScope(menu) : null;
  function loadBackgrounds(container){
    container.querySelectorAll('[data-bg]').forEach(function(image){
      image.style.backgroundImage = 'url("' + image.dataset.bg + '")';
      image.removeAttribute('data-bg');
    });
  }
  function syncHeight(el){
    if(!tiers || !el) return;
    activeTier = el;
    tiers.style.height = el.scrollHeight + 'px';
  }
  function resetTiers(){
    menu.querySelectorAll('.mobile-tier-2.active').forEach(function(t){
      t.classList.remove('active');
      t.inert = true;
    });
    syncHeight(tier1);
  }
  function closeMenu(restoreFocus){
    var wasOpen = menu.classList.contains('open');
    menu.classList.remove('open');
    menu.inert = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    document.documentElement.classList.remove('menu-open-lock');
    if(wasOpen && focusScope) focusScope.leave(restoreFocus);
    setTimeout(resetTiers, 300);
  }
  function openMenu(){
    if(navEl) menu.style.top = navEl.getBoundingClientRect().bottom + 'px';
    menu.classList.add('open');
    menu.inert = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    document.documentElement.classList.add('menu-open-lock');
    syncHeight(tier1);
    if(focusScope) focusScope.enter(btn, menu.querySelector('.mobile-search input'), false);
  }
  btn.addEventListener('click', function(){
    if(menu.classList.contains('open')){ closeMenu(); } else { openMenu(); }
  });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeMenu();
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth > 860) closeMenu();
    else if(menu.classList.contains('open')) syncHeight(activeTier);
  });
  menu.querySelectorAll('.mobile-nav-row[data-tier]').forEach(function(row){
    row.addEventListener('click', function(){
      var target = document.getElementById(row.dataset.tier);
      if(target){
        loadBackgrounds(target);
        target.classList.add('active');
        target.inert = false;
        syncHeight(target);
        window.requestAnimationFrame(function(){
          var backButton = target.querySelector('.mobile-tier-back');
          if(backButton) backButton.focus({preventScroll:true});
        });
      }
    });
  });
  menu.querySelectorAll('.mobile-tier-back').forEach(function(backBtn){
    backBtn.addEventListener('click', function(){
      var tier = backBtn.closest('.mobile-tier-2');
      tier.classList.remove('active');
      tier.inert = true;
      syncHeight(tier1);
      var sourceRow = menu.querySelector('[data-tier="' + tier.id + '"]');
      if(sourceRow) sourceRow.focus({preventScroll:true});
    });
  });
  var mobileStoreLink = document.getElementById('mobileStoreLink');
  if(mobileStoreLink){
    mobileStoreLink.addEventListener('click', function(e){
      e.preventDefault();
      closeMenu();
      var storeToggle = document.getElementById('storeToggle');
      if(storeToggle) setTimeout(function(){ storeToggle.click(); }, 260);
    });
  }
  [document.getElementById('mobileSignInLink'), document.getElementById('mobileCreateAccountLink')].forEach(function(link){
    if(!link) return;
    link.addEventListener('click', function(e){
      e.preventDefault();
      closeMenu();
      var accountToggle = document.getElementById('accountToggle');
      if(accountToggle) setTimeout(function(){ accountToggle.click(); }, 260);
    });
  });
})();
