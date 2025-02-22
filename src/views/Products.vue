<template>
  <div>
    <!-- 筛选结果提示 -->
    <Teleport to="body">
      <div class="filter-result-container">
        <Transition name="fade">
          <div v-show="showFilterResult" class="filter-result-tip">
            <template v-if="filteredProducts.length > 0">
              找到 {{ filteredProducts.length }} 个符合条件的产品
            </template>
            <template v-else>
              没有找到符合条件的产品
            </template>
          </div>
        </Transition>
      </div>
    </Teleport>

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
            <button class="type-btn" :class="{ active: route.query.type === 'new' }" @click="toggleProductType('new')">
              新品
            </button>
            <button class="type-btn" :class="{ active: route.query.type === 'used' }"
              @click="toggleProductType('used')">
              中古品
            </button>
          </div>

          <!-- 分类列表 -->
          <div class="category-group">
            <div v-for="category in categories" :key="category.id" class="category-item">
              <div class="category-header" @click="toggleCategory(category.id)">
                <span>{{ category.name }}</span>
                <i :class="['fas', isCategoryActive(category.id) ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </div>
              <div class="brands-list" :class="{ active: isCategoryActive(category.id) }">
                <button v-for="brand in category.brands" :key="brand" class="brand-link"
                  :class="{ active: isBrandSelected(category.id, brand) }" @click="toggleBrand(category.id, brand)">
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
                <button class="filter-btn" :class="{ active: route.query.type === 'new' }"
                  @click="toggleProductType('new')">
                  新品
                </button>
                <button class="filter-btn" :class="{ active: route.query.type === 'used' }"
                  @click="toggleProductType('used')">
                  中古品
                </button>
              </div>
            </div>

            <div v-for="category in categories" :key="category.id" class="filter-group">
              <div class="section-title">{{ category.name }}</div>
              <div class="brand-list">
                <button v-for="brand in category.brands" :key="brand" class="brand-item"
                  :class="{ active: isBrandSelected(category.id, brand) }" @click="toggleBrand(category.id, brand)">
                  <img :src="getAssetUrl(`/images/brands/${brand.toLowerCase()}/logo.png`)" :alt="brand">
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
            <!-- 可以添加排序和筛选选项 -->
          </div>
        </div>

        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card" @click="handleProductClick(product)">
            <div class="condition-tag" :class="product.condition">
              {{ getConditionText(product.condition) }}
            </div>
            <div class="image-wrapper">
              <LazyImage :src="product.image" :alt="product.name"
                :placeholder="getProductPreviewUrl(product)" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="specs-list">
                <span v-for="(spec, index) in product.specs" 
                      :key="index" 
                      class="spec-tag"
                      v-html="formatSpec(spec)">
                </span>
              </div>
              <div class="product-brand">
                {{ product.brand }}
              </div>
              <a :href="product.link" 
                 target="_blank" 
                 class="view-details-btn"
                 @click.stop>
                <span>查看详情</span>
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, Teleport, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAssetUrl } from '@/utils/assets';
import { preloadImage } from '@/utils/image';
import LazyImage from '@/components/LazyImage.vue';

// 导入数据
// @ts-ignore
import { categories } from '../data/categories';
// @ts-ignore
import { products } from '../data/products';

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

// 获取路由中的筛选参数
const getQueryParams = () => {
  return {
    categories: (route.query.categories as string || '').split(',').filter(Boolean),
    brands: (route.query.brands as string || '').split(',').filter(Boolean).map(b => {
      const [categoryId, brand] = b.split(':');
      return { categoryId: Number(categoryId), brand };
    }),
    newProduct: route.query.id as string || '',
    type: route.query.type as string || ''
  };
};

// 初始化筛选器
const initializeFilters = () => {
  const params = getQueryParams();
  selectedCategories.value = params.categories;
  selectedBrands.value = params.brands;
  selectedNewProduct.value = params.newProduct;
};

// 初始化状态
const selectedCategories = ref<string[]>(getQueryParams().categories);
const selectedBrands = ref<Array<{ categoryId: number; brand: string; }>>(getQueryParams().brands);
const selectedNewProduct = ref<string>(getQueryParams().newProduct);
const selectedType = ref<string>(getQueryParams().type);
const showFilterResult = ref(false);
let filterTipTimer: number | null = null;
const lastCount = ref(0);

// 当前选中的分类
const currentCategory = computed(() =>
  typedCategories.find((c: Category) => c.id === Number(route.query.category))
);

// 获取分类的品牌列表
const getCategoryBrands = (categoryId: number) => {
  const category = typedCategories.find(c => c.id === categoryId);
  return category ? category.brands : [];
};

// 筛选产品
const filteredProducts = computed(() => {
  let result = [...typedProducts] as Product[];

  // 按产品类型筛选（新品/中古品）
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

  // 按新品ID筛选
  if (selectedNewProduct.value) {
    const productId = Number(selectedNewProduct.value);
    result = result.filter(product => product.id === productId);
  }

  return result;
});

// 获取产品预览图
const getProductPreviewUrl = (product: Product) => {
  const imagePath = product.image.replace(/\.[^.]+$/, '-small$&');
  return imagePath;
};

// 监听筛选结果变化并显示提示
watch(
  () => filteredProducts.value.length,
  (newCount, oldCount) => {
    // 如果数量有变化，显示提示
    if (oldCount !== undefined && newCount !== oldCount) {
      if (filterTipTimer) {
        clearTimeout(filterTipTimer);
      }
      showFilterResult.value = true;
      filterTipTimer = window.setTimeout(() => {
        showFilterResult.value = false;
      }, 3000);
    }
  },
  { immediate: false }
);

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
  // 设置初始产品数量
  nextTick(() => {
    console.log('Initial products count:', filteredProducts.value.length);
  });
});

// 检查分类是否处于激活状态
const isCategoryActive = (categoryId: number) => {
  return selectedCategories.value.includes(String(categoryId));
};

// 切换分类选择
const toggleCategory = (categoryId: number) => {
  // 清除新品筛选条件
  selectedNewProduct.value = '';
  // 清除类型筛选条件
  if (route.query.type) {
    router.replace({
      query: {
        ...route.query,
        type: undefined
      }
    });
  }

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
  // 清除新品筛选条件
  selectedNewProduct.value = '';
  // 清除类型筛选条件
  if (route.query.type) {
    router.replace({
      query: {
        ...route.query,
        type: undefined
      }
    });
  }

  const index = selectedBrands.value.findIndex(
    b => b.categoryId === categoryId && b.brand === brand
  );

  if (index === -1) {
    selectedBrands.value.push({ categoryId, brand });
  } else {
    selectedBrands.value.splice(index, 1);
  }

  updateQueryParams();
};

// 选择新品
const selectNewProduct = (productId: string) => {
  selectedNewProduct.value = productId;
  updateQueryParams();
};

// 检查品牌是否被选中
const isBrandSelected = (categoryId: number, brand: string) => {
  return selectedBrands.value.some(
    b => b.categoryId === categoryId && b.brand === brand
  );
};

// 监听路由变化，更新选中状态
watch(
  () => route.query,
  () => {
    // 如果 URL 中没有 id 参数，确保新品选择被清除
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
    // 清除可能冲突的新品ID
    delete newQuery.id;
  }

  // 更新路由
  router.push({ query: newQuery });

  // 清除新品选择
  selectedNewProduct.value = '';
};

// 检查产品类型是否被选中
const isTypeSelected = (type: string) => {
  return selectedType.value === type;
};

// 计算已选择的筛选项数量
const activeFiltersCount = computed(() => {
  // 只统计品牌选择的数量
  return selectedBrands.value.length;
});

// 清除筛选
const clearFilters = () => {
  // 检查是否是从新品菜单进入
  const isFromNewMenu = route.query.type === 'new' && 
                       route.query.category && 
                       route.query.filters;

  if (isFromNewMenu) {
    // 如果是从新品菜单进入，不执行清除操作
    return;
  }

  // 清除所有状态
  selectedType.value = '';
  selectedBrands.value = [];
  selectedCategories.value = [];
  selectedNewProduct.value = '';

  // 清除路由中的所有筛选参数
  router.push({
    name: 'products',
    query: {} // 清空所有查询参数
  });
};

// 添加成色文本转换函数
const getConditionText = (condition: string) => {
  const conditionMap = {
    new: '全新',
    used: '二手',
    refurbished: '翻新'
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
    newQuery.brands = selectedBrands.value.map(b => `${b.categoryId}:${b.brand}`).join(',');
  }

  // 添加新品ID（如果有）
  if (selectedNewProduct.value) {
    newQuery.id = selectedNewProduct.value;
  }

  // 保持当前的类型参数（如果有）
  if (route.query.type) {
    newQuery.type = route.query.type as string;
  }

  router.replace({
    query: newQuery
  });
};

// 组件卸载时清理
onUnmounted(() => {
  if (filterTipTimer) {
    clearTimeout(filterTipTimer);
  }
  window.removeEventListener('resize', checkMobile);
});

// 监听路由变化
watch(
  () => route.query.type,
  (newType) => {
    console.log('Product type changed:', newType); // 添加调试日志
  }
);

// 添加产品点击处理函数
const handleProductClick = (product: Product) => {
  if (product.link) {
    window.open(product.link, '_blank');
  }
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
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

.products-page {
  // 定义全局变量
  --top-bar-height: 40px;
  --nav-height: 38px;

  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  padding: 2rem;
  min-height: 100vh;
  background: #f8f8f8;

  @media (max-width: 768px) {
    display: block;
    padding-top: calc(var(--nav-height) + 60px + 1px);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}

.categories-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
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
      padding: 1rem;
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
      padding: 0 1rem;
      padding-bottom: env(safe-area-inset-bottom);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      pointer-events: auto;
      z-index: 1000;

      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 500;
      }

      .close-filter-btn {
        position: absolute;
        right: 1rem;
        padding: 0.5rem;
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
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(vars.$primary-green, 0.05);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .status-text {
      color: vars.$primary-green;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .clear-all-btn {
      padding: 0.4rem 0.8rem;
      background: white;
      border: 1px solid rgba(vars.$primary-green, 0.2);
      border-radius: 6px;
      color: vars.$primary-green;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      transition: all 0.3s ease;

      i {
        font-size: 0.8rem;
      }

      &:hover {
        background: vars.$primary-green;
        color: white;
      }
    }
  }

  .product-type-selector {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);

    .type-btn {
      flex: 1;
      padding: 0.8rem;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      background: white;
      color: #666;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: vars.$primary-green;
        color: vars.$primary-green;
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
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }
  }

  .category-title {
    font-size: 1.2rem;
    color: vars.$primary-black;
    margin: 0 0 1.5rem;
    font-weight: 500;
  }

  .category-item {
    margin-bottom: 0.5rem;

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(vars.$primary-green, 0.05);
      }

      i {
        font-size: 0.8rem;
        color: #666;
        transition: transform 0.3s ease;
      }
    }

    .brands-list {
      display: none;
      padding: 0.5rem 0 0.5rem 1.5rem;

      &.active {
        display: block;
      }

      .brand-link {
        display: block;
        padding: 0.5rem;
        color: #666;
        text-decoration: none;
        border-radius: 4px;
        transition: all 0.3s ease;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        cursor: pointer;

        &:hover {
          color: vars.$primary-green;
          background: rgba(vars.$primary-green, 0.05);
        }

        &.active {
          color: vars.$primary-green;
          font-weight: 500;
          background: rgba(vars.$primary-green, 0.08);
          position: relative;
          padding-right: 2rem;

          &::after {
            content: '\f00c';
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            position: absolute;
            right: 0.5rem;
            font-size: 0.8rem;
          }
        }
      }
    }
  }

  .filter-actions {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(0, 0, 0, 0.08);

    .clear-btn {
      width: 100%;
      padding: 0.8rem;
      background: #f5f5f5;
      border: none;
      border-radius: 6px;
      color: #666;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(vars.$primary-green, 0.08);
        color: vars.$primary-green;
      }
    }
  }
}

.products-content {
  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      color: vars.$primary-black;
      margin: 0;
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;

    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      position: relative;
      cursor: pointer;

      .image-wrapper {
        position: relative;
        width: 100%;
        height: 240px;
        overflow: hidden;
        background: #f0f0f0;

        .lazy-image {
          width: 100%;
          height: 100%;

          :deep(img) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
        }

        &:hover {
          :deep(img) {
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
        padding: 1.5rem;
        border-top: 1px solid rgba(0, 0, 0, 0.04);

        h3 {
          font-size: 1.2rem;
          margin: 0 0 0.8rem;
          color: vars.$primary-black;
          font-weight: 600;
          line-height: 1.4;
        }

        p {
          font-size: 0.95rem;
          color: #666;
          margin: 0 0 1.2rem;
          line-height: 1.6;
        }

        .specs-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 1.2rem;

          .spec-tag {
            padding: 0.5rem 1rem;
            background: #f5f5f5;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #555;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(vars.$primary-green, 0.08);
              color: vars.$primary-green;
            }
          }
        }

        .product-brand {
          font-size: 1rem;
          font-weight: 600;
          color: vars.$primary-green;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(vars.$primary-green, 0.06);
          border-radius: 6px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(vars.$primary-green, 0.1);
            transform: translateY(-1px);
          }

          &::before {
            content: '品牌';
            font-size: 0.8rem;
            color: #666;
            font-weight: normal;
          }
        }

        .view-details-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.8rem 1.2rem;
          background: vars.$primary-green;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          opacity: 0.9;
          transform: translateY(5px);

          i {
            font-size: 0.9rem;
            transition: transform 0.3s ease;
          }

          &:hover {
            background: darken(vars.$primary-green, 5%);
            
            i {
              transform: translateX(3px);
            }
          }

          &:active {
            transform: translateY(1px);
          }
        }
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

        .view-details-btn {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;

    .product-card {
      .image-wrapper {
        height: 200px;

        img {
          padding: 1rem;
        }
      }

      .product-info {
        padding: 1.2rem;

        h3 {
          font-size: 1.1rem;
        }

        p {
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .specs-list {
          gap: 0.6rem;
          margin-bottom: 1.2rem;

          .spec-tag {
            padding: 0.4rem 0.8rem;
            font-size: 0.85rem;
          }
        }

        .product-brand {
          font-size: 0.9rem;
          padding: 0.4rem 0.8rem;

          &::before {
            font-size: 0.75rem;
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

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
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
    transition: all 0.3s ease;
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
        margin-bottom: 2rem;
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
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

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
            transition: all 0.3s ease;
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

.filter-result-container {
  position: fixed;
  top: 15%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding-top: calc(var(--nav-height) + 20px);
  pointer-events: none;
  z-index: 9999;
}

.filter-result-tip {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  white-space: nowrap;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.filter-count {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #666;

  .clear-filters {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f5f5f5;
      border-color: #999;
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
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .filter-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--primary-color);
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
