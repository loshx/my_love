(() => {
  const sections = [...document.querySelectorAll('.video-moment')];
  if (!sections.length) return;
  const items = sections.map(section => ({ section, video: section.querySelector('video'), visible: false }));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let soundUnlocked = false;

  function playVisible(item) {
    if (!item.visible) return;
    item.video.muted = false;
    item.video.play().catch(() => {});
  }

  function unlockSound() {
    if (soundUnlocked) return;
    soundUnlocked = true;
    items.forEach(item => {
      item.video.muted = false;
      item.video.volume = item.visible ? 1 : 0;
      const attempt = item.video.play();
      if (attempt) attempt.then(() => {
        if (!item.visible) item.video.pause();
        item.video.volume = 1;
      }).catch(() => {});
    });
  }

  document.addEventListener('pointerdown', unlockSound, { once: true, capture: true, passive: true });
  document.addEventListener('keydown', unlockSound, { once: true, capture: true });

  items.forEach(item => {
    item.video.addEventListener('click', () => {
      unlockSound();
      item.video.muted = false;
      item.video.play().catch(() => {});
    });
    if (!('IntersectionObserver' in window) || reducedMotion) {
      item.visible = true;
      item.section.classList.add('video-visible');
      playVisible(item);
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      item.visible = entry.isIntersecting;
      item.section.classList.toggle('video-visible', item.visible);
      if (item.visible) playVisible(item);
      else if (!item.video.paused) item.video.pause();
    }), { threshold: .18 });
    observer.observe(item.section);
  });
})();
