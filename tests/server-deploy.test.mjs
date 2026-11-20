import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, access, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = path.resolve('scripts/deploy/deploy-server.sh');
const revision = 'a'.repeat(40);

async function fixture(t, { failHealth = false, missingPage = false } = {}) {
  const root = await mkdtemp(path.join(tmpdir(), 'xwtest-deploy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const dir of ['xwtest/data', 'xwtest/assets', 'build/products', 'build/contact', 'bin']) {
    await mkdir(path.join(root, dir), { recursive: true });
  }
  const put = (file, content) => writeFile(path.join(root, file), content);
  await put('xwtest/index.html', 'previous homepage');
  await put('xwtest/data/hot-products.json', '{"keep":"runtime data"}');
  await put('xwtest/assets/previous.js', 'previous asset');
  await put('build/index.html', 'new homepage');
  await put('build/products/index.html', 'products');
  if (!missingPage) await put('build/contact/index.html', 'contact');
  await put('build/deploy-version.txt', `${revision}\n`);
  await put('bin/curl', `#!/usr/bin/env bash
if [[ "${failHealth}" == true ]]; then exit 22; fi
if [[ "$*" == *deploy-version.txt* ]]; then printf '%s\\n' '${revision}'; fi
`);
  await chmod(path.join(root, 'bin/curl'), 0o755);
  const archive = path.join(root, 'site.tar.gz');
  assert.equal(spawnSync('tar', ['-czf', archive, '-C', path.join(root, 'build'), '.']).status, 0);
  const result = spawnSync('bash', [script, archive, '123-1', revision], {
    encoding: 'utf8',
    env: { ...process.env, DEPLOY_ROOT: root, PATH: `${root}/bin:${process.env.PATH}` },
  });
  return { root, result, read: file => readFile(path.join(root, file), 'utf8') };
}

test('服务器发布保留运行时热门数据及旧资源，并备份旧前端', async t => {
  const { result, read } = await fixture(t);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(await read('xwtest/index.html'), 'new homepage');
  assert.equal(await read('xwtest/data/hot-products.json'), '{"keep":"runtime data"}');
  assert.equal(await read('xwtest/assets/previous.js'), 'previous asset');
  assert.equal(await read('xwtest-backups/123-1/index.html'), 'previous homepage');
  assert.equal(await read('xwtest/deploy-version.txt'), `${revision}\n`);
});

test('线上检查失败时恢复旧首页，不覆盖热门数据', async t => {
  const { root, result, read } = await fixture(t, { failHealth: true });
  assert.equal(result.status, 22, result.stderr);
  assert.match(result.stderr, /restoring frontend/);
  assert.equal(await read('xwtest/index.html'), 'previous homepage');
  assert.equal(await read('xwtest/data/hot-products.json'), '{"keep":"runtime data"}');
  await assert.rejects(access(path.join(root, 'xwtest/deploy-version.txt')));
});

test('缺少核心页面的产物在修改线上文件前被拒绝', async t => {
  const { root, result, read } = await fixture(t, { missingPage: true });
  assert.notEqual(result.status, 0);
  assert.equal(await read('xwtest/index.html'), 'previous homepage');
  await assert.rejects(access(path.join(root, 'xwtest-backups/123-1')));
});
