import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = Number.parseInt(process.env.PORT ?? '5175', 10);
const DATA_FILE =
  process.env.HOT_PRODUCTS_FILE ??
  path.resolve(process.cwd(), 'data', 'hot-products.json');
const EDITOR_TOKEN = process.env.HOT_EDITOR_TOKEN ?? '';
const COOKIE_NAME = 'xw_hot_editor';
const COOKIE_MAX_AGE = Number.parseInt(process.env.HOT_EDITOR_COOKIE_MAX_AGE ?? '', 10) || 60 * 60 * 24 * 30; // 30d
const COOKIE_DOMAIN = (process.env.HOT_EDITOR_COOKIE_DOMAIN ?? '').trim() || null;
const COOKIE_SECURE =
  (process.env.HOT_EDITOR_COOKIE_SECURE ?? '').trim() === '1' ||
  (process.env.HOT_EDITOR_COOKIE_SECURE ?? '').trim().toLowerCase() === 'true';

const MAX_BODY_BYTES = 64 * 1024;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const loginAttempts = new Map();

const allowLoginAttempt = (address) => {
  const now = Date.now();
  for (const [key, entry] of loginAttempts) {
    if (entry.expiresAt <= now) loginAttempts.delete(key);
  }
  const entry = loginAttempts.get(address) ?? { count: 0, expiresAt: now + LOGIN_WINDOW_MS };
  if (entry.count >= 10 || (!loginAttempts.has(address) && loginAttempts.size >= 10000)) return false;
  entry.count += 1;
  loginAttempts.set(address, entry);
  return true;
};

const secureEqual = (left, right) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const json = (res, status, payload) => {
  const body = JSON.stringify(payload ?? {});
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(body);
};

const isHttpsRequest = (req) => {
  const xfProto = req.headers['x-forwarded-proto'];
  if (typeof xfProto === 'string' && xfProto.toLowerCase().includes('https')) return true;
  return false;
};

const setCookie = (req, res, value, maxAge = COOKIE_MAX_AGE) => {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.max(0, maxAge)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (COOKIE_DOMAIN) parts.push(`Domain=${COOKIE_DOMAIN}`);
  if (COOKIE_SECURE || isHttpsRequest(req)) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
};

const clearCookie = (req, res) => {
  setCookie(req, res, '', 0);
};

const parseCookies = (header) => {
  if (!header || typeof header !== 'string') return {};
  const out = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (!k) continue;
    try {
      out[k] = decodeURIComponent(rest.join('='));
    } catch {
      // 忽略格式错误的 Cookie，仍将请求视为未授权。
    }
  }
  return out;
};

const signSession = (payload) => {
  return crypto.createHmac('sha256', EDITOR_TOKEN).update(payload).digest('hex');
};

const createSession = () => {
  const payload = `${Date.now() + COOKIE_MAX_AGE * 1000}.${crypto.randomBytes(16).toString('hex')}`;
  return `${payload}.${signSession(payload)}`;
};

const isAuthorized = (req) => {
  if (!EDITOR_TOKEN) return false;

  // Header-based (optional, kept for flexibility)
  const headerToken = req.headers['x-hot-editor-token'];
  if (typeof headerToken === 'string' && secureEqual(headerToken.trim(), EDITOR_TOKEN)) {
    return true;
  }
  const auth = req.headers.authorization;
  if (typeof auth === 'string') {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m?.[1] && secureEqual(m[1].trim(), EDITOR_TOKEN)) return true;
  }

  // Cookie-based (recommended)
  const cookies = parseCookies(req.headers.cookie);
  const session = cookies[COOKIE_NAME];
  if (!session) return false;
  const [expiresAt, nonce, signature, extra] = session.split('.');
  if (extra !== undefined || !signature || !/^[a-f0-9]{32}$/.test(nonce ?? '')) return false;
  if (!Number.isSafeInteger(Number(expiresAt)) || Number(expiresAt) <= Date.now()) return false;
  return secureEqual(signature, signSession(`${expiresAt}.${nonce}`));
};

const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = [];
  let size = 0;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      chunks.length = 0;
      reject(Object.assign(new Error('payload_too_large'), { status: 413 }));
      return;
    }
    chunks.push(chunk);
  });
  req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  req.on('error', reject);
  req.on('aborted', () => reject(new Error('request_aborted')));
});

const ensureDir = async () => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
};

const readDataFile = async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { overrides: {}, updatedAt: null };
    const overrides =
      parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {};
    const disableAllHot = parsed.disableAllHot === true;
    const updatedAt =
      typeof parsed.updatedAt === 'string' && parsed.updatedAt ? parsed.updatedAt : null;
    return { overrides, disableAllHot, updatedAt };
  } catch {
    return { overrides: {}, disableAllHot: false, updatedAt: null };
  }
};

let writeQueue = Promise.resolve();
const writeDataFileAtomic = (data) => {
  const operation = writeQueue.then(async () => {
    await ensureDir();
    const tmp = `${DATA_FILE}.${crypto.randomUUID()}.tmp`;
    try {
      await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
      await fs.rename(tmp, DATA_FILE);
    } finally {
      await fs.rm(tmp, { force: true });
    }
  });
  writeQueue = operation.catch(() => {});
  return operation;
};

const validateOverrides = (candidate) => {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;

  const out = {};
  const ranks = new Set();
  for (const [key, value] of Object.entries(candidate)) {
    if (!/^[1-9]\d*$/.test(key) || !Number.isSafeInteger(Number(key))) return null;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    if (Object.keys(value).some(key => !['isHot', 'hotRank'].includes(key))) return null;

    const next = {};
    if ('isHot' in value && typeof value.isHot !== 'boolean') return null;
    if (typeof value.isHot === 'boolean') next.isHot = value.isHot;
    if ('hotRank' in value) {
      if (value.hotRank === null) next.hotRank = null;
      else {
        if (!Number.isInteger(value.hotRank) || value.hotRank < 1 || value.hotRank > 10) return null;
        if (value.isHot === false || ranks.has(value.hotRank)) return null;
        ranks.add(value.hotRank);
        next.hotRank = value.hotRank;
      }
    }

    if (Object.keys(next).length) out[String(key)] = next;
  }

  return out;
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/health') {
      return json(res, 200, { ok: true });
    }

    if (url.pathname === '/api/hot-products/session') {
      if (req.method === 'GET') {
        return json(res, 200, { authorized: isAuthorized(req) });
      }

      if (req.method === 'DELETE') {
        clearCookie(req, res);
        return json(res, 200, { ok: true });
      }

      if (req.method === 'POST') {
        if (!EDITOR_TOKEN) return json(res, 403, { error: 'server_token_not_configured' });
        const address = req.socket.remoteAddress ?? 'unknown';
        if (!allowLoginAttempt(address)) {
          res.setHeader('Retry-After', String(Math.ceil(LOGIN_WINDOW_MS / 1000)));
          return json(res, 429, { error: 'too_many_attempts' });
        }
        const raw = await readBody(req);
        let parsed;
        try {
          parsed = JSON.parse(raw || '{}');
        } catch {
          return json(res, 400, { error: 'invalid_json' });
        }
        const token = String(parsed?.token ?? '').trim();
        if (!token) return json(res, 400, { error: 'missing_token' });
        if (!secureEqual(token, EDITOR_TOKEN)) return json(res, 401, { error: 'unauthorized' });
        loginAttempts.delete(address);
        setCookie(req, res, createSession());
        return json(res, 200, { authorized: true });
      }

      return json(res, 405, { error: 'method_not_allowed' });
    }

    if (url.pathname !== '/api/hot-products') {
      return json(res, 404, { error: 'not_found' });
    }

    if (req.method === 'GET') {
      const data = await readDataFile();
      return json(res, 200, data);
    }

    if (req.method === 'PUT') {
      if (!EDITOR_TOKEN) return json(res, 403, { error: 'server_token_not_configured' });
      if (!isAuthorized(req)) return json(res, 401, { error: 'unauthorized' });

      const raw = await readBody(req);
      let parsed;
      try {
        parsed = JSON.parse(raw || '{}');
      } catch {
        return json(res, 400, { error: 'invalid_json' });
      }

      const overrides = validateOverrides(parsed?.overrides);
      if (!overrides) return json(res, 400, { error: 'invalid_payload' });
      if ('disableAllHot' in parsed && typeof parsed.disableAllHot !== 'boolean') {
        return json(res, 400, { error: 'invalid_payload' });
      }
      const disableAllHot = parsed?.disableAllHot === true;

      const next = { overrides, disableAllHot, updatedAt: new Date().toISOString() };
      await writeDataFileAtomic(next);
      return json(res, 200, next);
    }

    return json(res, 405, { error: 'method_not_allowed' });
  } catch (err) {
    if (err?.status === 413) return json(res, 413, { error: 'payload_too_large' });
    console.error('[hot-products] request failed:', err);
    return json(res, 500, { error: 'server_error' });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[hot-products] API listening on http://localhost:${server.address().port}`);
  // eslint-disable-next-line no-console
  console.log(`[hot-products] data file: ${DATA_FILE}`);
  // eslint-disable-next-line no-console
  console.log(`[hot-products] token: ${EDITOR_TOKEN ? 'configured' : 'missing'}`);
});
