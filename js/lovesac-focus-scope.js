(function(){
  var focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function visibleFocusable(container){
    return Array.prototype.filter.call(container.querySelectorAll(focusableSelector), function(element){
      return !element.closest('[inert]')
        && element.getClientRects().length > 0
        && window.getComputedStyle(element).visibility !== 'hidden';
    });
  }

  window.createLovesacFocusScope = function(container){
    var returnTarget = null;

    function trapTab(event){
      if(event.key !== 'Tab') return;
      var focusable = visibleFocusable(container);
      if(!focusable.length){
        event.preventDefault();
        container.focus();
        return;
      }
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        last.focus();
      } else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        first.focus();
      }
    }

    return {
      enter: function(opener, preferredTarget, containFocus){
        returnTarget = opener || document.activeElement;
        if(containFocus !== false) container.addEventListener('keydown', trapTab);
        window.requestAnimationFrame(function(){
          var target = preferredTarget || visibleFocusable(container)[0] || container;
          target.focus({preventScroll:true});
        });
      },
      leave: function(restoreFocus){
        container.removeEventListener('keydown', trapTab);
        if(restoreFocus !== false && returnTarget && returnTarget.isConnected){
          returnTarget.focus({preventScroll:true});
        }
        returnTarget = null;
      }
    };
  };
})();
