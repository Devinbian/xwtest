import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'vite';

test('静态部署生成独立路由入口、页面元数据及带前缀的站点地图', async () => {
  const previousBase = process.env.VITE_BASE_PATH;
  const previousOrigin = process.env.SITE_ORIGIN;
  process.env.VITE_BASE_PATH = '/catalog/';
  process.env.SITE_ORIGIN = 'https://example.com';
  try {
    const result = await build({ publicDir: false, logLevel: 'silent', build: { write: false } });
    const output = result.output;
    const pages = ['index.html', 'products/index.html', 'shop/index.html', 'about/index.html',
      'services/index.html', 'brands/index.html', 'contact/index.html'];
    const titles = new Set();
    for (const file of pages) {
      const html = output.find(asset => asset.fileName === file)?.source;
      assert.equal(typeof html, 'string', `Missing ${file}`);
      titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
      assert.match(html, /<meta name="description" content="[^"]+">/);
      assert.match(html, /src="\/catalog\/assets\/[^\"]+\.js"/);
    }
    assert.equal(titles.size, pages.length);
    const sitemap = output.find(asset => asset.fileName === 'sitemap.xml')?.source;
    assert.match(sitemap, /https:\/\/example.com\/catalog\/products\//);
    assert.equal((sitemap.match(/<loc>/g) ?? []).length, pages.length);
  } finally {
    if (previousBase === undefined) delete process.env.VITE_BASE_PATH;
    else process.env.VITE_BASE_PATH = previousBase;
    if (previousOrigin === undefined) delete process.env.SITE_ORIGIN;
    else process.env.SITE_ORIGIN = previousOrigin;
  }
});
