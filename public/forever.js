(() => {
  const page = document.querySelector('.forever-page');
  if (!page) return;
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    page.classList.add('old-visible');
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    page.classList.toggle('old-visible', entry.isIntersecting);
  }), { threshold: .06 });
  observer.observe(page);
})();
