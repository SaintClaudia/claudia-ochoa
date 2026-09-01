(function(){
  var counters = document.querySelectorAll('[data-count-to]');
  if(!counters.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setText(el, value){
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = prefix + value + suffix;
  }

  counters.forEach(function(el){
    var target = parseFloat(el.getAttribute('data-count-to'));
    if(reduceMotion){ setText(el, target); return; }
    setText(el, 0);
  });

  if(reduceMotion || !('IntersectionObserver' in window)) return;

  function animate(el){
    var target = parseFloat(el.getAttribute('data-count-to'));
    var duration = 1000;
    var start = null;
    function ease(t){ return 1 - Math.pow(1 - t, 3); }
    function step(ts){
      if(start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.round(target * ease(progress));
      setText(el, value);
      if(progress < 1){ requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.5});

  counters.forEach(function(el){ observer.observe(el); });
})();
