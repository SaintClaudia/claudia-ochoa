(function(){
  var link = document.querySelector('.back-link');
  var ctaBand = document.querySelector('.cta-band') || document.querySelector('footer');
  if(!link || !ctaBand) return;
  function onScroll(){
    var threshold = ctaBand.offsetTop;
    if(window.scrollY + window.innerHeight > threshold){
      link.classList.add('show');
    } else {
      link.classList.remove('show');
    }
  }
  link.addEventListener('focus', function(){ link.classList.add('show'); });
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();
