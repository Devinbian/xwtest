<template>
  <div>
    <div class="products-page">
      <!-- PC端左侧分类菜单 -->
      <aside v-if="!isMobile" ref="desktopCategoriesMenuEl" class="categories-menu">
        <div class="filter-content">
          <div class="filters-sticky">
            <div ref="desktopBrandPickerRoot" class="filters-toolbar">
              <div class="toolbar-top">
                <!-- 产品类型选择器 -->
                <div class="product-type-selector">
                  <button
                    type="button"
                    class="type-btn"
                    :class="{ active: route.query.type === 'new' }"
                    :aria-pressed="route.query.type === 'new'"
                    @click="toggleProductType('new')"
                  >
                    产品
                  </button>
                  <button
                    type="button"
                    class="type-btn"
                    :class="{ active: route.query.type === 'used' }"
                    :aria-pressed="route.query.type === 'used'"
                    @click="toggleProductType('used')"
                  >
                    中古品
                  </button>
                </div>

                <!-- 快速添加品牌（点击放大镜弹出） -->
                <div class="brand-quick-pop">
                  <button
                    type="button"
                    class="facet-icon brand-quick-trigger"
                    title="添加品牌"
                    :aria-expanded="desktopBrandPickerOpen"
                    @click="toggleDesktopBrandPicker"
                  >
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <span class="sr-only">添加品牌</span>
                  </button>
                </div>
              </div>

              <div
                v-if="desktopBrandPickerOpen"
                class="brand-quick-panel"
                role="dialog"
                aria-label="添加品牌"
                @click.stop
              >
                <div class="brand-quick-input">
                  <i class="fas fa-search" aria-hidden="true"></i>
                  <input
                    ref="desktopBrandPickerInput"
                    v-model="desktopBrandQuery"
                    type="search"
                    inputmode="search"
                    placeholder="输入品牌（支持英文/缩写）"
                    @keydown.escape="closeDesktopBrandPicker"
                  />
                  <button
                    v-if="desktopBrandQuery.trim()"
                    type="button"
                    class="brand-quick-clear"
                    aria-label="清除品牌搜索"
                    @click="desktopBrandQuery = ''"
                  >
                    <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>

                <div v-if="desktopBrandSuggestions.length" class="brand-quick-suggest">
                  <button
                    v-for="suggestion in desktopBrandSuggestions"
                    :key="suggestion.key"
                    type="button"
                    class="suggest-item"
                    @click="applyDesktopBrandSuggestion(suggestion)"
                  >
                    <span class="suggest-brand">{{ suggestion.brand }}</span>
                    <span class="suggest-scope">{{ suggestion.scopeLabel }}</span>
                  </button>
                </div>
                <div v-else class="brand-quick-empty">
                  输入关键字以搜索品牌
                </div>
              </div>
            </div>
          </div>

          <!-- 分类分面筛选（可同时展开多个） -->
          <div class="facets">
            <div
              v-for="category in desktopVisibleCategories"
              :key="category.id"
              class="facet"
              :class="{ selected: isCategorySelected(category.id) }"
            >
              <div class="facet-head">
                <button
                  type="button"
                  class="facet-select"
                  :class="{ active: isCategorySelected(category.id) }"
                  :aria-pressed="isCategorySelected(category.id)"
                  :title="isCategorySelected(category.id) ? '取消筛选该分类' : '筛选该分类'"
                  @click.stop="toggleCategory(category.id)"
                >
                  <i
                    :class="[
                      'fas',
                      isCategorySelected(category.id) ? 'fa-check' : 'fa-plus',
                    ]"
                    aria-hidden="true"
                  ></i>
                  <span class="sr-only">筛选该分类</span>
                </button>
                <button
                  type="button"
                  class="facet-toggle"
                  :aria-expanded="isCategoryExpanded(category.id)"
                  @click="toggleCategoryExpanded(category.id)"
                >
                  <span class="facet-title">{{ category.name }}</span>
                  <span v-if="selectedBrandCountByCategory(category.id) > 0" class="facet-badge">
                    已选{{ selectedBrandCountByCategory(category.id) }}
                  </span>
                </button>
                <button
                  v-if="selectedBrandCountByCategory(category.id) > 0 || isCategorySelected(category.id)"
                  type="button"
                  class="facet-clear"
                  title="清空该分类筛选"
                  aria-label="清空该分类筛选"
                  @click.stop="clearCategoryFilters(category.id)"
                >
                  <i class="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>

              <div v-show="isCategoryExpanded(category.id)" class="facet-body">
                <div class="brand-chips">
                  <button
                    v-for="brand in desktopBrandsForCategory(category)"
                    :key="brand"
                    type="button"
                    class="brand-chip"
                    :class="{ active: isBrandSelected(category.id, brand) }"
                    :aria-pressed="isBrandSelected(category.id, brand)"
                    @click="toggleBrand(category.id, brand)"
                  >
                    {{ brand }}
                  </button>
                </div>

                <button
                  v-if="category.brands.length > DESKTOP_BRAND_PREVIEW_LIMIT"
                  type="button"
                  class="facet-more"
                  @click="toggleDesktopShowAllBrands(category.id)"
                >
                  {{ desktopShowAllBrands[category.id] ? '收起品牌' : `更多品牌（共${category.brands.length}个）` }}
                  <i
                    :class="[
                      'fas',
                      desktopShowAllBrands[category.id] ? 'fa-chevron-up' : 'fa-chevron-down',
                    ]"
                    aria-hidden="true"
                  ></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 移动端筛选按钮和菜单 -->
      <div v-if="isMobile" class="mobile-filter">
        <!-- 遮罩层 -->
        <div class="menu-overlay" :class="{ active: showFilter }" @click="closeMobileFilter"></div>

        <!-- 全屏筛选菜单 -->
        <div class="filter-menu" :class="{ active: showFilter }">
          <div class="menu-header">
            <h3>筛选条件</h3>
            <button v-if="activeFiltersCount > 0" class="clear-filters-btn" @click="clearFilters">
              <i class="fas fa-times"></i>
              清除筛选
            </button>
            <button class="close-btn" @click="closeMobileFilter">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="menu-content">
            <div class="filter-group">
              <h3>产品类型</h3>
              <div class="filter-options">
                <button
                  type="button"
                  class="option-btn"
                  :class="{ active: route.query.type === 'new' }"
                  :aria-pressed="route.query.type === 'new'"
                  @click="toggleProductType('new')"
                >
                  产品
                </button>
                <button
                  type="button"
                  class="option-btn"
                  :class="{ active: route.query.type === 'used' }"
                  :aria-pressed="route.query.type === 'used'"
                  @click="toggleProductType('used')"
                >
                  中古品
                </button>
              </div>
            </div>

            <div v-for="category in categories" :key="category.id" class="filter-group">
              <div class="section-title">{{ category.name }}</div>
              <div class="brand-list">
                <button
                  v-for="brand in category.brands"
                  :key="brand"
                  type="button"
                  class="brand-item"
                  :class="{ active: isBrandSelected(category.id, brand) }"
                  :aria-pressed="isBrandSelected(category.id, brand)"
                  @click="toggleBrand(category.id, brand)"
                >
                  <span>{{ brand }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧产品列表 -->
      <main class="products-content">
        <div class="products-topbar" :class="{ compact: topbarCompact }" aria-label="筛选栏">
          <div class="topbar-main">
            <h2 class="page-title">{{ currentCategory?.name || '全部产品' }}</h2>

            <div class="topbar-actions">
              <div class="search-box" role="search" aria-label="搜索产品">
                <i class="fas fa-search search-icon" aria-hidden="true"></i>
                <input
                  v-model="searchQuery"
                  class="search-input"
                  type="search"
                  inputmode="search"
                  placeholder="搜索产品 / 型号 / 品牌"
                  @input="onSearchInput"
                  @keydown.enter.prevent="commitSearch()"
                />
                <button
                  type="button"
                  class="hot-pill"
                  :aria-pressed="hotOnly"
                  title="热门"
                  @click.stop="toggleHotOnly"
                >
                  <i class="fas fa-fire" aria-hidden="true"></i>
                  <span class="pill-text">热门</span>
                </button>
                <button
                  v-if="isMobile"
                  type="button"
                  class="filter-pill"
                  :aria-label="activeFiltersCount > 0 ? `打开筛选（已选${activeFiltersCount}项）` : '打开筛选'"
                  @click.stop="openMobileFilter"
                >
                  <i class="fas fa-sliders-h" aria-hidden="true"></i>
                  <span v-if="activeFiltersCount > 0" class="pill-count" aria-hidden="true">
                    {{ activeFiltersCount }}
                  </span>
                </button>
                <button
                  v-if="searchQuery.trim()"
                  type="button"
                  class="clear-search"
                  aria-label="清除搜索"
                  @click="clearSearch"
                >
                  <i class="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>

              <div v-if="hotEditorUnlocked" class="hot-editor-gate" @click.stop>
                <button
                  v-if="!hotEditorEnabled"
                  type="button"
                  class="hot-admin-enter"
                  :disabled="isSavingHotOverrides"
                  @click.stop="enterHotEdit"
                >
                  <i class="fas fa-lock" aria-hidden="true"></i>
                  编辑热门
                </button>
                <div v-else class="hot-admin-editing">
                  <details ref="hotAdminMenu" class="hot-admin-menu">
                    <summary class="hot-admin-actions">
                      操作
                      <i class="fas fa-chevron-down" aria-hidden="true"></i>
                    </summary>
                    <div class="hot-admin-popover" @click.stop>
                      <button
                        type="button"
                        class="hot-admin-item"
                        :disabled="isSavingHotOverrides"
                        @click.stop="restoreDefaultHot"
                      >
                        恢复默认
                      </button>
                      <button
                        type="button"
                        class="hot-admin-item danger"
                        :disabled="isSavingHotOverrides"
                        @click.stop="clearAllHot"
                      >
                        清空热门
                      </button>
                    </div>
                  </details>

                  <button
                    type="button"
                    class="hot-admin-done"
                    :disabled="isSavingHotOverrides"
                    @click.stop="exitHotEdit"
                  >
                    <i class="fas fa-check" aria-hidden="true"></i>
                    完成
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filterChips.length > 0" class="topbar-chips" aria-label="已选筛选项">
            <div v-if="!topbarCompact" class="chips" :class="{ collapsed: !chipsExpanded }">
              <button
                v-for="chip in displayedFilterChips"
                :key="chip.key"
                type="button"
                class="chip"
                :title="chip.title || chip.label"
                @click.stop="chip.remove()"
              >
                <span class="chip-label">{{ chip.label }}</span>
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
            <div class="chips-actions">
              <button
                v-if="!topbarCompact && hiddenFilterChipCount > 0"
                type="button"
                class="chips-more"
                :aria-expanded="chipsExpanded"
                @click.stop="toggleChipsExpanded"
              >
                {{ chipsExpanded ? '收起' : `+${hiddenFilterChipCount}` }}
              </button>
              <div v-if="topbarCompact" class="chips-compact-count" aria-hidden="true">
                已选{{ filterChips.length }}项
              </div>
              <button
                type="button"
                class="chips-clear-icon"
                aria-label="清空筛选"
                title="清空筛选"
                @click.stop="clearFilters"
              >
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

	        <div v-if="filteredProducts.length === 0" class="empty-products">
	          <div class="empty-card">
	            <div class="empty-icon" aria-hidden="true">
	              <i class="fas fa-search"></i>
            </div>
	            <h3>未找到产品</h3>
	            <p class="empty-desc">当前筛选条件下暂无匹配结果，可尝试清除筛选或直接咨询客服获取推荐。</p>

	            <div v-if="filterChips.length > 0" class="active-tags" aria-label="当前筛选条件">
	              <button
	                v-for="chip in filterChips"
	                :key="chip.key"
	                type="button"
	                class="tag-chip"
	                :title="chip.title || chip.label"
	                @click.stop="chip.remove()"
	              >
	                {{ chip.label }}
	                <i class="fas fa-times" aria-hidden="true"></i>
	              </button>
	            </div>

	            <div class="empty-actions">
	              <button type="button" class="empty-btn secondary" @click="clearFiltersAndClose">
	                <i class="fas fa-times"></i>
                清除筛选
              </button>
              <button type="button" class="empty-btn primary" @click="openQuoteDialog()">
                <i class="fas fa-comments"></i>
                立即咨询
              </button>
            </div>
          </div>
        </div>

	        <div v-else class="products-grid">
	          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
            <div class="condition-tag" :class="product.condition">
              {{ getConditionText(product.condition) }}
            </div>
            <div class="image-wrapper">
              <div v-if="product.isHot || typeof product.hotRank === 'number'" class="hot-tag" aria-label="热门产品">
                <i class="fas fa-fire" aria-hidden="true"></i>
                <span>热门</span>
                <span v-if="typeof product.hotRank === 'number'" class="hot-rank">#{{ product.hotRank }}</span>
              </div>

              <div v-if="hotEditorEnabled && hotEditorAuthorized" class="hot-editor-card" @click.stop>
                <label class="hot-editor-switch" @click.stop>
                  <input
                    type="checkbox"
                    :checked="!!product.isHot"
                    :disabled="isSavingHotOverrides"
                    @change="(e) => setProductHot(product.id, (e.target as HTMLInputElement).checked)"
                  />
                  <span class="switch-ui" aria-hidden="true"></span>
                  <span class="switch-label">热门</span>
                </label>
                <input
                  class="hot-rank-input"
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  inputmode="numeric"
                  :value="typeof product.hotRank === 'number' ? product.hotRank : ''"
                  :disabled="isSavingHotOverrides || !product.isHot"
                  placeholder="#"
                  @input.stop="(e) => setProductHotRank(product.id, (e.target as HTMLInputElement).value)"
                />
              </div>

	              <LazyPicture :src="product.image" :alt="product.name"
	                :placeholder="generatePlaceholderUrl(product.image)" />
            </div>
            <div class="product-info">
	              <h3 :title="product.name">{{ product.name }}</h3>
              <p>{{ product.description }}</p>
	              <div class="specs-row" v-if="product.specs?.length">
	                <div
	                  class="specs-list"
	                  :id="`specs-${product.id}`"
	                  :class="{ expanded: isSpecsExpanded(product.id) }"
	                >
		                  <span
		                    v-for="(spec, index) in product.specs"
		                    :key="index"
		                    class="spec-tag"
		                    v-show="isSpecsExpanded(product.id) || index < 3"
		                  >
                        <template
                          v-for="(part, partIndex) in formatSpecParts(spec)"
                          :key="`${index}-${partIndex}`"
                        >
                          <sup v-if="part.sup">{{ part.text }}</sup>
                          <template v-else>{{ part.text }}</template>
                        </template>
                      </span>
		                </div>
	                <button
	                  v-if="product.specs.length > 3"
	                  type="button"
	                  class="specs-more-btn"
	                  :aria-controls="`specs-${product.id}`"
	                  :aria-expanded="isSpecsExpanded(product.id)"
	                  @click.stop="toggleSpecsExpanded(product.id)"
	                >
	                  {{ isSpecsExpanded(product.id) ? '收起' : `更多+${product.specs.length - 3}` }}
	                </button>
	              </div>
	              <div class="consult-hints" aria-label="咨询获取信息">
	                <span class="hint-label">咨询获取：</span>
	                <span class="hint-item">价格</span>
	                <span class="hint-item">交期</span>
	                <span class="hint-item">质保</span>
	                <span class="hint-item">是否现货</span>
	                <span class="hint-item">服务承诺</span>
	              </div>
	              <div class="product-brand">
	                {{ product.brandDisplay }}
	              </div>
	              <div class="card-actions">
                <a :href="product.link" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="view-details-btn"
                   @click.stop>
                  <span>查看详情</span>
                  <i class="fas fa-external-link-alt"></i>
                </a>
	                <button class="quote-btn" 
	                        @click.stop="openQuoteDialog(product)">
	                  <span>立即咨询</span>
	                  <i class="fas fa-comments"></i>
	                </button>
	              </div>
	            </div>
	          </div>
        </div>
      </main>
    </div>

	    <!-- 添加报价对话框 -->
		    <QuoteDialog 
		      :show="showQuoteDialog"
		      :product="selectedProduct ?? undefined"
		      :contextText="consultContextText"
		      @close="closeQuoteDialog"
		    />
	  </div>
	</template>

<script setup lang="ts">
	import { useRoute, useRouter } from 'vue-router';
	import { getAssetUrl } from '@/utils/assets';
	import { generatePlaceholderUrl } from '@/utils/image';
	import LazyPicture from '@/components/LazyPicture.vue';
	import QuoteDialog from '@/components/QuoteDialog.vue';
  import {
    DESKTOP_BRAND_PREVIEW_LIMIT,
    useDesktopBrandFacetsState,
  } from '@/composables/products/useDesktopBrandFacetsState';
  import { useHotEditorState } from '@/composables/products/useHotEditorState';
  import { useProductsFilterBarState } from '@/composables/products/useProductsFilterBarState';
  import { useProductsPresentationState } from '@/composables/products/useProductsPresentationState';
  import { useProductsPageLifecycle } from '@/composables/products/useProductsPageLifecycle';
  import { useProductsViewportState } from '@/composables/products/useProductsViewportState';

// 导入数据
// @ts-ignore
import { categories } from '@/data/products/categories.js';
// @ts-ignore
import { products } from '@/data/products/products.js';

// 定义类型接口
interface Category {
  id: number;
  name: string;
  brands: string[];
}

interface Product {
  id: number;
  name: string;
  brand: string;
  brandDisplay: string;
  type: string;
  categoryId: number;
  image: string;
  description: string;
  specs: string[];
  condition: string;
  isNew?: boolean;
  isHot?: boolean;
  hotRank?: number;
  link?: string;
}

// 类型断言
const typedCategories = categories as Category[];
const typedProducts = products as Product[];

const route = useRoute();
const router = useRouter();

const {
  hotEditorUnlocked,
  hotEditorEnabled,
  isSavingHotOverrides,
  hotEditorAuthorized,
  hotAdminMenu,
  productsWithHot,
  enterHotEdit,
  exitHotEdit,
  restoreDefaultHot,
  clearAllHot,
  setProductHot,
  setProductHotRank,
  initializeHotEditor,
} = useHotEditorState({
  typedProducts,
  route,
  router,
});

const {
  isMobile,
  showFilter,
  initializeViewportState,
  cleanupViewportState,
} = useProductsViewportState();

const {
  selectedCategories,
  selectedBrands,
  selectedNewProduct,
  searchQuery,
  hotOnly,
  currentCategory,
  filteredProducts,
  activeFiltersCount,
  isCategorySelected,
  isBrandSelected,
  toggleCategory,
  toggleBrand,
  toggleProductType,
  clearFilters,
  clearSearch,
  commitSearch,
  onSearchInput,
  toggleHotOnly,
  updateQueryParams,
  normalizeSelectedBrands,
  filterChips,
  chipsExpanded,
  displayedFilterChips,
  hiddenFilterChipCount,
  topbarCompact,
  onTopbarScroll,
  initializeTopbarScroll,
  cleanupTopbarScroll,
  getTypeLabel,
  openMobileFilter,
  closeMobileFilter,
  clearFiltersAndClose,
  toggleChipsExpanded,
} = useProductsFilterBarState({
  typedCategories,
  typedProducts,
  productsWithHot,
  route,
  router,
  hotEditorUnlocked,
  isMobile,
  showFilter,
});

const {
  desktopBrandQuery,
  desktopOnlyShowSelected,
  desktopShowAllBrands,
  desktopBrandPickerOpen,
  desktopBrandPickerRoot,
  desktopBrandPickerInput,
  desktopCategoriesMenuEl,
  desktopBrandSuggestions,
  isCategoryExpanded,
  toggleCategoryExpanded,
  selectedBrandCountByCategory,
  clearCategoryFilters,
  desktopVisibleCategories,
  seedDesktopExpandedCategories,
  desktopBrandsForCategory,
  toggleDesktopShowAllBrands,
  applyDesktopBrandSuggestion,
  closeDesktopBrandPicker,
  toggleDesktopBrandPicker,
  handleDesktopBrandPickerDismiss,
  handleDesktopMenuWheel,
} = useDesktopBrandFacetsState({
  typedCategories,
  selectedCategories,
  selectedBrands,
  selectedNewProduct,
  normalizeSelectedBrands,
  updateQueryParams,
  isBrandSelected,
  toggleBrand,
  isMobile,
});

const {
  getConditionText,
  formatSpecParts,
  isSpecsExpanded,
  toggleSpecsExpanded,
  showQuoteDialog,
  selectedProduct,
  consultContextText,
  openQuoteDialog,
  closeQuoteDialog,
} = useProductsPresentationState({
  route,
  typedCategories,
  selectedCategories,
  selectedBrands,
  filteredProducts,
  getTypeLabel,
});

useProductsPageLifecycle({
  initializeViewportState,
  cleanupViewportState,
  seedDesktopExpandedCategories,
  desktopCategoriesMenuEl,
  handleDesktopBrandPickerDismiss,
  handleDesktopMenuWheel,
  initializeHotEditor,
  initializeTopbarScroll,
  onTopbarScroll,
  cleanupTopbarScroll,
  filteredProducts,
});

// 检查分类是否处于激活状态
const isCategoryActive = isCategorySelected;
</script>

<style lang="scss" scoped src="../../styles/views/products.scss"></style>
