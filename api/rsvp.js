import { config } from '../public/config.js';
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Metodă neacceptată.' }); }
  if (req.headers['sec-fetch-site'] === 'cross-site') return res.status(403).json({ error: 'Cerere neacceptată.' });
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ error: 'Răspuns invalid.' }); }
  const { date, place, message = '' } = body || {};
  const selectedDate = config.dates.find(item => item.id === date);
  const selectedPlace = config.places.find(item => item.id === place);
  if (!selectedDate || !selectedPlace || typeof message !== 'string' || message.length > 500) return res.status(400).json({ error: 'Alege o dată și un loc din invitație. Mesajul poate avea cel mult 500 de caractere.' });
  const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(503).json({ error: 'Invitația nu este încă pregătită să primească răspunsuri. Revino puțin mai târziu. ♡' });
  const text = `♡ A acceptat invitația!\n\nCând: ${selectedDate.label}, ${selectedDate.detail} (${selectedDate.id})\nUnde: ${selectedPlace.label}\n\nMesaj: ${message.trim() || 'Fără mesaj, doar dragoste. ♡'}`;
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text }), signal: AbortSignal.timeout(10000) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error('Delivery failed');
    return res.status(200).json({ ok: true });
  } catch { return res.status(502).json({ error: 'Nu am primit confirmarea trimiterii. Verifică dacă răspunsul a ajuns înainte să încerci din nou.' }); }
}
