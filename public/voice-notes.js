(() => {
  const list = document.querySelector('#voice-list');
  if (!list) return;
  const tracks = [
    { file: '1.m4a', title: 'Pentru tine', note: 'primul gând' },
    { file: '2.m4a', title: 'Încă ceva ce simt', note: 'din inimă' },
    { file: '3.m4a', title: 'Vocea mea, pentru tine', note: 'apasă play' },
    { file: '4.m4a', title: 'Un mic mesaj', note: 'doar noi doi' },
    { file: null, title: 'Mesajul cinci', note: 'așteaptă înregistrarea' },
    { file: '6.m4a', title: 'Și încă un motiv', note: 'cu multă iubire' }
  ];
  const players = [];
  const format = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
  tracks.forEach((track, index) => {
    const card = document.createElement('article');
    card.className = `voice-card${track.file ? '' : ' voice-missing'}`;
    card.innerHTML = `<span class="voice-number">${String(index + 1).padStart(2, '0')}</span><button class="voice-play" type="button" ${track.file ? '' : 'disabled'} aria-label="${track.file ? `Redă ${track.title}` : 'Înregistrarea 5 lipsește'}"><span>${track.file ? '▶' : '·'}</span></button><div class="voice-info"><h3>${track.title}</h3><p>${track.note}</p><input class="voice-progress" type="range" min="0" max="100" value="0" step="0.1" ${track.file ? '' : 'disabled'} aria-label="Poziția redării"></div><time class="voice-time">${track.file ? '0:00' : 'lipsește'}</time><span class="voice-card-heart" aria-hidden="true">♥</span>`;
    list.append(card);
    if (!track.file) return;
    const audio = new Audio(`images/${track.file}`);
    audio.preload = 'metadata';
    const play = card.querySelector('.voice-play');
    const icon = play.querySelector('span');
    const progress = card.querySelector('.voice-progress');
    const time = card.querySelector('.voice-time');
    players.push({ audio, card, icon });
    audio.addEventListener('loadedmetadata', () => { time.textContent = format(audio.duration); });
    audio.addEventListener('timeupdate', () => {
      progress.value = audio.duration ? String(audio.currentTime / audio.duration * 100) : '0';
      time.textContent = `${format(audio.currentTime)} / ${format(audio.duration)}`;
    });
    audio.addEventListener('play', () => { card.classList.add('is-playing'); icon.textContent = 'Ⅱ'; });
    audio.addEventListener('pause', () => { card.classList.remove('is-playing'); icon.textContent = '▶'; });
    audio.addEventListener('ended', () => { progress.value = '0'; audio.currentTime = 0; });
    play.addEventListener('click', () => {
      players.forEach(player => { if (player.audio !== audio) player.audio.pause(); });
      if (audio.paused) audio.play().catch(() => { card.classList.add('voice-error'); }); else audio.pause();
    });
    progress.addEventListener('input', () => { if (audio.duration) audio.currentTime = Number(progress.value) / 100 * audio.duration; });
  });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('voice-visible');
      observer.unobserve(entry.target);
    }), { threshold: .1 });
    list.querySelectorAll('.voice-card').forEach((card, index) => { card.style.setProperty('--voice-delay', `${index * 90}ms`); observer.observe(card); });
  } else list.querySelectorAll('.voice-card').forEach(card => card.classList.add('voice-visible'));
})();
