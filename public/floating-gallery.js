(() => {
  const gallery = document.querySelector('#gallery-sky');
  const dialog = document.querySelector('.gallery-lightbox');
  if (!gallery || !dialog) return;

  const messages = [
    'Te iubesc.',
    'Ești liniștea mea.',
    'Cu tine mă simt acasă.',
    'Ești bucuria din zilele mele.',
    'Îți aleg zâmbetul, iar și iar.',
    'Exiști în fiecare vis frumos al meu.',
    'Viața mea e mai caldă cu tine.',
    'Tu ești întâmplarea mea preferată.',
    'Lângă tine, timpul devine amintire.',
    'Mi-e drag fiecare „noi”.',
    'Îți iubesc sufletul.',
    'Aș retrăi fiecare clipă cu tine.',
    'Tu faci obișnuitul să fie magic.',
    'Îmi place viața în care exiști tu.',
    'Tot spre tine mă întorc.',
    'Ești cea mai frumoasă parte din mine.',
    'Și povestea noastră abia începe. ♡',
    'Te-aș alege în fiecare poveste.',
    'Cu tine vreau toate zilele care vin. ♥'
  ];
  const tilts = [-9, 6, -4, 10, -7, 5, -11, 4, 8, -6, 7, -8, 5, -3, 9, -7, 6, -5, 8];
  const sphere = document.createElement('div');
  sphere.className = 'scatter-core';
  gallery.append(sphere);
  const dialogImage = dialog.querySelector('.gallery-large-image');
  const dialogMessage = dialog.querySelector('#gallery-message');
  const close = dialog.querySelector('.gallery-close');
  let current = 0;
  let previousOverflow = '';

  messages.forEach((message, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'floating-photo';
    button.style.setProperty('--tilt', `${tilts[index]}deg`);
    button.style.setProperty('--float-time', `${6.5 + Math.random() * 5}s`);
    button.style.setProperty('--float-delay', `${-Math.random() * 8}s`);
    button.style.setProperty('--drift-x', `${Math.round((Math.random() - .5) * 22)}px`);
    button.setAttribute('aria-label', `Deschide amintirea ${index + 1}: ${message}`);
    button.innerHTML = `<span class="gallery-tape"></span><img src="images/noi${index + 1}.jpg" alt="Amintirea noastră ${index + 1}" loading="lazy" decoding="async"><span class="photo-number">${String(index + 1).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => openPhoto(index));
    sphere.append(button);
  });
  function arrangeScatter() {
    const mobile = innerWidth <= 760;
    const columns = mobile ? 3 : 6;
    const rows = Math.ceil(messages.length / columns);
    const cells = Array.from({ length: columns * rows }, (_, index) => index);
    for (let index = cells.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [cells[index], cells[swap]] = [cells[swap], cells[index]];
    }
    sphere.querySelectorAll('.floating-photo').forEach((photo, index) => {
      const cell = cells[index];
      const column = cell % columns;
      const row = Math.floor(cell / columns);
      const x = ((column + .5 + (Math.random() - .5) * .48) / columns) * 100;
      const y = ((row + .5 + (Math.random() - .5) * .42) / rows) * 100;
      photo.style.left = `${x}%`;
      photo.style.top = `${y}%`;
    });
  }
  arrangeScatter();

  function showPhoto(index) {
    current = (index + messages.length) % messages.length;
    dialogImage.classList.remove('gallery-swap');
    void dialogImage.offsetWidth;
    dialogImage.src = `images/noi${current + 1}.jpg`;
    dialogImage.alt = `Amintirea noastră ${current + 1}`;
    dialogMessage.textContent = messages[current];
    dialogImage.classList.add('gallery-swap');
  }
  function openPhoto(index) {
    showPhoto(index);
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    close.focus({ preventScroll: true });
  }
  function closePhoto() { if (dialog.open) dialog.close(); }
  close.addEventListener('click', closePhoto);
  dialog.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(current - 1));
  dialog.querySelector('.gallery-next').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) closePhoto(); });
  dialog.addEventListener('close', () => { document.documentElement.style.overflow = previousOverflow; });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(current - 1);
    if (event.key === 'ArrowRight') showPhoto(current + 1);
  });

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('gallery-visible');
      observer.unobserve(entry.target);
    }), { threshold: .08 });
    sphere.querySelectorAll('.floating-photo').forEach((photo, index) => {
      photo.style.setProperty('--reveal-delay', `${(index % 5) * 80}ms`);
      observer.observe(photo);
    });
  } else sphere.querySelectorAll('.floating-photo').forEach(photo => photo.classList.add('gallery-visible'));
})();
