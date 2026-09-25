(() => {
  const form = document.querySelector('#date-form');
  if (!form) return;
  const dateInput = form.querySelector('#invite-date');
  const status = form.querySelector('.invite-status');
  const button = form.querySelector('.invite-submit');
  const places = { kfc: 'KFC', mcdonalds: "McDonald's", restaurant: 'Restaurant', cinema: 'Cinema', improvizam: 'Vom improviza' };
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localToday;

  function makeNotepad(data) {
    const date = new Date(`${data.date}T12:00:00`);
    const prettyDate = new Intl.DateTimeFormat('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    const content = `ÎNTÂLNIREA NOASTRĂ ♡\r\n\r\nZiua: ${prettyDate}\r\nOra: ${data.time}\r\nLocul: ${places[data.place]}\r\nMesaj: ${data.message.trim() || 'Fără mesaj, doar un mare DA. ♡'}\r\n\r\nAbia aștept să ne vedem!`;
    const blob = new Blob(['\ufeff', content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const fileUrl = URL.createObjectURL(blob);
    link.href = fileUrl;
    link.download = `intalnirea-noastra-${data.date}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    makeNotepad(data);
    button.disabled = true;
    status.textContent = 'Fișierul pentru Notepad a fost creat. Trimit și răspunsul…';
    try {
      const response = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Răspunsul nu a putut fi trimis.');
      status.textContent = 'E o întâlnire! Alegerea ta a ajuns la mine. ♡';
      form.classList.add('invite-sent');
    } catch (error) {
      status.textContent = `Fișierul a fost creat, dar trimiterea nu este configurată încă: ${error.message}`;
    } finally { button.disabled = false; }
  });

  const items = document.querySelectorAll('.invite-reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('invite-visible', entry.isIntersecting)), { threshold: .15 });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('invite-visible'));
})();
