(function(){
  var toast = document.getElementById('toast');
  var timer;
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
  }
  document.querySelectorAll('.nav-mock').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      showToast("Non-functional prototype — for demonstration purposes only");
    });
  });
  var mobileSearch = document.querySelector('.mobile-search');
  if(mobileSearch){
    mobileSearch.addEventListener('submit', function(e){
      e.preventDefault();
      showToast("Non-functional prototype — for demonstration purposes only");
      var menu = document.getElementById('mobileMenu');
      var btn = document.getElementById('hamburgerBtn');
      if(menu) menu.classList.remove('open');
      if(btn){
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open menu');
      }
    });
  }
  document.querySelectorAll('.desktop-search-inner').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      showToast("Non-functional prototype — for demonstration purposes only");
    });
  });
})();
