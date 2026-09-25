import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import handler from './api/rsvp.js';
try { process.loadEnvFile(); } catch {}
const root = path.resolve('public');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/rsvp') {
      let body = ''; for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 8192) { res.writeHead(413); res.end(); return; } }
      req.body = body; res.status = code => { res.statusCode = code; return res; }; res.json = value => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(value)); };
      await handler(req, res); return;
    }
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
    const content = await readFile(file); res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(3000, '127.0.0.1', () => console.log('Deschide http://localhost:3000'));
