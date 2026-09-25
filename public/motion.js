export function initScrollAnimations() {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const groups = [
    ['.hero > .eyebrow, .hero h1, .hero .intro, .hero > .button', 110],
    ['.section-heading > *', 140],
    ['.photo-frame, .memory-copy', 160],
    ['.album-footnote', 0],
    ['.letter > *', 100],
    ['.invitation-intro > *', 100],
    ['#invite-form fieldset', 120],
    ['.date-options .option', 90],
    ['.place-options .option', 100],
    ['.message-label, #message, .submit, .form-note', 80],
    ['footer > *', 100]
  ];
  const elements = [];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
  groups.forEach(([selector, stagger]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.style.setProperty('--reveal-delay', `${Math.min(index * stagger, 300)}ms`);
      element.classList.add('scroll-reveal');
      elements.push(element);
    });
  });
  requestAnimationFrame(() => requestAnimationFrame(() => {
    elements.forEach(element => observer.observe(element));
  }));
  document.addEventListener('focusin', event => {
    elements.forEach(element => {
      if (element.contains(event.target)) {
        element.classList.add('is-revealed');
        observer.unobserve(element);
      }
    });
  });
  preference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      elements.forEach(element => element.classList.add('is-revealed'));
    }
  });
}
