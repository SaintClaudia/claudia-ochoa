(function(){
  var toggle = document.getElementById('cartToggle');
  var drop = document.getElementById('cartDropdown');
  var backdrop = document.getElementById('cartBackdrop');
  var closeBtn = document.getElementById('cartDropClose');
  if(!toggle || !drop || !backdrop) return;

  function closeCartDrop(){
    drop.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.querySelector('nav').classList.remove('dropdown-open');
  }
  window.__closeCartDrop = closeCartDrop;

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
    if(window.__closeAccountDrop) window.__closeAccountDrop();
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
  if(closeBtn) closeBtn.addEventListener('click', closeCartDrop);
  backdrop.addEventListener('click', closeCartDrop);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeCartDrop();
  });
})();
