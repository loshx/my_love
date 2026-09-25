(() => {
  const sections = document.querySelectorAll('.video-moment');
  if (!sections.length) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  sections.forEach(section => {
    const video = section.querySelector('video');
    let visible = false;
    const playWithSound = () => {
      if (!visible) return;
      video.muted = false;
      video.play().catch(() => {});
    };
    video.addEventListener('click', playWithSound);
    document.addEventListener('pointerdown', playWithSound, { passive: true });
    if (!('IntersectionObserver' in window) || reducedMotion) {
      visible = true;
      section.classList.add('video-visible');
      playWithSound();
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      visible = entry.isIntersecting;
      section.classList.toggle('video-visible', visible);
      if (visible) playWithSound();
      else if (!video.paused) video.pause();
    }), { threshold: .18 });
    observer.observe(section);
  });
})();
