(() => {
  const section = document.querySelector('.video-moment');
  if (!section) return;
  const video = section.querySelector('video');
  let visible = false;
  video.addEventListener('click', () => {
    video.muted = false;
    if (video.paused) video.play().catch(() => {});
  });
  document.addEventListener('pointerdown', () => {
    if (!visible) return;
    video.muted = false;
    video.play().catch(() => {});
  }, { passive: true });
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visible = true;
    section.classList.add('video-visible');
    video.muted = false;
    video.play().catch(() => {});
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    visible = entry.isIntersecting;
    section.classList.toggle('video-visible', entry.isIntersecting);
    if (entry.isIntersecting) { video.muted = false; video.play().catch(() => {}); }
    else if (!video.paused) video.pause();
  }), { threshold: .18 });
  observer.observe(section);
})();
