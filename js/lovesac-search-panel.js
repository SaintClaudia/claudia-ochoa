(function(){
  var bars = [
    { toggle: document.getElementById('searchToggle'), panel: document.getElementById('desktopSearch'), closeBtn: document.getElementById('desktopSearchClose'), input: document.getElementById('desktopSearchInput') }
  ].filter(function(b){ return b.toggle && b.panel; });
  if(!bars.length) return;
  function closeAllBars(){
    bars.forEach(function(b){
      b.panel.classList.remove('open');
      b.panel.inert = true;
      b.toggle.setAttribute('aria-expanded', 'false');
      b.input.value = '';
    });
  }
  function openBar(b){
    if(window.holdNavVisible) window.holdNavVisible(900);
    closeAllBars();
    document.querySelectorAll('.nav-item.open').forEach(function(item){
      item.classList.remove('open');
      var t = item.querySelector('.nav-trigger, .icon-store');
      if(t) t.setAttribute('aria-expanded', 'false');
    });
    if(window.__closeStoreDrop) window.__closeStoreDrop();
    if(window.__closeAccountDrop) window.__closeAccountDrop();
    if(window.__closeCartDrop) window.__closeCartDrop();
    if(window.__closeSpaceDrop) window.__closeSpaceDrop();
    b.panel.classList.add('open');
    b.panel.inert = false;
    b.toggle.setAttribute('aria-expanded', 'true');
    setTimeout(function(){ b.input.focus(); }, 200);
  }
  bars.forEach(function(b){
    b.toggle.addEventListener('click', function(){
      if(b.panel.classList.contains('open')) closeAllBars(); else openBar(b);
    });
    if(b.closeBtn) b.closeBtn.addEventListener('click', closeAllBars);
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAllBars();
  });
})();
