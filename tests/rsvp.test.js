import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/rsvp.js';
import { config } from '../public/config.js';
const valid = { date: config.dates[0].id, place: config.places[0].id, message: 'Abia aștept ♡' };
async function request(body = valid, method = 'POST', headers = {}, saveInvitation) {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(data) { this.data = data; return this; } };
  await handler({ method, body, headers, saveInvitation }, res); return res;
}
test('local server saves the date and place selected in the wizard', async () => {
  let saved;
  const response = await request({ date: '2026-09-28', place: 'cinema', message: '' }, 'POST', {}, async text => { saved = text; });
  assert.equal(response.code, 200);
  assert.match(saved, /2026-09-28/);
  assert.match(saved, /Cinema/);
});
test('rejects unsupported method, invalid options, malformed JSON and cross-site submissions', async () => {
  assert.equal((await request(valid, 'GET')).code, 405);
  assert.equal((await request({ ...valid, place: 'unknown' })).code, 400);
  assert.equal((await request({ ...valid, message: 'x'.repeat(501) })).code, 400);
  assert.equal((await request('{')).code, 400);
  assert.equal((await request(valid, 'POST', { 'sec-fetch-site': 'cross-site' })).code, 403);
});
test('uses the connected Blob store and appends configured labels to the server file', async () => {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  let stored = 'RĂSPUNSURILE INVITAȚIEI\n';
  try {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    globalThis.__blobTest = {
      get: async () => ({ statusCode: 200, stream: new Blob([stored]).stream() }),
      put: async (_path, content) => { stored = content; }
    };
    assert.equal((await request()).code, 200);
    assert.match(stored, new RegExp(valid.message));
    assert.match(stored, new RegExp(config.places[0].label));
    globalThis.__blobTest.put = async () => { throw new Error('storage offline'); };
    assert.equal((await request()).code, 502);
  } finally {
    delete globalThis.__blobTest;
    if (blobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN; else process.env.BLOB_READ_WRITE_TOKEN = blobToken;
  }
});

test('accepts the custom invitation date and place', async () => {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const invitation = { date: '2026-10-03', place: 'kebab', message: 'Abia aștept!' };
  let stored = '';
  try {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';
    globalThis.__blobTest = {
      get: async () => null,
      put: async (_path, content) => { stored = content; }
    };
    assert.equal((await request(invitation)).code, 200);
    assert.match(stored, /2026-10-03/);
    assert.match(stored, /Kebab/);
    assert.equal((await request({ date: '2026-09-28', place: 'cinema', message: '' })).code, 200);
    assert.match(stored, /2026-09-28/);
    assert.match(stored, /Cinema/);
    assert.equal((await request({ ...invitation, date: 'nu-este-o-data' })).code, 400);
  } finally {
    delete globalThis.__blobTest;
    if (blobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN; else process.env.BLOB_READ_WRITE_TOKEN = blobToken;
  }
});
