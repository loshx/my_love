(() => {
  const items = document.querySelectorAll('.now-chat-reveal');
  if (!items.length) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('now-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('now-visible');
    observer.unobserve(entry.target);
  }), { threshold: .16 });
  items.forEach(item => observer.observe(item));
})();
