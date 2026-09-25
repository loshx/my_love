(() => {
  const form = document.querySelector('#date-form');
  if (!form) return;
  const dateInput = form.querySelector('#invite-date');
  const status = form.querySelector('.invite-status');
  const button = form.querySelector('.invite-submit');
  const places = { kfc: 'KFC', mcdonalds: "McDonald's", restaurant: 'Restaurant', kebab: 'Kebab', cinema: 'Cinema', improvizam: 'Vom improviza' };
  const dateScroll = form.querySelector('#date-scroll');
  const monthNames = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sept', 'oct', 'nov', 'dec'];
  const availableDates = [
    new Date(2026, 8, 28, 12), new Date(2026, 8, 29, 12), new Date(2026, 8, 30, 12),
    new Date(2026, 9, 1, 12), new Date(2026, 9, 2, 12)
  ];
  availableDates.forEach(day => {
    const value = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.className = 'date-choice';
    choice.dataset.date = value;
    choice.setAttribute('role', 'radio');
    choice.setAttribute('aria-checked', 'false');
    choice.innerHTML = `<strong>${day.getDate()}</strong><span>${monthNames[day.getMonth()]}</span>`;
    choice.addEventListener('click', () => {
      dateScroll.querySelectorAll('.date-choice').forEach(item => { item.classList.remove('selected'); item.setAttribute('aria-checked', 'false'); });
      choice.classList.add('selected');
      choice.setAttribute('aria-checked', 'true');
      dateInput.value = value;
    });
    dateScroll.append(choice);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!dateInput.value) {
      status.textContent = 'Alege mai întâi o zi pentru întâlnirea noastră. ♥';
      dateScroll.focus();
      return;
    }
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    button.disabled = true;
    status.textContent = 'Păstrez răspunsul tău…';
    try {
      const response = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Răspunsul nu a putut fi trimis.');
      status.textContent = 'E o întâlnire! Alegerea ta a fost păstrată pentru mine. ♥';
      form.classList.add('invite-sent');
    } catch (error) {
      status.textContent = `Răspunsul nu a putut fi păstrat: ${error.message}`;
    } finally { button.disabled = false; }
  });

  const items = document.querySelectorAll('.invite-reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('invite-visible', entry.isIntersecting)), { threshold: .15 });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('invite-visible'));
})();
