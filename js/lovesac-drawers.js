(function(){
  function initializeDrawer(config){
    var toggle = document.getElementById(config.id + 'Toggle');
    var drop = document.getElementById(config.id + 'Dropdown');
    var backdrop = document.getElementById(config.id + 'Backdrop');
    var closeBtn = document.getElementById(config.id + 'DropClose');
    if(!toggle || !drop || !backdrop) return null;
    var focusScope = window.createLovesacFocusScope ? window.createLovesacFocusScope(drop) : null;

    function close(restoreFocus){
      var wasOpen = drop.classList.contains('open');
      drop.classList.remove('open');
      drop.inert = true;
      backdrop.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.querySelector('nav').classList.remove('dropdown-open');
      if(wasOpen && focusScope) focusScope.leave(restoreFocus);
    }

    window[config.closeName] = close;
    toggle.addEventListener('click', function(){
      var isOpen = drop.classList.contains('open');
      document.querySelectorAll('.nav-item').forEach(function(item){
        item.classList.remove('open');
        var trigger = item.querySelector('.nav-trigger');
        if(trigger) trigger.setAttribute('aria-expanded', 'false');
      });
      if(window.__closeSearchBars) window.__closeSearchBars(false);
      config.closeOthers.forEach(function(name){
        if(typeof window[name] === 'function') window[name]();
      });

      if(isOpen){
        close();
        return;
      }
      var nav = document.querySelector('nav');
      var navBottom = window.matchMedia('(max-width:860px)').matches ? 0 : nav.getBoundingClientRect().bottom;
      drop.style.top = navBottom + 'px';
      backdrop.style.top = navBottom + 'px';
      drop.classList.add('open');
      drop.inert = false;
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('dropdown-open');
      if(focusScope) focusScope.enter(toggle, closeBtn);
    });

    if(closeBtn) closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function(event){
      if(event.key === 'Escape') close();
    });
    return close;
  }

  var closeAccount = initializeDrawer({
    id: 'account',
    closeName: '__closeAccountDrop',
    closeOthers: ['__closeStoreDrop', '__closeCartDrop', '__closeSpaceDrop']
  });
  initializeDrawer({
    id: 'cart',
    closeName: '__closeCartDrop',
    closeOthers: ['__closeStoreDrop', '__closeAccountDrop', '__closeSpaceDrop']
  });

  var accountStoreLink = document.getElementById('accountStoreLink');
  if(accountStoreLink && closeAccount){
    accountStoreLink.addEventListener('click', function(event){
      event.preventDefault();
      event.stopPropagation();
      closeAccount();
      var storeToggle = document.getElementById('storeToggle');
      if(storeToggle) storeToggle.click();
    });
  }
})();
