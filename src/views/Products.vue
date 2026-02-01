<template>
  <div>
    <div class="products-page">
      <!-- PC端左侧分类菜单 -->
      <aside v-if="!isMobile" class="categories-menu">
        <div class="filter-content">
          <!-- 添加筛选状态提示 -->
          <div class="filter-status" v-if="activeFiltersCount > 0">
            <span class="status-text">已选{{ activeFiltersCount }}项</span>
            <button class="clear-all-btn" @click="clearFilters">
              <i class="fas fa-times"></i>
              清除全部
            </button>
          </div>

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

          <!-- 分类列表 -->
          <div class="category-group">
            <div v-for="category in categories" :key="category.id" class="category-item">
              <button
                type="button"
                class="category-header"
                :aria-expanded="isCategoryActive(category.id)"
                @click="toggleCategory(category.id)"
              >
                <span>{{ category.name }}</span>
                <i :class="['fas', isCategoryActive(category.id) ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
              <div class="brands-list" :class="{ active: isCategoryActive(category.id) }">
                <button
                  v-for="brand in category.brands"
                  :key="brand"
                  type="button"
                  class="brand-link"
                  :class="{ active: isBrandSelected(category.id, brand) }"
                  :aria-pressed="isBrandSelected(category.id, brand)"
                  @click="toggleBrand(category.id, brand)"
                >
                  {{ brand }}
                </button>
              </div>
            </div>
          </div>

          <!-- 添加清除按钮 -->
          <div class="filter-actions" v-if="activeFiltersCount > 0">
            <button class="clear-btn" @click="clearFilters">
              清除筛选
            </button>
          </div>
        </div>
      </aside>

      <!-- 移动端筛选按钮和菜单 -->
      <div v-if="isMobile" class="mobile-filter">
        <!-- 遮罩层 -->
        <div class="menu-overlay" :class="{ active: showFilter }" @click="showFilter = false"></div>

        <!-- 筛选按钮 -->
        <button class="filter-btn" @click="showFilter = true">
          <div class="left-section">
            <i class="fas fa-sliders-h"></i>
            <span>筛选</span>
          </div>
          <div class="right-section">
            <span class="active-filters" v-if="activeFiltersCount > 0">
              已选{{ activeFiltersCount }}项
            </span>
            <span class="active-filters" v-else>
              全部商品
            </span>
            <i class="fas fa-chevron-right"></i>
          </div>
        </button>

        <!-- 全屏筛选菜单 -->
        <div class="filter-menu" :class="{ active: showFilter }">
          <div class="menu-header">
            <h3>筛选条件</h3>
            <button v-if="activeFiltersCount > 0" class="clear-filters-btn" @click="clearFilters">
              <i class="fas fa-times"></i>
              清除筛选
            </button>
            <button class="close-btn" @click="showFilter = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="menu-content">
            <div class="filter-group">
              <h3>产品类型</h3>
              <div class="filter-options">
                <button
                  type="button"
                  class="filter-btn"
                  :class="{ active: route.query.type === 'new' }"
                  :aria-pressed="route.query.type === 'new'"
                  @click="toggleProductType('new')"
                >
                  产品
                </button>
                <button
                  type="button"
                  class="filter-btn"
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
                  <img
                    :src="getAssetUrl(`/images/brands/${brand.toLowerCase()}/logo.png`)"
                    :alt="brand"
                    loading="lazy"
                    decoding="async"
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
        <div class="products-header">
          <h2>{{ currentCategory?.name || '全部产品' }}</h2>
          <div class="filters">
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
                v-if="searchQuery.trim()"
                type="button"
                class="clear-search"
                aria-label="清除搜索"
                @click="clearSearch"
              >
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
	        </div>

	        <div v-if="filterChips.length > 0" class="selected-filters-bar" aria-label="已选筛选项">
	          <div class="chips">
	            <button
	              v-for="chip in filterChips"
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
	          <button type="button" class="chips-clear" @click.stop="clearFilters">
	            清空
	          </button>
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
	          <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="handleProductClick(product)">
            <div class="condition-tag" :class="product.condition">
              {{ getConditionText(product.condition) }}
            </div>
            <div class="image-wrapper">
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
	                    v-html="formatSpec(spec)"
	                  ></span>
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
	      :product="selectedProduct"
	      :contextText="consultContextText"
	      @close="closeQuoteDialog"
	    />
	  </div>
	</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted, onUnmounted, watch } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { getAssetUrl } from '@/utils/assets';
	import { generatePlaceholderUrl, preloadImage } from '@/utils/image';
	import LazyPicture from '@/components/LazyPicture.vue';
	import QuoteDialog from '@/components/QuoteDialog.vue';

// 导入数据
// @ts-ignore
import { categories } from '../data/products/categories.js';
// @ts-ignore
import { products } from '../data/products/products.js';

// 定义类型接口
interface Category {
  id: number;
  name: string;
  brands: string[];
}

interface BrandFilter {
  categoryId: number;
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
  link?: string;
}

// 类型断言
const typedCategories = categories as Category[];
const typedProducts = products as Product[];

const route = useRoute();
const router = useRouter();

type SelectedBrand = { categoryId: number; brand: string };

const findCategoryForBrand = (brand: string): { categoryId: number; brand: string } | null => {
  const needle = brand.trim().toLowerCase();
  if (!needle) return null;

  for (const category of typedCategories) {
    const canonical = category.brands?.find((b) => String(b).trim().toLowerCase() === needle);
    if (canonical) return { categoryId: category.id, brand: canonical };
  }

  return null;
};

const normalizeSelectedBrands = (brands: SelectedBrand[]): SelectedBrand[] => {
  const seen = new Set<string>();
  const normalized: SelectedBrand[] = [];

  for (const entry of brands) {
    const rawBrand = String(entry.brand ?? '').trim();
    if (!rawBrand) continue;

    let categoryId = entry.categoryId;
    let brand = rawBrand;

    // If categoryId is invalid or doesn't match current data, try to recover it from categories list.
    const category = Number.isFinite(categoryId)
      ? typedCategories.find((c) => c.id === categoryId)
      : undefined;

    if (category) {
      const canonical =
        category.brands?.find((b) => String(b).trim().toLowerCase() === brand.toLowerCase()) ??
        null;
      if (canonical) {
        brand = canonical;
      } else {
        const recovered = findCategoryForBrand(brand);
        if (recovered) {
          categoryId = recovered.categoryId;
          brand = recovered.brand;
        } else {
          continue;
        }
      }
    } else {
      const recovered = findCategoryForBrand(brand);
      if (recovered) {
        categoryId = recovered.categoryId;
        brand = recovered.brand;
      } else {
        continue;
      }
    }

    if (!Number.isFinite(categoryId)) continue;
    const key = `${categoryId}:${brand}`;
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push({ categoryId, brand });
  }

  return normalized;
};

const parseBrandsParam = (value: unknown): SelectedBrand[] => {
  if (typeof value !== 'string' || !value.trim()) return [];
  return value
    .split(',')
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const idx = raw.indexOf(':');
      if (idx === -1) return { categoryId: Number.NaN, brand: raw };
      const categoryIdRaw = raw.slice(0, idx);
      const brand = raw.slice(idx + 1);
      return { categoryId: Number(categoryIdRaw), brand };
    });
};

const serializeBrandsParam = (brands: SelectedBrand[]): string => {
  return brands
    .filter((b) => Number.isFinite(b.categoryId) && !!String(b.brand ?? '').trim())
    .map((b) => `${b.categoryId}:${String(b.brand).trim()}`)
    .join(',');
};

// 获取路由中的筛选参数
const getQueryParams = () => {
  const normalizedBrands = normalizeSelectedBrands(parseBrandsParam(route.query.brands));
  return {
    categories: (route.query.categories as string || '').split(',').filter(Boolean),
    brands: normalizedBrands,
    newProduct: route.query.id as string || '',
    type: route.query.type as string || '',
    q: route.query.q as string || ''
  };
};

// 初始化筛选器
const initializeFilters = () => {
  const params = getQueryParams();
  selectedCategories.value = params.categories;
  selectedBrands.value = params.brands;
  selectedNewProduct.value = params.newProduct;
  selectedType.value = params.type;
  searchQuery.value = params.q;

  // Auto-clean invalid/duplicate brands query (e.g. `NaN:KIKUSUI`), so users can always remove filters.
  const rawBrands = typeof route.query.brands === 'string' ? route.query.brands : '';
  const nextBrands = serializeBrandsParam(params.brands);
  if ((rawBrands || '') !== (nextBrands || '')) {
    const nextQuery: Record<string, any> = { ...route.query };
    if (nextBrands) nextQuery.brands = nextBrands;
    else delete nextQuery.brands;
    router.replace({ query: nextQuery });
  }
};

// 初始化状态
const selectedCategories = ref<string[]>(getQueryParams().categories);
const selectedBrands = ref<SelectedBrand[]>(getQueryParams().brands);
const selectedNewProduct = ref<string>(getQueryParams().newProduct);
const selectedType = ref<string>(getQueryParams().type);
const searchQuery = ref<string>(getQueryParams().q);
let searchCommitTimer: number | null = null;

// 当前选中的分类
const currentCategory = computed(() =>
  typedCategories.find((c: Category) => c.id === Number(route.query.category))
);

// 筛选产品
const filteredProducts = computed(() => {
  let result = [...typedProducts] as Product[];

  // 按产品类型筛选（产品/中古品）
  if (route.query.type) {
    const type = route.query.type as string;
    result = result.filter(product => product.type === type);
  }

  // 按分类筛选
  if (selectedCategories.value.length > 0) {
    result = result.filter(product =>
      selectedCategories.value.includes(String(product.categoryId))
    );
  }

  // 按品牌筛选
  if (selectedBrands.value.length > 0) {
    result = result.filter(product =>
      selectedBrands.value.some(
        b => b.categoryId === product.categoryId && b.brand === product.brand
      )
    );
  }

  // 按品牌名称筛选（用于热门产品跳转）
  if (route.query.brand) {
    const brandName = route.query.brand as string;
    result = result.filter(product =>
      product.brandDisplay === brandName || product.brand === brandName
    );
  }

  // 按产品ID筛选
  if (selectedNewProduct.value) {
    const productId = Number(selectedNewProduct.value);
    result = result.filter(product => product.id === productId);
  }

  // 关键词搜索（名称/品牌/描述/规格/分类）
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter((product) => {
      const categoryName =
        typedCategories.find((c) => c.id === product.categoryId)?.name ?? '';
      const haystack = [
        product.name,
        product.brandDisplay,
        product.brand,
        product.description,
        categoryName,
        ...(product.specs ?? [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  return result;
});

const commitSearch = () => {
  const q = searchQuery.value.trim();
  const newQuery: Record<string, any> = { ...route.query };

  if (q) newQuery.q = q;
  else delete newQuery.q;

  if (newQuery.id) delete newQuery.id;
  selectedNewProduct.value = '';

  router.replace({ query: newQuery });
};

const onSearchInput = () => {
  if (searchCommitTimer) window.clearTimeout(searchCommitTimer);
  searchCommitTimer = window.setTimeout(() => {
    commitSearch();
  }, 240);
};

const clearSearch = () => {
  searchQuery.value = '';
  commitSearch();
};

// 检查是否为移动端
const isMobile = ref(false);
const showFilter = ref(false);

// 检查是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 将初始化逻辑移到 onMounted 中
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  initializeFilters();
});

// 检查分类是否处于激活状态
const isCategoryActive = (categoryId: number) => {
  return selectedCategories.value.includes(String(categoryId));
};

// 切换分类选择
const toggleCategory = (categoryId: number) => {
  // 清除产品筛选条件
  selectedNewProduct.value = '';

  const categoryIdStr = String(categoryId);
  const index = selectedCategories.value.indexOf(categoryIdStr);
  if (index === -1) {
    selectedCategories.value.push(categoryIdStr);
  } else {
    selectedCategories.value.splice(index, 1);
  }
  updateQueryParams();
};

// 切换品牌选择
const toggleBrand = (categoryId: number, brand: string) => {
  // 清除产品筛选条件
  selectedNewProduct.value = '';

  // Defensive: if URL already contains invalid category ids (NaN),
  // allow removing them without re-adding duplicates.
  if (!Number.isFinite(categoryId)) {
    selectedBrands.value = selectedBrands.value.filter((b) => b.brand !== brand);
    updateQueryParams();
    return;
  }

  const index = selectedBrands.value.findIndex(
    (b) => b.categoryId === categoryId && b.brand === brand
  );

  if (index === -1) {
    selectedBrands.value.push({ categoryId, brand });
  } else {
    selectedBrands.value.splice(index, 1);
  }

  updateQueryParams();
};

// 检查品牌是否被选中
const isBrandSelected = (categoryId: number, brand: string) => {
  if (!Number.isFinite(categoryId)) {
    return selectedBrands.value.some((b) => b.brand === brand && !Number.isFinite(b.categoryId));
  }
  return selectedBrands.value.some((b) => b.categoryId === categoryId && b.brand === brand);
};

// 监听路由变化，更新选中状态
watch(
  () => route.query,
  () => {
    // 如果 URL 中没有 id 参数，确保产品选择被清除
    if (!route.query.id) {
      selectedNewProduct.value = '';
    }
    initializeFilters();
  },
  { immediate: true }
);

// 切换产品类型
const toggleProductType = (type: string) => {
  // 构建新的查询参数，保留现有的其他参数
  const newQuery = { ...route.query };

  if (route.query.type === type) {
    // 如果点击当前选中的类型，则清除类型筛选
    delete newQuery.type;
  } else {
    // 设置新的类型
    newQuery.type = type;
    // 清除可能冲突的产品ID
    delete newQuery.id;
  }

  // 更新路由
  router.push({ query: newQuery });

  // 清除产品选择
  selectedNewProduct.value = '';
};

// 计算已选择的筛选项数量
const activeFiltersCount = computed(() => {
  let count = 0;
  if (route.query.type) count += 1;
  if (route.query.brand) count += 1;
  if (searchQuery.value.trim()) count += 1;
  count += selectedCategories.value.length;
  count += selectedBrands.value.length;
  if (selectedNewProduct.value) count += 1;
  return count;
});

// 清除筛选
const clearFilters = () => {
  // 清除所有状态
  selectedType.value = '';
  selectedBrands.value = [];
  selectedCategories.value = [];
  selectedNewProduct.value = '';
  searchQuery.value = '';

  // 清除路由中的所有筛选参数
  router.push({
    name: 'products',
    query: {} // 清空所有查询参数
  });
};

		const clearFiltersAndClose = () => {
		  showFilter.value = false;
		  clearFilters();
		};

		type FilterChip = {
		  key: string;
		  label: string;
		  title?: string;
		  remove: () => void;
		};

		const removeQueryKey = (key: string) => {
		  const newQuery: Record<string, any> = { ...route.query };
		  delete newQuery[key];
		  router.replace({ query: newQuery });
		};

		const filterChips = computed<FilterChip[]>(() => {
		  const chips: FilterChip[] = [];
		  const brandCategoryIds = new Set(
		    selectedBrands.value
		      .filter((b) => Number.isFinite(b.categoryId) && !!b.brand)
		      .map((b) => String(b.categoryId)),
		  );

		  const type = route.query.type as string | undefined;
		  if (type === 'new' || type === 'used') {
		    chips.push({
		      key: `type:${type}`,
		      label: `类型：${getTypeLabel(type)}`,
		      remove: () => toggleProductType(type)
		    });
		  }

		  const brandJump = route.query.brand as string | undefined;
		  if (brandJump) {
		    chips.push({
		      key: `brandJump:${brandJump}`,
		      label: `全分类品牌：${brandJump}`,
		      remove: () => removeQueryKey('brand')
		    });
		  }

		  const q = searchQuery.value.trim();
		  if (q) {
		    chips.push({
		      key: `q:${q}`,
		      label: `搜索：${q}`,
		      remove: () => clearSearch()
		    });
		  }

		  for (const id of selectedCategories.value) {
		    if (brandCategoryIds.has(String(id))) continue;
		    const category = typedCategories.find((c) => String(c.id) === String(id));
		    chips.push({
		      key: `cat:${id}`,
		      label: category ? `分类：${category.name}` : `分类：${id}`,
		      remove: () => toggleCategory(Number(id))
		    });
		  }

		  const brandGroups = new Map<number, string[]>();
		  for (const b of selectedBrands.value) {
		    if (!Number.isFinite(b.categoryId) || !b.brand) continue;
		    const list = brandGroups.get(b.categoryId) ?? [];
		    list.push(b.brand);
		    brandGroups.set(b.categoryId, list);
		  }

		  for (const [categoryId, brands] of brandGroups.entries()) {
		    const category = typedCategories.find((c) => c.id === categoryId);
		    const categoryName = category?.name ?? `分类${categoryId}`;
		    const uniq = Array.from(new Set(brands));

		    const label =
		      uniq.length <= 1
		        ? `品牌：${categoryName} / ${uniq[0]}`
		        : `品牌：${categoryName} / ${uniq[0]} +${uniq.length - 1}`;

		    chips.push({
		      key: `brandGroup:${categoryId}`,
		      label,
		      title: `品牌：${categoryName} / ${uniq.join('、')}`,
		      remove: () => {
		        selectedBrands.value = selectedBrands.value.filter((b) => b.categoryId !== categoryId);
		        updateQueryParams();
		      }
		    });
		  }

		  if (selectedNewProduct.value) {
		    const id = selectedNewProduct.value;
		    const p = typedProducts.find((x) => String(x.id) === String(id));
		    chips.push({
		      key: `id:${id}`,
		      label: p ? `产品：${p.name}` : `ID：${id}`,
		      remove: () => {
		        selectedNewProduct.value = '';
		        updateQueryParams();
		      }
		    });
		  }

		  const uniq = new Map<string, FilterChip>();
		  for (const c of chips) uniq.set(c.key, c);
		  return Array.from(uniq.values());
		});

// 添加成色文本转换函数
const getConditionText = (condition: string) => {
  const conditionMap = {
    new: '全新',
    used: '二手',
    refurbished: '翻新',
    sale:'促销',
    discount:'50%'
  } as const;
  return conditionMap[condition as keyof typeof conditionMap] || '未知';
};

// 预加载可见图片
const preloadVisibleImages = async () => {
  const visibleProducts = filteredProducts.value.map(product => product.image);
  await Promise.all(visibleProducts.map(src => preloadImage(src)));
};

// 监听筛选结果变化，预加载新的可见图片
watch(filteredProducts, () => {
  preloadVisibleImages();
});

onMounted(() => {
  preloadVisibleImages();
});

// 更新路由查询参数
const updateQueryParams = () => {
  const newQuery: Record<string, string> = {};

  // 添加分类和品牌筛选
  if (selectedCategories.value.length > 0) {
    newQuery.categories = selectedCategories.value.join(',');
  }
  if (selectedBrands.value.length > 0) {
    newQuery.brands = selectedBrands.value
      .filter((b) => Number.isFinite(b.categoryId) && !!b.brand)
      .map((b) => `${b.categoryId}:${b.brand}`)
      .join(',');
  }

  // 添加产品ID（如果有）
  if (selectedNewProduct.value) {
    newQuery.id = selectedNewProduct.value;
  }

  // 保持当前的类型参数（如果有）
  if (route.query.type) {
    newQuery.type = route.query.type as string;
  }

  const q = searchQuery.value.trim();
  if (q) {
    newQuery.q = q;
  }

  router.replace({
    query: newQuery
  });
};

// 组件卸载时清理
onUnmounted(() => {
  if (searchCommitTimer) window.clearTimeout(searchCommitTimer);
  window.removeEventListener('resize', checkMobile);
});

// 产品卡点击：打开官方详情页（如有）
const handleProductClick = (product: Product) => {
  if (!product.link) return;
  window.open(product.link, '_blank');
};

// 添加格式化规格的函数
const formatSpec = (spec: string) => {
  // 使用正则表达式匹配 <sup> 标签
  if (spec.includes('<sup>')) {
    return spec; // 如果已经包含 HTML 标签，直接返回
  }
  
  // 匹配数字×10数字 的格式
  return spec.replace(/(\d+)×10(\d+)/g, '$1×10<sup>$2</sup>');
};

	// 添加状态
	const showQuoteDialog = ref(false);
	const selectedProduct = ref<Product | null>(null);

	const expandedSpecIds = reactive(new Set<number>());
	const isSpecsExpanded = (id: number) => expandedSpecIds.has(id);
	const toggleSpecsExpanded = (id: number) => {
	  if (expandedSpecIds.has(id)) {
	    expandedSpecIds.delete(id);
	    return;
	  }
	  expandedSpecIds.add(id);
	};

		function getTypeLabel(type?: string): string {
		  if (type === 'new') return '产品';
		  if (type === 'used') return '中古品';
		  return '全部';
		}

		const consultContextText = computed(() => {
		  const lines: string[] = [];

		  lines.push('【产品信息】');
		  if (selectedProduct.value) {
		    const product = selectedProduct.value;
		    lines.push(`名称：${product.name}`);
		    lines.push(`品牌：${product.brandDisplay || product.brand}`);
		    lines.push(`成色：${getConditionText(product.condition)}`);
		    if (product.link) lines.push(`详情链接：${product.link}`);
		  } else {
		    lines.push('未指定（请补充型号/参数/用途）');
		  }

	  lines.push('');
	  lines.push('【当前筛选】');
	  lines.push(`类型：${getTypeLabel(route.query.type as string | undefined)}`);

	  const categoryNames = selectedCategories.value
	    .map((id) => typedCategories.find((c) => c.id === Number(id))?.name)
	    .filter(Boolean) as string[];
	  lines.push(`分类：${categoryNames.length ? categoryNames.join('、') : '全部'}`);

	  const brandGroups = new Map<number, string[]>();
	  for (const b of selectedBrands.value) {
	    const list = brandGroups.get(b.categoryId) ?? [];
	    list.push(b.brand);
	    brandGroups.set(b.categoryId, list);
	  }
	  const brandText = Array.from(brandGroups.entries())
	    .map(([categoryId, brands]) => {
	      const categoryName = typedCategories.find((c) => c.id === categoryId)?.name ?? `分类${categoryId}`;
	      const uniq = Array.from(new Set(brands));
	      return `${categoryName}：${uniq.join('、')}`;
	    });
	  lines.push(`品牌：${brandText.length ? brandText.join('；') : '全部'}`);

	  if (route.query.brand) {
	    lines.push(`品牌跳转：${route.query.brand as string}`);
	  }
	  if (filteredProducts.value.length) {
	    lines.push(`当前列表数量：${filteredProducts.value.length}`);
	  }

	  lines.push('');
	  lines.push('【咨询内容】价格 / 交期 / 质保 / 是否现货 / 服务承诺');

	  try {
	    lines.push('');
	    lines.push(`页面：${window.location.href}`);
	  } catch {
	    // ignore
	  }

	  return lines.join('\n');
	});
	
	// 添加方法
const openQuoteDialog = (product?: Product | null) => {
  selectedProduct.value = product ?? null;
  showQuoteDialog.value = true;
};

const closeQuoteDialog = () => {
  showQuoteDialog.value = false;
  selectedProduct.value = null;
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../styles/variables' as vars;

	.products-page {
  // 定义全局变量
  --top-bar-height: 40px;
  --nav-height: 38px;

	  display: grid;
	  grid-template-columns: 280px 1fr;
	  gap: var(--space-4);
	  padding: var(--space-4);
	  min-height: 100vh;
	  background: #f8f8f8;

  @media (max-width: 768px) {
    display: block;
    padding: 1rem;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}

	.categories-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	  padding: var(--space-3);
	  height: fit-content;
	  position: sticky;
  // top: calc(var(--top-bar-height) + var(--nav-height) + 2rem);

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh; // 全屏高度
    margin: 0;
    padding: 0;
    background: transparent; // 背景透明
    pointer-events: none; // 默认不接受点击事件
    z-index: 999;

    // 筛选面板内容
	    .filter-content {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 56px; // 预留筛选按钮的高度
      height: 85vh;
      background: white;
      border-radius: 20px 20px 0 0;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	      padding: var(--space-2);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      pointer-events: auto;
    }

    // 筛选按钮固定在底部
	    .mobile-filter-header {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 56px;
      background: white;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
	      padding: 0 var(--space-2);
      padding-bottom: env(safe-area-inset-bottom);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      pointer-events: auto;
      z-index: 1000;

	      h3 {
	        margin: 0;
	        font-size: var(--text-lg);
	        font-weight: 500;
	      }

		      .close-filter-btn {
		        position: absolute;
		        right: var(--space-2);
		        padding: var(--space-1);
		        color: #666;
		      }
	    }

    // 显示状态
    &.show {
      pointer-events: auto;

      .filter-content {
        transform: translateY(0);
      }
    }
  }

	  .filter-status {
	    margin-bottom: var(--space-3);
	    padding: var(--space-2);
	    background: rgba(vars.$primary-green, 0.05);
	    border-radius: 8px;
	    display: flex;
    align-items: center;
    justify-content: space-between;

	    .status-text {
	      color: vars.$primary-green;
	      font-weight: 500;
	      font-size: var(--text-sm);
	    }

		    .clear-all-btn {
	      padding: var(--space-1) var(--space-2);
	      background: white;
	      border: 1px solid rgba(vars.$primary-green, 0.2);
	      border-radius: 6px;
	      color: vars.$primary-green;
	      font-size: var(--text-sm);
	      display: flex;
	      align-items: center;
	      gap: var(--space-1);
	      cursor: pointer;
		      transition: transform 0.2s ease, opacity 0.2s ease;

      i {
        font-size: 0.8rem;
      }

	      &:hover {
	        background: vars.$primary-green;
	        color: white;
	        transform: translateY(-1px);
	      }
	    }
  }

	  .product-type-selector {
	    margin-top: var(--space-3);
	    display: flex;
	    gap: var(--space-2);
	    margin-bottom: var(--space-4);
	    padding-bottom: var(--space-2);
	    border-bottom: 1px solid rgba(0, 0, 0, 0.08);

		    .type-btn {
	      flex: 1;
	      padding: var(--space-2);
	      border: 1px solid rgba(0, 0, 0, 0.1);
	      border-radius: 6px;
	      background: white;
	      color: #666;
	      font-size: var(--text-md);
	      cursor: pointer;
		      transition: transform 0.2s ease, opacity 0.2s ease;

	      &:hover {
	        border-color: vars.$primary-green;
	        color: vars.$primary-green;
	        transform: translateY(-1px);
	      }

      &.active {
        background: vars.$primary-green;
        border-color: vars.$primary-green;
        color: white;
      }
    }
  }

	  .category-group {
	    &+.category-group {
	      margin-top: var(--space-4);
	      padding-top: var(--space-4);
	      border-top: 1px solid rgba(0, 0, 0, 0.08);
	    }
	  }

	  .category-title {
	    font-size: var(--text-lg);
	    color: vars.$primary-black;
	    margin: 0 0 var(--space-3);
	    font-weight: 500;
	  }

  .category-item {
    margin-bottom: 0.5rem;

		    .category-header {
	      display: flex;
	      justify-content: space-between;
	      align-items: center;
	      padding: var(--space-2);
	      cursor: pointer;
	      border-radius: 6px;
	      width: 100%;
	      border: none;
	      background: transparent;
	      text-align: left;
		      transition: transform 0.2s ease, opacity 0.2s ease;

	      &:hover {
	        background: rgba(vars.$primary-green, 0.05);
	        transform: translateY(-1px);
	      }

      i {
        font-size: 0.8rem;
        color: #666;
        transition: transform 0.3s ease;
      }
    }

	    .brands-list {
	      display: none;
	      padding: var(--space-1) 0 var(--space-1) var(--space-3);

      &.active {
        display: block;
      }

		      .brand-link {
	        display: block;
	        padding: var(--space-1);
	        color: #666;
	        text-decoration: none;
	        border-radius: 4px;
	        transition: transform 0.2s ease, opacity 0.2s ease;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;

	        &:hover {
	          color: vars.$primary-green;
	          background: rgba(vars.$primary-green, 0.05);
	          transform: translateX(2px);
	        }

	        &.active {
	          color: vars.$primary-green;
	          font-weight: 500;
	          background: rgba(vars.$primary-green, 0.08);
	          position: relative;
	          padding-right: var(--space-4);

	          &::after {
	            content: '\f00c';
	            font-family: 'Font Awesome 5 Free';
	            font-weight: 900;
	            position: absolute;
	            right: var(--space-1);
	            font-size: 0.8rem;
	          }
	        }
	      }
	    }
	  }

	  .filter-actions {
	    margin-top: var(--space-3);
	    padding-top: var(--space-3);
	    border-top: 1px solid rgba(0, 0, 0, 0.08);

	    .clear-btn {
	      width: 100%;
	      padding: var(--space-2);
	      background: #f5f5f5;
	      border: none;
	      border-radius: 6px;
	      color: #666;
	      font-size: var(--text-sm);
	      cursor: pointer;
	      transition: transform 0.2s ease, opacity 0.2s ease;

	      &:hover {
	        background: rgba(vars.$primary-green, 0.08);
	        color: vars.$primary-green;
	        transform: translateY(-1px);
	      }
    }
  }
}

				.products-content {
				  .products-header {
			    display: flex;
			    justify-content: space-between;
			    align-items: center;
			    margin-bottom: var(--space-4);
			    gap: var(--space-2);
			    flex-wrap: wrap;

			    h2 {
			      font-size: var(--text-xl);
			      color: vars.$primary-black;
			      margin: 0;
			    }

			    .filters {
			      display: flex;
			      align-items: center;
			      justify-content: flex-end;
			      gap: var(--space-2);
			      flex: 1 1 320px;
			      min-width: 240px;
			    }

				    .search-box {
			      position: relative;
			      width: min(520px, 100%);
			      flex: 1 1 360px;
			      background: white;
			      border: 1px solid rgba(0, 0, 0, 0.08);
			      border-radius: 999px;
			      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
			      display: flex;
			      align-items: center;
			      padding: 10px 12px;
				      transition: transform 0.22s ease, opacity 0.22s ease;

			      &:focus-within {
			        border-color: rgba(vars.$primary-green, 0.45);
			        box-shadow: 0 10px 28px rgba(vars.$primary-green, 0.14);
			      }

			      .search-icon {
			        color: #888;
			        margin-left: 2px;
			        margin-right: 10px;
			        flex: 0 0 auto;
			      }

				      .search-input {
				        flex: 1 1 auto;
				        border: none;
				        outline: none;
				        background: transparent;
				        font-size: var(--text-sm);
				        color: vars.$primary-black;
				        min-width: 0;
				        -webkit-appearance: none;
				        appearance: none;

				        &::placeholder {
				          color: #9aa0a6;
				        }

				        &::-webkit-search-cancel-button,
				        &::-webkit-search-decoration {
				          -webkit-appearance: none;
				          appearance: none;
				          display: none;
				        }

				        &::-ms-clear {
				          display: none;
				        }
				      }

				      .clear-search {
			        flex: 0 0 auto;
			        width: 32px;
			        height: 32px;
			        border-radius: 999px;
			        border: none;
			        background: rgba(0, 0, 0, 0.06);
			        color: #666;
			        cursor: pointer;
			        display: inline-flex;
			        align-items: center;
			        justify-content: center;
				        transition: transform 0.18s ease, opacity 0.18s ease;

			        &:hover {
			          background: rgba(0, 0, 0, 0.1);
			          transform: translateY(-1px);
				    }
				  }

						}
					  }

				  .selected-filters-bar {
				    display: flex;
				    align-items: center;
				    justify-content: space-between;
				    gap: var(--space-2);
				    padding: var(--space-2);
				    margin-bottom: var(--space-4);
				    background: white;
				    border: 1px solid rgba(0, 0, 0, 0.08);
				    border-radius: 12px;

				    .chips {
				      display: flex;
				      flex-wrap: wrap;
				      gap: 8px;
				      min-width: 0;
				      flex: 1;
				    }

				    .chip {
				      display: inline-flex;
				      align-items: center;
				      gap: 6px;
				      padding: 3px 10px;
				      border-radius: 999px;
				      border: 1px solid rgba(vars.$primary-green, 0.16);
				      background: rgba(vars.$primary-green, 0.06);
				      color: vars.$primary-green;
				      font-size: var(--text-xs);
				      cursor: pointer;
				      white-space: nowrap;
				      transition: transform 0.18s ease, opacity 0.18s ease;

				      &:hover {
				        transform: translateY(-1px);
				      }

				      &:active {
				        transform: translateY(0) scale(0.98);
				      }

				      .chip-label {
				        max-width: min(520px, 48vw);
				        overflow: hidden;
				        text-overflow: ellipsis;
				        white-space: nowrap;
				      }

				      i {
				        font-size: 0.75rem;
				      }
				    }

				    .chips-clear {
				      flex: 0 0 auto;
				      height: 32px;
				      padding: 0 12px;
				      border-radius: 10px;
				      border: 1px solid rgba(vars.$primary-green, 0.24);
				      background: white;
				      color: vars.$primary-green;
				      font-size: var(--text-sm);
				      font-weight: 600;
				      cursor: pointer;
				      transition: transform 0.2s ease, opacity 0.2s ease;

				      &:hover {
				        transform: translateY(-1px);
				      }

				      &:active {
				        transform: translateY(0) scale(0.98);
				      }
				    }
				  }

			  .empty-products {
			    display: grid;
			    place-items: center;
			    padding: var(--space-6) var(--space-3);
		    margin-top: var(--space-3);
		    min-height: min(520px, 55vh);

		    .empty-card {
		      width: min(720px, 100%);
		      background: white;
		      border-radius: 18px;
		      border: 1px solid rgba(0, 0, 0, 0.06);
		      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
		      padding: clamp(22px, 3vw, 44px);
		      text-align: center;
		      position: relative;
		      overflow: hidden;

		      &::before {
		        content: '';
		        position: absolute;
		        top: -140px;
		        right: -140px;
		        width: 320px;
		        height: 320px;
		        background: radial-gradient(
		          circle at 35% 35%,
		          rgba(vars.$primary-green, 0.18),
		          rgba(vars.$primary-green, 0) 60%
		        );
		        pointer-events: none;
		      }
		    }

		    .empty-icon {
		      width: 72px;
		      height: 72px;
		      border-radius: 999px;
		      margin: 0 auto var(--space-3);
		      display: flex;
		      align-items: center;
		      justify-content: center;
		      color: vars.$primary-green;
		      background: linear-gradient(
		        180deg,
		        rgba(vars.$primary-green, 0.14),
		        rgba(vars.$primary-green, 0.06)
		      );
		      border: 1px solid rgba(vars.$primary-green, 0.22);
		      box-shadow: 0 10px 24px rgba(vars.$primary-green, 0.14);

		      i {
		        font-size: 1.35rem;
		      }
		    }

		    h3 {
		      margin: 0 0 var(--space-2);
		      font-size: var(--text-xl);
		      color: vars.$primary-black;
		      letter-spacing: 0.2px;
		    }

			    .empty-desc {
		      margin: 0 auto;
		      max-width: 520px;
		      font-size: var(--text-md);
		      line-height: 1.7;
			      color: #666;
			    }

			    .active-tags {
			      display: flex;
			      flex-wrap: wrap;
			      gap: 8px;
			      justify-content: center;
			      margin-top: var(--space-3);
			      margin-bottom: var(--space-3);

			      .tag-chip {
			        display: inline-flex;
			        align-items: center;
			        gap: 6px;
			        padding: 4px 10px;
			        border-radius: 999px;
			        font-size: var(--text-xs);
			        color: vars.$primary-green;
			        background: rgba(vars.$primary-green, 0.06);
			        border: 1px solid rgba(vars.$primary-green, 0.16);
			        white-space: nowrap;
			        cursor: pointer;
			        transition: transform 0.18s ease, opacity 0.18s ease;

			        &:hover {
			          transform: translateY(-1px);
			        }

			        &:active {
			          transform: translateY(0) scale(0.98);
			        }

			        i {
			          font-size: 0.75rem;
			        }
			      }
			    }

			    .empty-actions {
			      display: flex;
			      gap: var(--space-2);
		      justify-content: center;
		      margin-top: var(--space-3);
		      flex-wrap: wrap;
		    }

			    .empty-btn {
		      display: inline-flex;
		      align-items: center;
		      justify-content: center;
		      gap: var(--space-1);
		      padding: 10px 16px;
		      border-radius: 12px;
		      font-size: var(--text-sm);
		      font-weight: 600;
		      cursor: pointer;
			      transition: transform 0.22s ease, opacity 0.22s ease;
		      border: 1px solid transparent;
		      user-select: none;

		      i {
		        font-size: 0.95rem;
		      }

		      &.primary {
		        background: vars.$primary-green;
		        color: white;
		        box-shadow: 0 14px 28px rgba(vars.$primary-green, 0.22);

		        &:hover {
		          background: color.adjust(vars.$primary-green, $lightness: -4%);
		          transform: translateY(-1px);
		        }
		      }

		      &.secondary {
		        background: white;
		        color: vars.$primary-green;
		        border-color: rgba(vars.$primary-green, 0.32);

		        &:hover {
		          background: rgba(vars.$primary-green, 0.06);
		          transform: translateY(-1px);
		        }
		      }

		      &:active {
		        transform: translateY(0);
		      }
		    }

		    @media (max-width: 768px) {
		      padding: var(--space-5) var(--space-2);
		      min-height: min(480px, 55vh);

		      .empty-actions {
		        width: 100%;
		        gap: var(--space-2);
		      }

		      .empty-btn {
		        flex: 1 1 0;
		        min-width: 44%;
		      }
		    }
		  }

			  .products-grid {
			    display: grid;
			    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			    gap: var(--space-4);
			    margin-top: var(--space-4);

			    .product-card {
		      background: white;
		      border-radius: 16px;
		      overflow: hidden;
		      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
			      position: relative;
			      cursor: default;
			      transition: transform 0.25s ease, opacity 0.25s ease;

      .image-wrapper {
        position: relative;
        width: 100%;
        height: 240px;
        overflow: hidden;
        background: #f0f0f0;

        .lazy-picture {
          width: 100%;
          height: 100%;

          :deep(.main-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
        }

        &:hover {
          :deep(.main-image) {
            transform: scale(1.08);
          }
        }
      }

      .condition-tag {
        position: absolute;
        top: 5px;
        right: -42px;
        padding: 0.4rem 3rem;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 2;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transform: rotate(45deg);
        transform-origin: center;
        letter-spacing: 1px;
        min-width: 120px;
        text-align: center;

        &::before {
          content: '';
          position: absolute;
          inset: 1px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: inherit;
        }

        &.new {
          background: rgba(vars.$primary-green, 0.95);
          color: white;
        }

        &.used {
          background: rgba(#FF9800, 0.95);
          color: white;
        }

        &.refurbished {
          background: rgba(#2196F3, 0.95);
          color: white;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        background: linear-gradient(45deg,
            transparent,
            rgba(255, 255, 255, 0.1));
        z-index: 1;
      }

	      .product-info {
	        padding: var(--space-3);
	        border-top: 1px solid rgba(0, 0, 0, 0.04);

		        h3 {
		          font-size: var(--text-lg);
		          margin: 0 0 0.8rem;
		          color: vars.$primary-black;
		          font-weight: 600;
		          line-height: 1.4;
		          white-space: nowrap;
		          overflow: hidden;
		          text-overflow: ellipsis;
		          min-height: calc(1.4em * 1);
		        }

	        p {
	          font-size: 0.95rem;
	          color: #666;
	          margin: 0 0 1.2rem;
	          line-height: 1.6;
	          display: -webkit-box;
	          -webkit-line-clamp: 2;
	          -webkit-box-orient: vertical;
	          overflow: hidden;
	          min-height: calc(1.6em * 2);
	        }

		        .specs-row {
		          display: flex;
		          align-items: center;
		          gap: 8px;
		          margin-bottom: var(--space-2);
		        }

		        .specs-list {
		          display: flex;
		          flex: 1;
		          flex-wrap: nowrap;
		          gap: 6px;
		          overflow: hidden;
		          min-height: 22px;

		          &.expanded {
		            flex-wrap: wrap;
		            overflow: visible;
		          }

			          .spec-tag {
		            flex: 0 0 auto;
		            padding: 4px 10px;
		            background: #f5f5f5;
		            border-radius: 6px;
		            font-size: var(--text-xs);
		            color: #555;
			            transition: transform 0.3s ease, opacity 0.3s ease;
		            white-space: nowrap;

		            &:hover {
		              background: rgba(vars.$primary-green, 0.08);
		              color: vars.$primary-green;
		            }
		          }
		        }

		        .specs-more-btn {
		          flex: 0 0 auto;
		          height: 22px;
		          padding: 0 10px;
		          border-radius: 999px;
		          border: 1px solid rgba(vars.$primary-green, 0.18);
		          background: white;
		          color: vars.$primary-green;
		          font-size: var(--text-xs);
		          cursor: pointer;
		          white-space: nowrap;

		          &:hover {
		            background: rgba(vars.$primary-green, 0.06);
		          }
		        }

	        .consult-hints {
	          display: flex;
	          flex-wrap: nowrap;
	          align-items: center;
	          gap: 6px;
	          margin-bottom: var(--space-2);
	          color: #666;
	          font-size: var(--text-xs);
	          overflow: hidden;
	          min-height: 20px;

	          .hint-label {
	            font-weight: 500;
	            color: vars.$primary-black;
	            flex: 0 0 auto;
	            white-space: nowrap;
	          }

	          .hint-item {
	            flex: 0 0 auto;
	            padding: 1px 8px;
	            border-radius: 999px;
	            background: rgba(vars.$primary-green, 0.06);
	            border: 1px solid rgba(vars.$primary-green, 0.12);
	            color: vars.$primary-green;
	            line-height: 1.35;
	            white-space: nowrap;
	          }

	          .hint-item:nth-child(n + 5) {
	            display: none;
	          }
	        }

			        .product-brand {
		          font-size: var(--text-sm);
		          font-weight: 600;
		          color: vars.$primary-green;
		          display: inline-flex;
		          align-items: center;
		          gap: var(--space-1);
		          padding: 2px 10px;
		          background: rgba(vars.$primary-green, 0.06);
		          border-radius: 6px;
			          transition: transform 0.3s ease, opacity 0.3s ease;
		          white-space: nowrap;

          &:hover {
            background: rgba(vars.$primary-green, 0.1);
            transform: translateY(-1px);
          }

	          &::before {
	            content: '品牌';
	            font-size: var(--text-xs);
	            color: #666;
	            font-weight: normal;
	          }
	        }

		        .card-actions {
		          display: flex;
		          gap: var(--space-2);
		          margin-top: var(--space-2);

		          .view-details-btn,
		          .quote-btn {
	            flex: 1;
		            display: flex;
		            align-items: center;
		            justify-content: center;
		            gap: var(--space-1);
		            padding: 9px 12px;
		            border-radius: 6px;
		            font-weight: 500;
		            font-size: var(--text-sm);
		            min-height: 38px;
			            transition: transform 0.2s ease, opacity 0.2s ease;
			            cursor: pointer;

		            i {
		              font-size: 0.9rem;
		            }
		          }

		          .view-details-btn {
            background: vars.$primary-green;
            color: white;
            text-decoration: none;

		            &:hover {
		              background: color.adjust(vars.$primary-green, $lightness: -5%);
		              transform: translateY(-1px);
		            }
		          }

	          .quote-btn {
            background: white;
            color: vars.$primary-green;
            border: 1px solid vars.$primary-green;

	            &:hover {
	              background: rgba(vars.$primary-green, 0.1);
	              transform: translateY(-1px);
	            }
	          }
        }
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
    }
  }
}

		@media (max-width: 768px) {
		  .products-content {
		    .products-header {
		      align-items: flex-start;

		      .filters {
		        width: 100%;
		        justify-content: stretch;
		        flex: 1 1 100%;
		      }

		      .search-box {
		        width: 100%;
		        flex: 1 1 100%;
		      }
		    }
		  }

		  .products-grid {
		    grid-template-columns: repeat(2, 1fr);
		    gap: var(--space-2);

    .product-card {
      .image-wrapper {
        height: 200px;

	        img {
	          padding: var(--space-2);
	        }
	      }

	      .product-info {
	        padding: var(--space-3);

	        h3 {
	          font-size: var(--text-lg);
	        }

	        p {
	          font-size: 0.9rem;
	          margin-bottom: var(--space-2);
	        }

	        .specs-list {
	          gap: 0.6rem;
	          margin-bottom: 1.2rem;

	          .spec-tag {
	            padding: 0.4rem 0.8rem;
	            font-size: 0.85rem;
	          }
	        }

	        .specs-more-btn {
	          height: 22px;
	          padding: 0 10px;
	          font-size: 0.75rem;
	        }

		        .product-brand {
		          font-size: 0.9rem;
		          padding: 0.4rem 0.8rem;

	          &::before {
	            font-size: 0.75rem;
	          }
	        }

	        .card-actions {
	          gap: var(--space-1);

	          .view-details-btn,
	          .quote-btn {
	            padding: 8px 10px;
	            min-height: 36px;
	            font-size: var(--text-xs);
	          }
	        }
	      }

      .condition-tag {
        top: 20px;
        right: -38px;
        padding: 0.3rem 2.5rem;
        font-size: 0.8rem;
        min-width: 100px;
      }

      .view-details-btn {
        opacity: 1;
        transform: none;
      }
    }
  }
}

	@media (max-width: 640px) {
	  .products-grid {
	    grid-template-columns: 1fr;
	    gap: var(--space-2);
	  }
	}

// 移动端筛选样式
.mobile-filter {
  position: fixed;
  top: var(--nav-height);
  left: 0;
  right: 0;
  background: white;
  z-index: 1001;
  -webkit-overflow-scrolling: touch;

  // 顶部分割线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right,
        rgba(131, 183, 53, 0.05),
        rgba(131, 183, 53, 0.3) 50%,
        rgba(131, 183, 53, 0.05));
    opacity: 1;
  }

  // 底部分割线
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(0, 0, 0, 0.08);
  }

  // 遮罩层样式
	  .menu-overlay {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0;
    visibility: hidden;
	    transition: opacity 0.3s ease;
    z-index: 1000;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);

    &.active {
      opacity: 1;
      visibility: visible;
    }
  }

  // 筛选按钮
  .filter-btn {
    height: 60px;
    background: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    font-size: 1rem;
    color: #333;
    width: 100%;
    position: relative;
    line-height: 1;
    cursor: pointer;

    // 顶部装饰线
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 2px;
      background: linear-gradient(to right,
          rgba(131, 183, 53, 0.05),
          rgba(131, 183, 53, 0.3) 50%,
          rgba(131, 183, 53, 0.05));
      border-radius: 2px;
    }
  }

  // 筛选菜单
  .filter-menu {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--nav-height));
    background: white;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    -webkit-overflow-scrolling: touch;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);

    &.active {
      transform: translateX(0);
    }

    .menu-header {
      padding: 1rem 1.2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      background: white;
      position: relative;
      z-index: 2;
      flex-shrink: 0;

      // 顶部装饰线
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 2px;
        background: linear-gradient(to right,
            rgba(131, 183, 53, 0.05),
            rgba(131, 183, 53, 0.3) 50%,
            rgba(131, 183, 53, 0.05));
        border-radius: 2px;
      }

      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: vars.$primary-black;
      }

      .clear-filters-btn {
        margin-right: 1rem;
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        color: #666;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        i {
          font-size: 0.8rem;
        }

        &:hover {
          color: #333;
        }
      }

      .close-btn {
        width: 36px;
        height: 36px;
        border: none;
        background: #f5f5f5;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        cursor: pointer;

        i {
          font-size: 1rem;
        }

        &:active {
          background: #eee;
        }
      }
    }

    .menu-content {
      flex: 1;
      overflow-y: scroll;
      padding: 1.2rem;
      background: white;
      position: relative;
      z-index: 1;
      overscroll-behavior: none;
      padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 180px); // 增加底部内边距
      -webkit-overflow-scrolling: touch;
      position: relative;
      will-change: transform;

      // 筛选区块样式
	      .filter-section {
	        margin-bottom: var(--space-4);
	        background: white;
	        border-radius: 12px;
	        overflow: hidden;

        &:last-child {
          margin-bottom: calc(env(safe-area-inset-bottom, 20px) + 80px); // 为最后一个区块增加更多底部边距
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: vars.$primary-black;
          margin-bottom: 1rem;
        }

        // 类型选择网格
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;

	          .filter-item {
            height: 44px;
            background: #f5f5f5;
            border: none;
            border-radius: 8px;
            color: #666;
            font-size: 0.95rem;
            font-weight: 500;
	            transition: transform 0.2s ease, opacity 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

	            &:hover {
	              transform: translateY(-1px);
	            }

	            &.active {
	              background: vars.$primary-green;
	              color: white;
	            }

            &:active {
              opacity: 0.8;
            }
          }
        }

        // 品牌列表
        .brand-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;

	          .brand-item {
            height: 52px;
            padding: 0 1rem;
            background: #f5f5f5;
            border: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.8rem;
	            transition: transform 0.2s ease, opacity 0.2s ease;
	            cursor: pointer;

            img {
              width: 24px;
              height: 24px;
              object-fit: contain;
            }

            span {
              color: #666;
              font-size: 0.95rem;
              font-weight: 500;
            }

	            &:hover {
	              transform: translateY(-1px);
	            }

	            &.active {
	              background: rgba(vars.$primary-green, 0.1);

              span {
                color: vars.$primary-green;
              }
            }

            &:active {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}

.filter-count {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: #666;

  .clear-filters {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;

    &:hover {
      background: #f5f5f5;
      border-color: #999;
      transform: translateY(-1px);
    }
  }
}

.filter-option {
  &.active {
    background-color: var(--primary-color);
    color: white;
  }
}

.filter-group {
  margin-bottom: var(--space-3);

  h3 {
    font-size: var(--text-md);
    margin-bottom: var(--space-2);
    color: #333;
  }

  .filter-options {
    display: flex;
    gap: var(--space-1);
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: var(--space-1) var(--space-2);
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: transform 0.2s ease, opacity 0.2s ease;

    &:hover {
      border-color: var(--primary-color);
      transform: translateY(-1px);
    }

    &.active {
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }
  }
}

.spec-tag {
  :deep(sup) {
    font-size: 0.7em;
    line-height: 0;
    position: relative;
    vertical-align: super;
  }
}
</style>
