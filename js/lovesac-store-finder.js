(function(){
  var toggle = document.getElementById('storeToggle');
  var drop = document.getElementById('storeDropdown');
  var backdrop = document.getElementById('storeBackdrop');
  var closeBtn = document.getElementById('storeDropClose');
  var form = document.getElementById('storeModalForm');
  if(!toggle || !drop || !backdrop || typeof L === 'undefined') return;
  var map;

  function initMap(){
    if(map) return;
    map = L.map('storeMap', { scrollWheelZoom: false }).setView([33.93, -84.38], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);
    document.querySelectorAll('.store-item').forEach(function(item){
      var lat = parseFloat(item.dataset.lat), lng = parseFloat(item.dataset.lng);
      var marker = L.marker([lat, lng]).addTo(map).bindPopup(item.querySelector('h4').textContent);
      item.addEventListener('click', function(){
        map.flyTo([lat, lng], 13);
        marker.openPopup();
        document.querySelectorAll('.store-item').forEach(function(i){ i.classList.remove('active'); });
        item.classList.add('active');
      });
    });
  }

  function closeStoreDrop(){
    drop.classList.remove('open');
    backdrop.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.querySelector('nav').classList.remove('dropdown-open');
  }
  window.__closeStoreDrop = closeStoreDrop;

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
    if(window.__closeAccountDrop) window.__closeAccountDrop();
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
      initMap();
      setTimeout(function(){ if(map) map.invalidateSize(); }, 220);
    } else {
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  if(closeBtn) closeBtn.addEventListener('click', closeStoreDrop);
  backdrop.addEventListener('click', closeStoreDrop);
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeStoreDrop();
  });
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var toast = document.getElementById('toast');
      if(!toast) return;
      toast.textContent = "Non-functional prototype — for demonstration purposes only";
      toast.classList.add('show');
      clearTimeout(window.__storeToastTimer);
      window.__storeToastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
    });
  }
})();
