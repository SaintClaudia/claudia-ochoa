(function(){
  var toggle = document.getElementById('accountToggle');
  var drop = document.getElementById('accountDropdown');
  var backdrop = document.getElementById('accountBackdrop');
  var closeBtn = document.getElementById('accountDropClose');
  var storeLink = document.getElementById('accountStoreLink');
  if(!toggle || !drop || !backdrop) return;

  function closeAccountDrop(){
    drop.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.querySelector('nav').classList.remove('dropdown-open');
  }
  window.__closeAccountDrop = closeAccountDrop;

  toggle.addEventListener('click', function(){
    var isOpen = drop.classList.contains('open');
    document.querySelectorAll('.nav-item').forEach(function(item){
      item.classList.remove('open');
      var trig = item.querySelector('.nav-trigger');
      if(trig) trig.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.desktop-search.open').forEach(function(bar){
      bar.classList.remove('open');
      var input = bar.querySelector('input');
      if(input) input.value = '';
    });
    var searchToggle = document.getElementById('searchToggle');
    if(searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
    if(window.__closeStoreDrop) window.__closeStoreDrop();
    if(window.__closeCartDrop) window.__closeCartDrop();
    if(window.__closeSpaceDrop) window.__closeSpaceDrop();
    if(!isOpen){
      var navBottom = window.matchMedia('(max-width:860px)').matches ? 0 : document.querySelector('nav').getBoundingClientRect().bottom;
      drop.style.top = navBottom + 'px';
      backdrop.style.top = navBottom + 'px';
      drop.classList.add('open');
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.querySelector('nav').classList.add('dropdown-open');
    } else {
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  if(closeBtn) closeBtn.addEventListener('click', closeAccountDrop);
  backdrop.addEventListener('click', closeAccountDrop);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAccountDrop();
  });
  if(storeLink){
    storeLink.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      closeAccountDrop();
      var storeToggle = document.getElementById('storeToggle');
      if(storeToggle) storeToggle.click();
    });
  }
})();
