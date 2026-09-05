(function(){
  var dots = document.querySelectorAll('.toc-dot');
  if(!dots.length) return;

  var map = {};
  dots.forEach(function(d){
    var id = d.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if(target) map[id] = d;
  });
  var ids = Object.keys(map);
  if(!ids.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setActive(id){
    dots.forEach(function(d){ d.classList.remove('active'); });
    if(map[id]) map[id].classList.add('active');
  }

  dots.forEach(function(d){
    d.addEventListener('click', function(e){
      e.preventDefault();
      var target = document.getElementById(d.getAttribute('href').slice(1));
      if(!target) return;
      window.__tocNav = true;
      target.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'start'});
      var lastY = window.scrollY;
      (function checkSettled(){
        setTimeout(function(){
          if(window.scrollY === lastY){
            var prevBehavior = document.documentElement.style.scrollBehavior;
            document.documentElement.style.scrollBehavior = 'auto';
            target.scrollIntoView({behavior:'auto', block:'start'});
            document.documentElement.style.scrollBehavior = prevBehavior;
            setTimeout(function(){ window.__tocNav = false; }, 60);
          }
          else { lastY = window.scrollY; checkSettled(); }
        }, 100);
      })();
    });
  });

  var lastId = ids[ids.length - 1];
  function checkBottom(){
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4){
      setActive(lastId);
    }
  }
  window.addEventListener('scroll', checkBottom, {passive:true});

  if(!('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) setActive(entry.target.id);
    });
  }, {rootMargin:'0px 0px -60% 0px', threshold:0});

  ids.forEach(function(id){ observer.observe(document.getElementById(id)); });
})();
