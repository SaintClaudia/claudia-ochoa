document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (link) {
  link.addEventListener('load', function () {
    link.rel = 'stylesheet';
  });
});
