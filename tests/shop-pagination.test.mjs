import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite';
import { createRenderer, ssrContextKey } from 'vue';

test('Shop 使用完整目录，支持翻页和筛选后重置页码', async () => {
  const server = await createServer({
    server: { middlewareMode: true, watch: null, hmr: { server: createHttpServer() } },
  });
  let app;
  try {
    const { default: Shop } = await server.ssrLoadModule('/src/views/Shop.vue');
    const { products } = await server.ssrLoadModule('/src/data/products/products.js');
    // 挂载真实 setup 和响应式状态；本测试不验证 DOM 或视觉布局。
    const renderer = createRenderer({
      createComment: () => ({}), insert() {}, remove() {}, parentNode: () => null,
      nextSibling: () => null, createElement: () => ({}), createText: () => ({}),
      setText() {}, setElementText() {}, patchProp() {},
    });
    let state;
    app = renderer.createApp({
      ...Shop,
      setup(props, context) {
        state = Shop.setup(props, context);
        return state;
      },
      render: () => null,
    });
    app.provide(ssrContextKey, { modules: new Set() });
    app.mount({});
    assert.equal(state.matchingProducts.value.length, products.length);
    assert.equal(state.totalPages.value, Math.ceil(products.length / 12));
    assert.equal(state.filteredProducts.value.length, 12);
    const firstIds = state.filteredProducts.value.map(product => product.id);
    state.changePage(2);
    assert.equal(state.currentPage.value, 2);
    assert.ok(state.filteredProducts.value.every(product => !firstIds.includes(product.id)));
    state.changePage(999);
    assert.equal(state.currentPage.value, state.totalPages.value);
    assert.equal(state.filteredProducts.value.length, products.length % 12 || 12);
    state.searchQuery.value = '  ADCMT  ';
    assert.equal(state.currentPage.value, 1);
    assert.ok(state.filteredProducts.value.length > 0);
    assert.ok(state.filteredProducts.value.every(product => product.brand === 'ADCMT'));
    state.searchQuery.value = '';
    state.changePage(2);
    state.selectCategory(1);
    assert.equal(state.currentPage.value, 1);
    assert.ok(state.filteredProducts.value.every(product => product.categoryId === 1));
    state.searchQuery.value = 'no-such-product-123456';
    assert.equal(state.totalPages.value, 0);
    assert.deepEqual(state.filteredProducts.value, []);
  } finally {
    app?.unmount();
    await server.close();
  }
});
