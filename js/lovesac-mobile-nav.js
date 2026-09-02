(function(){
  var btn = document.getElementById('hamburgerBtn');
  var menu = document.getElementById('mobileMenu');
  if(!btn || !menu) return;
  var navEl = document.querySelector('nav');
  var tiers = document.getElementById('mobileTiers');
  var tier1 = menu.querySelector('.mobile-tier-1');
  var activeTier = tier1;
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
  function closeMenu(){
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    document.documentElement.classList.remove('menu-open-lock');
    setTimeout(resetTiers, 300);
  }
  function openMenu(){
    if(navEl) menu.style.top = navEl.getBoundingClientRect().bottom + 'px';
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    document.documentElement.classList.add('menu-open-lock');
    syncHeight(tier1);
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
        target.classList.add('active');
        target.inert = false;
        syncHeight(target);
      }
    });
  });
  menu.querySelectorAll('.mobile-tier-back').forEach(function(backBtn){
    backBtn.addEventListener('click', function(){
      var tier = backBtn.closest('.mobile-tier-2');
      tier.classList.remove('active');
      tier.inert = true;
      syncHeight(tier1);
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
