(function(){
  var toggle = document.getElementById('storeToggle');
  var drop = document.getElementById('storeDropdown');
  var backdrop = document.getElementById('storeBackdrop');
  var closeBtn = document.getElementById('storeDropClose');
  var form = document.getElementById('storeModalForm');
  if(!toggle || !drop || !backdrop) return;
  var map;
  var googleMapsPromise;
  var GOOGLE_MAPS_API_KEY = 'AIzaSyDgW5fgfIPCysxv14fzFGRGTIu83ZqO2x8';
  var GOOGLE_MAPS_MAP_ID = '82e4bce4d64e2ae3ca57f61f';
  var STORE_MAP_CENTER = { lat: 34.05, lng: -118.35 };

  function loadGoogleMaps(){
    if(window.google && window.google.maps && window.google.maps.marker) return Promise.resolve();
    if(googleMapsPromise) return googleMapsPromise;
    googleMapsPromise = new Promise(function(resolve){
      window.__lovesacInitMap = resolve;
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_API_KEY + '&loading=async&libraries=marker&callback=__lovesacInitMap';
      script.async = true;
      document.head.appendChild(script);
    });
    return googleMapsPromise;
  }

  function initMap(){
    if(map) return;
    map = new google.maps.Map(document.getElementById('storeMap'), {
      center: STORE_MAP_CENTER,
      zoom: 10,
      mapId: GOOGLE_MAPS_MAP_ID,
      gestureHandling: 'cooperative',
      disableDefaultUI: true,
      zoomControl: true
    });
    var infoWindow = new google.maps.InfoWindow();
    document.querySelectorAll('.store-item').forEach(function(item){
      var position = { lat: parseFloat(item.dataset.lat), lng: parseFloat(item.dataset.lng) };
      var name = item.querySelector('h4').textContent;
      var pin = new google.maps.marker.PinElement({
        background: '#EDE7DA',
        borderColor: '#6B4736',
        glyphColor: '#835844'
      });
      var marker = new google.maps.marker.AdvancedMarkerElement({
        position: position,
        map: map,
        title: name,
        content: pin
      });
      marker.addEventListener('gmp-click', function(){
        infoWindow.setContent(buildStoreTag(item));
        infoWindow.open({ map: map, anchor: marker });
      });
      item.addEventListener('click', function(){
        map.panTo(position);
        map.setZoom(13);
        infoWindow.setContent(buildStoreTag(item));
        infoWindow.open({ map: map, anchor: marker });
        document.querySelectorAll('.store-item').forEach(function(i){ i.classList.remove('active'); });
        item.classList.add('active');
      });
    });
  }

  function buildStoreTag(item){
    var wrap = document.createElement('div');
    wrap.className = 'store-map-tag';
    var h4 = document.createElement('h4');
    h4.textContent = item.querySelector('h4').textContent;
    var p = document.createElement('p');
    p.textContent = item.querySelector('p').textContent;
    wrap.appendChild(h4);
    wrap.appendChild(p);
    var distanceEl = item.querySelector('.store-distance');
    if(distanceEl){
      var dist = document.createElement('span');
      dist.className = 'store-map-tag-distance';
      dist.textContent = distanceEl.textContent;
      wrap.appendChild(dist);
    }
    return wrap;
  }

  function closeStoreDrop(){
    drop.classList.remove('open');
    drop.inert = true;
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
      drop.inert = false;
      backdrop.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.querySelector('nav').classList.add('dropdown-open');
      loadGoogleMaps().then(function(){
        var justCreated = !map;
        initMap();
        setTimeout(function(){
          if(!map) return;
          google.maps.event.trigger(map, 'resize');
          if(justCreated) map.setCenter(STORE_MAP_CENTER);
        }, 220);
      });
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
