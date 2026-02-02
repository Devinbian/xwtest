import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const PORT = Number.parseInt(process.env.PORT ?? '', 10) || 5175;
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
    out[k] = decodeURIComponent(rest.join('=') ?? '');
  }
  return out;
};

const signatureForToken = (token) => {
  return crypto.createHmac('sha256', token).update('xw-hot-editor').digest('hex');
};

const isAuthorized = (req) => {
  if (!EDITOR_TOKEN) return false;

  // Header-based (optional, kept for flexibility)
  const headerToken = req.headers['x-hot-editor-token'];
  if (typeof headerToken === 'string' && headerToken.trim() && headerToken.trim() === EDITOR_TOKEN) {
    return true;
  }
  const auth = req.headers.authorization;
  if (typeof auth === 'string') {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m?.[1] && m[1].trim() === EDITOR_TOKEN) return true;
  }

  // Cookie-based (recommended)
  const cookies = parseCookies(req.headers.cookie);
  const sig = cookies[COOKIE_NAME];
  if (!sig) return false;
  return sig === signatureForToken(EDITOR_TOKEN);
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw;
};

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

const writeDataFileAtomic = async (data) => {
  await ensureDir();
  const tmp = `${DATA_FILE}.tmp`;
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(tmp, payload, 'utf8');
  await fs.rename(tmp, DATA_FILE);
};

const validateOverrides = (candidate) => {
  if (!candidate || typeof candidate !== 'object') return null;

  const out = {};
  for (const [key, value] of Object.entries(candidate)) {
    if (!/^\d+$/.test(String(key))) continue;
    if (!value || typeof value !== 'object') continue;

    const next = {};
    if (typeof value.isHot === 'boolean') next.isHot = value.isHot;
    if (typeof value.hotRank === 'number' && Number.isFinite(value.hotRank)) {
      next.hotRank = Math.trunc(value.hotRank);
    } else if (value.hotRank === null) {
      next.hotRank = null;
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
        const raw = await readBody(req);
        let parsed;
        try {
          parsed = JSON.parse(raw || '{}');
        } catch {
          return json(res, 400, { error: 'invalid_json' });
        }
        const token = String(parsed?.token ?? '').trim();
        if (!token) return json(res, 400, { error: 'missing_token' });
        if (token !== EDITOR_TOKEN) return json(res, 401, { error: 'unauthorized' });
        setCookie(req, res, signatureForToken(EDITOR_TOKEN));
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
      const disableAllHot = parsed?.disableAllHot === true;

      const next = { overrides, disableAllHot, updatedAt: new Date().toISOString() };
      await writeDataFileAtomic(next);
      return json(res, 200, next);
    }

    return json(res, 405, { error: 'method_not_allowed' });
  } catch (err) {
    return json(res, 500, { error: 'server_error', message: String(err?.message ?? err) });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[hot-products] API listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[hot-products] data file: ${DATA_FILE}`);
  // eslint-disable-next-line no-console
  console.log(`[hot-products] token: ${EDITOR_TOKEN ? 'configured' : 'missing'}`);
});
