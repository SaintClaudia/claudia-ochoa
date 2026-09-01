(function(){
  document.querySelectorAll('.table-scroll').forEach(function(el){
    function update(){
      var atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      el.classList.toggle('at-end', atEnd);
    }
    el.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    update();
  });
})();
