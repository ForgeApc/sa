/* ============================================================
   Polluted Hub — admin login endpoint
   Runs on the VPS. The password never reaches the Vercel site;
   the site posts a candidate here and gets back yes or no.

   Deploy:
     npm i express
     ADMIN_PASSWORD=92614 ALLOWED_ORIGIN=https://your-site.vercel.app \
       node login.js
   Put it behind your existing HTTPS reverse proxy (nginx/Caddy)
   so the browser talks to it over https://
   ============================================================ */
const express = require('express');
const crypto = require('crypto');

const PASSWORD = process.env.ADMIN_PASSWORD || '';
const ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const PORT = process.env.PORT || 8787;

if (!PASSWORD) {
  console.error('Refusing to start: set ADMIN_PASSWORD');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '4kb' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// crude per-IP throttle so the code can't be brute forced from a script
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { n: 0, until: 0 };
  if (rec.until > now) return true;
  rec.n += 1;
  if (rec.n > 8) { rec.until = now + 5 * 60 * 1000; rec.n = 0; }
  hits.set(ip, rec);
  return false;
}

// timing-safe compare so response time doesn't leak the code
function same(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  if (x.length !== y.length) return false;
  return crypto.timingSafeEqual(x, y);
}

app.post('/login', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?';
  if (throttled(ip)) return res.status(429).json({ ok: false });

  const given = (req.body && req.body.password) || '';
  if (!same(given, PASSWORD)) return res.status(401).json({ ok: false });

  res.json({ ok: true, token: crypto.randomBytes(24).toString('hex') });
});

app.listen(PORT, () => console.log('admin login listening on :' + PORT));
