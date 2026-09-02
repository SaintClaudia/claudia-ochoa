(function(){
  var toast = document.getElementById('toast');

  document.querySelectorAll('a.nav-mock').forEach(function(link){
    link.setAttribute('role', 'button');
  });

  document.querySelectorAll('.store-drop, .account-drop, .cart-drop, .space-drop').forEach(function(drawer){
    drawer.addEventListener('click', function(event){ event.stopPropagation(); });
  });
  var timer;
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
  }
  document.addEventListener('click', function(e){
    var target = e.target.closest('.nav-mock');
    if(!target) return;
    e.preventDefault();
    showToast("Non-functional prototype — for demonstration purposes only");
  });
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' && e.key !== ' ') return;
    var target = e.target.closest('.nav-mock[role="button"]');
    if(!target) return;
    e.preventDefault();
    target.click();
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
