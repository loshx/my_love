import { config } from '../public/config.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Metodă neacceptată.' }); }
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Cerere neacceptată.' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'Răspuns invalid.' }); }
  const { date, place, message = '' } = body || {};
  const invitePlaces = { kfc: 'KFC', mcdonalds: "McDonald’s", restaurant: 'Restaurant', kebab: 'Kebab', cinema: 'Cinema', improvizam: 'Vom improviza' };
  const configuredDate = config.dates.find(item => item.id === date);
  const configuredPlace = config.places.find(item => item.id === place);
  const customDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T12:00:00Z`));
  const placeLabel = configuredPlace?.label || invitePlaces[place];
  const isNewInvitation = Boolean(invitePlaces[place]);
  const validWhen = isNewInvitation ? customDate : Boolean(configuredDate);
  if (!validWhen || !placeLabel || typeof message !== 'string' || message.length > 500) return res.status(400).json({ error: 'Alege o dată și un loc din invitație.' });
  const when = isNewInvitation ? date : `${configuredDate.label}, ${configuredDate.detail}`;
  const savedAt = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'long', timeStyle: 'medium', timeZone: 'Europe/Chisinau' }).format(new Date());
  const text = `♡ A acceptat invitația!\n\nCând: ${when}\nUnde: ${placeLabel}\nMesaj: ${message.trim() || 'Fără mesaj, doar dragoste. ♡'}\nPrimit: ${savedAt}`;
  if (!req.saveInvitation && !process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'Spațiul de păstrare nu este configurat încă. ♡' });
  try {
    if (req.saveInvitation) {
      await req.saveInvitation(text);
    } else {
    const blob = globalThis.__blobTest || await import('@vercel/blob');
    const pathname = 'raspunsuri.txt';
    const existing = await blob.get(pathname, { access: 'private' });
    const oldText = existing?.statusCode === 200 ? await new Response(existing.stream).text() : 'RĂSPUNSURILE INVITAȚIEI\n';
    const separator = oldText.endsWith('\n') ? '\n' : '\n\n';
    await blob.put(pathname, `${oldText}${separator}${text}\n\n────────────────────\n`, { access: 'private', allowOverwrite: true, contentType: 'text/plain; charset=utf-8', cacheControlMaxAge: 60 });
    }
  } catch { return res.status(502).json({ error: 'Nu am putut salva răspunsul pe server. Încearcă din nou. ♡' }); }
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    try { await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text }), signal: AbortSignal.timeout(10000) }); } catch {}
  }
  return res.status(200).json({ ok: true });
}
