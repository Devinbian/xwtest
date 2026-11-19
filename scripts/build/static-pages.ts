import type { Plugin } from 'vite';
import { pageTitle, sitePages } from '../../src/data/sitePages';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!));

// 生成真实目录入口，让静态托管服务能够直接打开 History 路由。
// 页面内容仍由 Vue 渲染，这里不声称提供 SSR/预渲染。
export const staticPages = (base: string, siteOrigin?: string): Plugin => ({
  name: 'static-route-pages',
  enforce: 'post',
  generateBundle(_, bundle) {
    const entry = bundle['index.html'];
    if (!entry || entry.type !== 'asset') throw new Error('Missing built index.html');
    const html = String(entry.source);
    for (const page of sitePages) {
      const source = html
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(pageTitle(page.title))}</title>`)
        .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(page.description)}">`);
      if (page.path === '/') entry.source = source;
      else this.emitFile({ type: 'asset', fileName: `${page.path.slice(1)}/index.html`, source });
    }
    if (siteOrigin) {
      const origin = new URL(siteOrigin);
      if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password
        || origin.pathname !== '/' || origin.search || origin.hash) {
        throw new Error('SITE_ORIGIN must be an HTTP(S) origin without a path or credentials');
      }
      const urls = sitePages.map(page => {
        const pathname = page.path === '/' ? base : `${base}${page.path.slice(1)}/`;
        return `<url><loc>${escapeHtml(new URL(pathname, origin).href)}</loc></url>`;
      });
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source:
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>\n` });
    }
  },
});
