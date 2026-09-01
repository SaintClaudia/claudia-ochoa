(function(){
  function loadPhoto(pill){
    pill.querySelectorAll('img[data-src]').forEach(function(img){
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
    });
  }
  document.querySelectorAll('.series-nav a, .series-nav .current').forEach(function(pill){
    pill.addEventListener('mouseenter', function(){ loadPhoto(pill); }, { once: true });
    pill.addEventListener('focus', function(){ loadPhoto(pill); }, { once: true });
  });
})();
