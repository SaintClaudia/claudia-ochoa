(function () {
  var link = document.querySelector('.back-link');
  var revealPoint = document.querySelector('.cta-band') || document.querySelector('footer');

  // Keep the link in the footer as a no-JavaScript fallback.
  if (!link || !revealPoint || !('IntersectionObserver' in window)) return;

  function setVisible(visible) {
    link.classList.toggle('show', visible);
    link.tabIndex = visible ? 0 : -1;
    if (visible) {
      link.removeAttribute('aria-hidden');
    } else {
      link.setAttribute('aria-hidden', 'true');
    }
  }

  link.classList.add('is-floating');
  setVisible(false);

  var observer = new IntersectionObserver(function (entries) {
    var entry = entries[0];
    // Once the reveal section has reached the viewport, keep the CTA visible
    // through the remainder of the page. Hide it again when scrolling upward.
    setVisible(entry.isIntersecting || entry.boundingClientRect.top < 0);
  });

  observer.observe(revealPoint);
}());
