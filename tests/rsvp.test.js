import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/rsvp.js';
import { config } from '../public/config.js';
const valid = { date: config.dates[0].id, place: config.places[0].id, message: 'Abia aștept ♡' };
async function request(body = valid, method = 'POST', headers = {}) {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
  await handler({ method, body, headers }, res); return res;
}
test('rejects unsupported method, invalid options, malformed JSON and cross-site submissions', async () => {
  assert.equal((await request(valid, 'GET')).code, 405);
  assert.equal((await request({ ...valid, place: 'unknown' })).code, 400);
  assert.equal((await request({ ...valid, message: 'x'.repeat(501) })).code, 400);
  assert.equal((await request('{')).code, 400);
  assert.equal((await request(valid, 'POST', { 'sec-fetch-site': 'cross-site' })).code, 403);
});
test('reports delivery truthfully and sends configured labels', async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID, originalFetch = globalThis.fetch;
  try {
    delete process.env.TELEGRAM_BOT_TOKEN; delete process.env.TELEGRAM_CHAT_ID;
    assert.equal((await request()).code, 503);
    process.env.TELEGRAM_BOT_TOKEN = 'test-token'; process.env.TELEGRAM_CHAT_ID = 'test-chat';
    globalThis.fetch = async (url, options) => { const payload = JSON.parse(options.body); assert.equal(payload.chat_id, 'test-chat'); assert.ok(payload.text.includes(valid.message)); assert.ok(payload.text.includes(config.places[0].label)); return { ok: true, json: async () => ({ ok: true }) }; };
    assert.equal((await request()).code, 200);
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ ok: false }) });
    assert.equal((await request()).code, 502);
    globalThis.fetch = async () => { throw new Error('offline'); };
    assert.equal((await request()).code, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (token === undefined) delete process.env.TELEGRAM_BOT_TOKEN; else process.env.TELEGRAM_BOT_TOKEN = token;
    if (chat === undefined) delete process.env.TELEGRAM_CHAT_ID; else process.env.TELEGRAM_CHAT_ID = chat;
  }
});
