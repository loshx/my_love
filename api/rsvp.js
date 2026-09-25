import { config } from '../public/config.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Metodă neacceptată.' }); }
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Cerere neacceptată.' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'Răspuns invalid.' }); }
  const { date, time = '', place, message = '' } = body || {};
  const invitePlaces = { kfc: 'KFC', mcdonalds: "McDonald’s", restaurant: 'Restaurant', cinema: 'Cinema', improvizam: 'Vom improviza' };
  const configuredDate = config.dates.find(item => item.id === date);
  const configuredPlace = config.places.find(item => item.id === place);
  const customDate = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T12:00:00Z`));
  const customTime = typeof time === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  const placeLabel = configuredPlace?.label || invitePlaces[place];
  const isNewInvitation = Boolean(invitePlaces[place]);
  const validWhen = isNewInvitation ? customDate && customTime : Boolean(configuredDate);
  if (!validWhen || !placeLabel || typeof message !== 'string' || message.length > 500) return res.status(400).json({ error: 'Alege o zi, o oră și un loc din invitație.' });
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(503).json({ error: 'Invitația nu este încă pregătită să primească răspunsuri. Revino puțin mai târziu. ♡' });
  const when = isNewInvitation ? `${date}, ora ${time}` : `${configuredDate.label}, ${configuredDate.detail}`;
  const text = `♡ A acceptat invitația!\n\nCând: ${when}\nUnde: ${placeLabel}\n\nMesaj: ${message.trim() || 'Fără mesaj, doar dragoste. ♡'}`;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text }), signal: AbortSignal.timeout(10000) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error('Delivery failed');
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'Nu am primit confirmarea trimiterii. Verifică dacă răspunsul a ajuns înainte să încerci din nou.' }); }
}
