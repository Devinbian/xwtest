import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import crypto from 'node:crypto';

test('热门配置 API 授权、输入边界和并发写入', { timeout: 20000 }, async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'xw-hot-test-'));
  const file = path.join(dir, 'hot-products.json');
  const token = crypto.randomBytes(24).toString('hex');
  const child = spawn(process.execPath, ['server/hot-products-server.mjs'], {
    env: { ...process.env, PORT: '0', HOT_EDITOR_TOKEN: token, HOT_PRODUCTS_FILE: file,
      HOT_EDITOR_COOKIE_DOMAIN: '', HOT_EDITOR_COOKIE_SECURE: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    const base = await new Promise((resolve, reject) => {
      let output = '';
      const timer = setTimeout(() => reject(new Error('API startup timed out')), 5000);
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(`http://localhost:${match[1]}`); }
      });
      child.once('error', error => { clearTimeout(timer); reject(error); });
      child.once('exit', code => { clearTimeout(timer); reject(new Error(`API exited: ${code}`)); });
    });
    const request = async (route, options = {}) => {
      const response = await fetch(`${base}/api/hot-products${route}`, options);
      const body = await response.json();
      return { status: response.status, headers: response.headers, body };
    };
    const put = (body, cookie) => request('', {
      method: 'PUT', headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    const login = value => request('/session', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: value }),
    });

    assert.equal((await put({ overrides: {} })).status, 401);
    assert.equal((await login('incorrect')).status, 401);
    const session = await login(token);
    assert.equal(session.status, 200);
    assert.match(session.headers.get('set-cookie'), /HttpOnly/);
    const cookie = session.headers.get('set-cookie').split(';')[0];
    assert.equal((await request('/session', { headers: { cookie } })).body.authorized, true);
    assert.equal((await request('/session', { headers: { cookie: 'xw_hot_editor=%invalid' } })).body.authorized, false);

    // 即使签名有效，服务端也应拒绝过期会话。
    const payload = `${Date.now() - 1000}.${crypto.randomBytes(16).toString('hex')}`;
    const signature = crypto.createHmac('sha256', token).update(payload).digest('hex');
    assert.equal((await request('/session', { headers: { cookie: `xw_hot_editor=${payload}.${signature}` } })).body.authorized, false);

    const valid = { overrides: { 1: { isHot: true, hotRank: 1 }, 2: { hotRank: null } }, disableAllHot: false };
    assert.equal((await put(valid, cookie)).status, 200);
    for (const overrides of [[], { 1: { hotRank: 0 } }, { 1: { hotRank: 11 } },
      { 1: { hotRank: 1.5 } }, { 1: { isHot: 'yes' } }, { 1: { hotRank: 1 }, 2: { hotRank: 1 } }]) {
      assert.equal((await put({ overrides }, cookie)).status, 400);
    }
    assert.equal((await put({ overrides: {}, disableAllHot: 'false' }, cookie)).status, 400);
    assert.equal((await put('{invalid', cookie)).status, 400);
    assert.equal((await put('x'.repeat(65537), cookie)).status, 413);
    assert.deepEqual((await request('')).body.overrides, valid.overrides);

    const writes = Array.from({ length: 20 }, (_, i) => ({ overrides: { [i + 1]: { isHot: true } }, disableAllHot: false }));
    const results = await Promise.all(writes.map(body => put(body, cookie)));
    assert.ok(results.every(result => result.status === 200));
    const saved = JSON.parse(await readFile(file, 'utf8'));
    assert.ok(writes.some(body => JSON.stringify(body.overrides) === JSON.stringify(saved.overrides)));
    assert.deepEqual(await readdir(dir), ['hot-products.json']);

    assert.equal((await request('/session', { method: 'DELETE', headers: { cookie } })).status, 200);
    for (let i = 0; i < 10; i++) assert.equal((await login('incorrect')).status, 401);
    const limited = await login('incorrect');
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.has('retry-after'));
  } finally {
    if (child.exitCode === null) {
      const exited = once(child, 'exit');
      child.kill();
      await exited;
    }
    await rm(dir, { recursive: true, force: true });
  }
});
