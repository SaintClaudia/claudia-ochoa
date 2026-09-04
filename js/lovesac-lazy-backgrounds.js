(function(){
  var backgrounds = document.querySelectorAll('[data-lazy-bg]');
  if(!backgrounds.length) return;

  function load(element){
    element.style.backgroundImage = 'url("' + element.dataset.lazyBg + '")';
    element.removeAttribute('data-lazy-bg');
  }

  if(!('IntersectionObserver' in window)){
    backgrounds.forEach(load);
    return;
  }

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      load(entry.target);
      observer.unobserve(entry.target);
    });
  }, {rootMargin:'400px 0px'});

  backgrounds.forEach(function(background){ observer.observe(background); });
})();
