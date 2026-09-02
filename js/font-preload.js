document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (link) {
  link.rel = 'stylesheet';
});
