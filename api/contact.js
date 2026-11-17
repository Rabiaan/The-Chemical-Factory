'use strict';

/**
 * THE CHEMICAL FACTORY — contact / quote form endpoint.
 *
 * Vercel Node.js serverless function. Accepts JSON only, re-validates every
 * field on the server, checks the honeypot, checks the request origin, applies
 * a basic per-IP rate limit, and sends the enquiry through Resend.
 *
 * Required environment variables (set them in Vercel, never in the repo):
 *   RESEND_API_KEY       Resend API key.
 *   CONTACT_TO_EMAIL     Business inbox that receives enquiries.
 *   CONTACT_FROM_EMAIL   Verified Resend sender, e.g.
 *                        "The Chemical Factory <website@thechemicalfactory.com>".
 *
 * Optional:
 *   SITE_URL / ALLOWED_ORIGINS  Extra allowed origins, comma separated.
 *                               Same-origin requests are allowed automatically.
 *
 * The response body is always only { ok: true } or { ok: false }.
 */

const MAX_BODY_BYTES = 16384;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 5;
const MAX_BUCKETS = 5000;
const HONEYPOT_FIELD = 'company-website';
const ALLOWED_FORMS = new Set(['contact', 'quote']);

const MAX = {
  name: 100,
  phone: 20,
  email: 254,
  subject: 200,
  message: 500,
  city: 120,
  areaType: 80,
  system: 80,
  sqft: 20,
  price: 40,
  symptoms: 500
};

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Per-instance rolling window. Vercel may run several instances, so this is
   deliberately described as basic abuse control rather than a hard quota. */
const rateBuckets = new Map();

function respond(res, status, ok) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify({ ok: !!ok }));
}

function clean(value, max) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  let out = String(value);
  out = out.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  out = out.replace(/[\r\n]+/g, ' ');
  out = out.trim();
  if (out.length > max) out = out.slice(0, max);
  return out;
}

function isValidEmail(value) {
  return value.length <= MAX.email && RE_EMAIL.test(value);
}

function clientIp(req) {
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) {
    return real.trim();
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    const parts = forwarded.split(',').map((part) => part.trim()).filter(Boolean);
    return parts[parts.length - 1] || 'unknown';
  }
  if (Array.isArray(forwarded) && forwarded.length) {
    const parts = String(forwarded[forwarded.length - 1]).split(',').map((part) => part.trim()).filter(Boolean);
    return parts[parts.length - 1] || 'unknown';
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const cutoff = now - RATE_WINDOW_MS;

  for (const [key, stamps] of rateBuckets) {
    const fresh = stamps.filter((stamp) => stamp > cutoff);
    if (fresh.length) rateBuckets.set(key, fresh);
    else rateBuckets.delete(key);
  }

  while (rateBuckets.size > MAX_BUCKETS) {
    const oldest = rateBuckets.keys().next().value;
    rateBuckets.delete(oldest);
  }

  const recent = (rateBuckets.get(ip) || []).filter((stamp) => stamp > cutoff);
  if (recent.length >= RATE_LIMIT) {
    rateBuckets.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(ip, recent);
  return false;
}

function normalizeHost(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw.includes('://') ? raw : 'https://' + raw);
    return url.hostname.toLowerCase();
  } catch (err) {
    return '';
  }
}

function isAllowedOrigin(req) {
  const raw = req.headers.origin || req.headers.referer;
  if (!raw || raw === 'null') return false;

  const originHost = normalizeHost(raw);
  if (!originHost) return false;

  const requestHostRaw = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0]
    .trim();
  const requestHost = normalizeHost(requestHostRaw);
  if (requestHost && originHost === requestHost) return true;

  const configured = String(process.env.ALLOWED_ORIGINS || process.env.SITE_URL || '')
    .split(',')
    .map((item) => normalizeHost(item))
    .filter(Boolean);

  return configured.includes(originHost);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body !== undefined) {
      if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        try {
          if (Buffer.byteLength(JSON.stringify(req.body)) > MAX_BODY_BYTES) {
            return reject(new Error('too_large'));
          }
        } catch (err) {
          return reject(new Error('bad_json'));
        }
        return resolve(req.body);
      }
      const raw = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body);
      if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return reject(new Error('too_large'));
      try {
        return resolve(JSON.parse(raw));
      } catch (err) {
        return reject(new Error('bad_json'));
      }
    }

    let size = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('too_large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!chunks.length) return reject(new Error('bad_json'));
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (err) {
        reject(new Error('bad_json'));
      }
    });

    req.on('error', reject);
  });
}

function buildMessage(data, formType) {
  const name = clean(data.name, MAX.name);
  const phone = clean(data.phone, MAX.phone);
  const email = clean(data.email, MAX.email);
  const subject = clean(data.subject, MAX.subject);
  const message = clean(data.message, MAX.message);

  const lines = [];
  let mailSubject;

  if (formType === 'quote') {
    lines.push('Quote request from thechemicalfactory.com', '');
    lines.push('Name: ' + name);
    lines.push('Phone: ' + phone);
    lines.push('Email: ' + (email || '(not provided)'));
    lines.push('City: ' + clean(data.city, MAX.city));
    lines.push('Area type: ' + clean(data.areaType, MAX.areaType));
    lines.push('System: ' + clean(data.system, MAX.system));
    lines.push('Estimated area: ' + clean(data.sqft, MAX.sqft));
    lines.push('Indicative range: ' + clean(data.price, MAX.price));
    lines.push('Observed symptoms: ' + clean(data.symptoms, MAX.symptoms));
    lines.push('', 'Project notes:', message || '(none)');
    mailSubject = 'Quote request: ' + (subject || 'General');
  } else {
    lines.push('Website enquiry from thechemicalfactory.com', '');
    lines.push('Name: ' + name);
    lines.push('Phone: ' + phone);
    lines.push('Email: ' + (email || '(not provided)'));
    lines.push('Subject: ' + (subject || 'General'));
    lines.push('', 'Project details:', message || '(none)');
    mailSubject = 'Website enquiry: ' + (subject || 'General');
  }

  return {
    subject: mailSubject,
    text: lines.join('\n') + '\n',
    replyTo: email && isValidEmail(email) ? email : ''
  };
}

async function sendWithResend(message) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error('missing_email_configuration');
  }

  const payload = {
    from,
    to: [to],
    subject: message.subject,
    text: message.text
  };
  if (message.replyTo) payload.reply_to = message.replyTo;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('email_delivery_failed');
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return respond(res, 405, false);
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    return respond(res, 415, false);
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return respond(res, 413, false);
  }

  let data;
  try {
    data = await readJsonBody(req);
  } catch (err) {
    return respond(res, err && err.message === 'too_large' ? 413 : 400, false);
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return respond(res, 400, false);
  }

  /* Honeypot: bots that fill every field get a quiet success and no email. */
  if (clean(data[HONEYPOT_FIELD], 200)) {
    return respond(res, 200, true);
  }

  if (!isAllowedOrigin(req)) {
    return respond(res, 403, false);
  }

  if (isRateLimited(clientIp(req))) {
    return respond(res, 429, false);
  }

  const formTypeRaw = clean(data.form, 20).toLowerCase();
  const formType = ALLOWED_FORMS.has(formTypeRaw) ? formTypeRaw : 'contact';

  const name = clean(data.name, MAX.name);
  const phone = clean(data.phone, MAX.phone);
  const email = clean(data.email, MAX.email);

  if (!name || !phone) {
    return respond(res, 422, false);
  }

  const phoneDigits = phone.replace(/[^0-9]/g, '');
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return respond(res, 422, false);
  }

  if (email && !isValidEmail(email)) {
    return respond(res, 422, false);
  }

  const message = buildMessage(data, formType);

  try {
    await sendWithResend(message);
    return respond(res, 200, true);
  } catch (err) {
    return respond(res, 502, false);
  }
};
