const sky = document.querySelector('#starfield');
if (sky) {
  const stars = document.createDocumentFragment();
  for (let index = 0; index < 320; index++) {
    const star = document.createElement('span');
    star.className = 'cosmic-star';
    const bright = index % 9 === 0;
    star.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--size:${bright ? 2 + Math.random() * .6 : 1.2 + Math.random() * .7}px;--light:${.65 + Math.random() * .35};--duration:${3 + Math.random() * 6}s;--delay:${-Math.random() * 10}s;`;
    if (bright) star.classList.add('cosmic-star-bright');
    stars.append(star);
  }
  sky.append(stars);
  document.addEventListener('visibilitychange', () => {
    sky.classList.toggle('is-paused', document.hidden);
  });
}
