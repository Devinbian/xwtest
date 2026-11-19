import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite';

for (const base of ['/', '/xwtest/', '/catalog/']) {
  test(`图片占位路径兼容 ${base}`, async () => {
    const server = await createServer({
      configFile: false,
      base,
      server: { middlewareMode: true, watch: null, hmr: { server: createHttpServer() } },
    });
    try {
      const { generatePlaceholderUrl } = await server.ssrLoadModule('/src/utils/image.ts');
      assert.equal(generatePlaceholderUrl(`${base}images/a.jpg`), `${base}images/a-small.jpg`);
      assert.equal(generatePlaceholderUrl('/images/a.png?v=2#preview'), `${base}images/a-small.png?v=2#preview`);
      assert.equal(generatePlaceholderUrl('images/a.webp'), `${base}images/a-small.jpg`);
      assert.equal(generatePlaceholderUrl('https://cdn.example.com/a.jpg'), 'https://cdn.example.com/a.jpg');
      assert.equal(generatePlaceholderUrl('//cdn.example.com/a.jpg'), '//cdn.example.com/a.jpg');
      assert.equal(generatePlaceholderUrl('/images/a.svg'), `${base}images/a.svg`);
      assert.equal(generatePlaceholderUrl('/images/a.svg?fallback=b.jpg'), `${base}images/a.svg?fallback=b.jpg`);
    } finally {
      await server.close();
    }
  });
}
