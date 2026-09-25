(() => {
  const section = document.querySelector('.video-moment');
  if (!section) return;
  const video = section.querySelector('video');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    section.classList.add('video-visible');
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    section.classList.toggle('video-visible', entry.isIntersecting);
    if (!entry.isIntersecting && !video.paused) video.pause();
  }), { threshold: .18 });
  observer.observe(section);
})();
