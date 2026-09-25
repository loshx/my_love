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
    'Și povestea noastră abia începe. ♡'
  ];
  const tilts = [-7, 5, -3, 8, -5, 4, -8, 3, 7, -4, 5, -6, 3, -2, 8, -5, 4];
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
    button.style.setProperty('--float-time', `${6 + (index % 5) * 1.1}s`);
    button.style.setProperty('--float-delay', `${-(index % 7) * .7}s`);
    button.setAttribute('aria-label', `Deschide amintirea ${index + 1}: ${message}`);
    button.innerHTML = `<span class="gallery-tape"></span><img src="images/noi${index + 1}.jpg" alt="Amintirea noastră ${index + 1}" loading="lazy" decoding="async"><span class="photo-number">${String(index + 1).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => openPhoto(index));
    gallery.append(button);
  });

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
    gallery.querySelectorAll('.floating-photo').forEach((photo, index) => {
      photo.style.setProperty('--reveal-delay', `${(index % 5) * 80}ms`);
      observer.observe(photo);
    });
  } else gallery.querySelectorAll('.floating-photo').forEach(photo => photo.classList.add('gallery-visible'));
})();
