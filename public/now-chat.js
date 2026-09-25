(() => {
  const section = document.querySelector('.now-chat');
  const title = document.querySelector('.now-title-reveal');
  const photo = document.querySelector('.now-chat-photo');
  const stickers = document.querySelectorAll('.telegram-sticker');
  if (!section || !title || !photo) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => value * value * (3 - 2 * value);
  let frame = 0;
  function update() {
    frame = 0;
    const top = section.getBoundingClientRect().top;
    const raw = reduced.matches ? 1 : clamp((innerHeight * .94 - top) / (innerHeight * .78));
    const progress = smooth(raw);
    [title, photo].forEach((item, index) => {
      const delayed = smooth(clamp((progress - index * .07) / (1 - index * .07)));
      item.style.setProperty('--now-opacity', String(delayed));
      item.style.setProperty('--now-scale', String(1 + (1 - delayed) * (index ? .42 : .18)));
      item.style.setProperty('--now-rotate', `${(index ? -19 : -7) * (1 - delayed)}deg`);
      item.style.setProperty('--now-lift', `${(index ? 105 : 55) * (1 - delayed)}px`);
    });
    stickers.forEach((sticker, index) => {
      const reveal = smooth(clamp((progress - .18 - index * .025) / .62));
      sticker.style.setProperty('--sticker-reveal', String(reveal));
      sticker.style.setProperty('--sticker-scale', String(.45 + reveal * .55));
    });
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  addEventListener('load', queue);
  reduced.addEventListener('change', queue);
  update();
})();
