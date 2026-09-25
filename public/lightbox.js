function initMemoryLightbox() {
  const triggers = document.querySelectorAll('.memory-image-link');
  const dialog = document.querySelector('.memory-lightbox');
  if (!triggers.length || !dialog || typeof dialog.showModal !== 'function') return;
  const layer = dialog.querySelector('.lightbox-hearts');
  const close = dialog.querySelector('.lightbox-close');
  const dialogImage = dialog.querySelector('.lightbox-image');
  const dialogCaption = dialog.querySelector('figcaption');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let floatingTimer;
  let savedOverflow;
  const animations = new Set();
  let activeTrigger = triggers[0];

  function heart(x, y, burst) {
    if (animations.size >= 130 || document.hidden) return;
    const particle = document.createElement('span');
    particle.className = 'burst-heart';
    particle.textContent = Math.random() > .35 ? '♥' : '♡';
    particle.style.fontSize = `${12 + Math.random() * 24}px`;
    particle.style.color = ['#f5a7c8', '#ff739d', '#e6b7ff', '#fff0f8'][Math.floor(Math.random() * 4)];
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    layer.append(particle);
    const angle = Math.random() * Math.PI * 2;
    const distance = 65 + Math.random() * Math.min(innerWidth * .48, 420);
    const dx = burst ? Math.cos(angle) * distance : 0;
    const dy = burst ? Math.sin(angle) * distance * .7 : -50;
    const sway = Math.random() * 160 - 80;
    const turn = Math.random() * 100 - 50;
    const animation = particle.animate([
      { transform: 'translate3d(0,0,0) scale(.15) rotate(0deg)', opacity: 0, offset: 0 },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(1) rotate(${turn}deg)`, opacity: .95, offset: .13, easing: 'ease-out' },
      { transform: `translate3d(${dx + sway}px,${dy - innerHeight * .4}px,0) scale(.95) rotate(${-turn}deg)`, opacity: .75, offset: .55 },
      { transform: `translate3d(${dx - sway * .4}px,${-y - 100}px,0) scale(.6) rotate(${turn}deg)`, opacity: 0, offset: 1 }
    ], { duration: 5500 + Math.random() * 4000, delay: burst ? Math.random() * 220 : 0, easing: 'ease-out', fill: 'both' });
    animations.add(animation);
    animation.onfinish = () => { animations.delete(animation); particle.remove(); };
  }

  function stopHearts() {
    clearInterval(floatingTimer);
    animations.forEach(animation => animation.cancel());
    animations.clear();
    layer.replaceChildren();
  }
  triggers.forEach(trigger => trigger.addEventListener('click', event => {
    event.preventDefault();
    if (dialog.open) return;
    activeTrigger = trigger;
    dialogImage.src = trigger.dataset.fullImage || trigger.querySelector('img').src;
    dialogImage.alt = trigger.querySelector('img').alt;
    dialogCaption.textContent = trigger.dataset.caption || 'de aici a început totul. ♡';
    savedOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    dialog.scrollTop = 0;
    close.focus({ preventScroll: true });
    if (reduced.matches) return;
    const x = event.detail ? Math.max(40, Math.min(innerWidth - 40, event.clientX)) : innerWidth / 2;
    const y = event.detail ? Math.max(80, Math.min(innerHeight - 80, event.clientY)) : innerHeight * .5;
    for (let i = 0; i < 100; i++) heart(x, y, true);
    floatingTimer = setInterval(() => {
      if (document.hidden) return;
      for (let i = 0; i < 3; i++) heart(Math.random() * innerWidth, innerHeight + 25, false);
    }, 650);
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    stopHearts();
    document.documentElement.style.overflow = savedOverflow;
    activeTrigger.focus({ preventScroll: true });
  });
  reduced.addEventListener('change', event => { if (event.matches) stopHearts(); });
}
initMemoryLightbox();
