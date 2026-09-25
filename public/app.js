(() => {
// Start animation independently of configuration and ES module loading.
import('./config.js').then(({ config }) => {
  const name = document.querySelector('#name');
  if (name) name.textContent = config.name.toLocaleUpperCase('ro');
}).catch(() => { /* The HTML already contains the default name. */ });

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
const memoryTargets = document.querySelectorAll('.memory-reveal-target');
const memorySection = document.querySelector('.scroll-memory');
const mobileLayout = window.matchMedia('(max-width: 760px)');
const clamp = value => Math.max(0, Math.min(1, value));
const smooth = value => value * value * (3 - 2 * value);
let frame = 0;
function updateScroll() {
  frame = 0;
  const progress = motionPreference.matches ? 0 : Math.min(window.scrollY / Math.max(window.innerHeight * .5, 1), 1);
  root.style.setProperty('--copy-scroll', `${-progress * 38}px`);
  root.style.setProperty('--cat-scroll', `${-progress * 75}px`);
  root.style.setProperty('--cat-turn', `${progress * 5}deg`);
  root.style.setProperty('--star-scroll', `${-progress * 35}px`);
  memoryTargets.forEach(target => {
    const top = (mobileLayout.matches ? target : memorySection).getBoundingClientRect().top;
    const progress = clamp((window.innerHeight * .94 - top) / (window.innerHeight * .76));
    const isText = target.classList.contains('memory-title-reveal');
    const reveal = motionPreference.matches ? 1 : clamp((progress - (isText ? .08 : 0)) / (isText ? .92 : 1));
    const eased = smooth(reveal);
    target.style.setProperty('--memory-opacity', String(eased));
    target.style.setProperty('--memory-scale', String(1 + (1 - eased) * (isText ? .18 : .42)));
    target.style.setProperty('--memory-tilt', `${-19 + eased * 21}deg`);
    target.style.setProperty('--memory-lift', `${(isText ? 55 : 105) * (1 - eased)}px`);
    const accent = motionPreference.matches ? 1 : smooth(clamp((reveal - .16) / .84));
    target.style.setProperty('--accent-opacity', String(accent));
    target.style.setProperty('--accent-lift', `${22 * (1 - accent)}px`);
  });
}
function queueScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', queueScroll, { passive: true });
window.addEventListener('resize', queueScroll);
motionPreference.addEventListener('change', queueScroll);
updateScroll();
window.addEventListener('load', queueScroll);
document.fonts?.ready.then(queueScroll);
})();
