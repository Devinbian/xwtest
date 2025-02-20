<template>
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
          <button class="type-btn" :class="{ active: selectedTypes.includes('new') }" @click="toggleType('new')">
            新品
          </button>
          <button class="type-btn" :class="{ active: selectedTypes.includes('used') }" @click="toggleType('used')">
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
          <button class="close-btn" @click="showFilter = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="menu-content">
          <div class="filter-section">
            <div class="section-title">产品类型</div>
            <div class="filter-grid">
              <button class="filter-item" :class="{ active: selectedTypes.includes('new') }" @click="toggleType('new')">
                新品
              </button>
              <button class="filter-item" :class="{ active: selectedTypes.includes('used') }"
                @click="toggleType('used')">
                中古品
              </button>
            </div>
          </div>

          <div class="filter-section" v-for="category in categories" :key="category.id">
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
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="condition-tag" :class="product.condition">
            {{ getConditionText(product.condition) }}
          </div>
          <div class="image-wrapper">
            <LazyImage 
              :src="getAssetUrl(product.image)" 
              :alt="product.name"
              :placeholder="getAssetUrl(product.image.replace(/(\.[^.]+)$/, '-small$1'))"
            />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="specs-list">
              <span v-for="(spec, index) in product.specs" :key="index" class="spec-tag">
                {{ spec }}
              </span>
            </div>
            <div class="product-brand">
              {{ product.brand }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAssetUrl } from '@/utils/assets';
import { preloadImage } from '@/utils/image';
import LazyImage from '@/components/LazyImage.vue';

//获取产品分类数据
import { categories } from '../data/categories';
//获取产品数据
import { products } from '../data/products';

const route = useRoute();
const router = useRouter();
const activeCategories = ref<(string | number)[]>([]);
const selectedTypes = ref<string[]>([]);
const selectedBrands = ref<BrandFilter[]>([]);

// 添加移动端相关状态
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
}

// 切换品牌选择
const toggleBrand = (categoryId: number, brand: string) => {
  // 查找当前分类的筛选条件
  const categoryFilter = selectedBrands.value.find(filter => filter.categoryId === categoryId);
  
  if (categoryFilter) {
    // 如果已有该分类的筛选条件
    const brandIndex = categoryFilter.brands.indexOf(brand);
    if (brandIndex === -1) {
      // 添加品牌
      categoryFilter.brands.push(brand);
    } else {
      // 移除品牌
      categoryFilter.brands.splice(brandIndex, 1);
      // 如果该分类下没有选中的品牌了，移除整个分类筛选
      if (categoryFilter.brands.length === 0) {
        const filterIndex = selectedBrands.value.findIndex(filter => filter.categoryId === categoryId);
        selectedBrands.value.splice(filterIndex, 1);
      }
    }
  } else {
    // 添加新的分类筛选
    selectedBrands.value.push({
      categoryId,
      brands: [brand]
    });
  }
  
  updateRoute();
};

// 检查品牌是否被选中
const isBrandSelected = (categoryId: number, brand: string) => {
  const categoryFilter = selectedBrands.value.find(filter => filter.categoryId === categoryId);
  return categoryFilter?.brands.includes(brand) || false;
};

// 更新路由
const updateRoute = () => {
  // 构建统一的筛选条件对象
  const filters = {
    types: selectedTypes.value,
    brands: selectedBrands.value,
    category: route.query.category ? Number(route.query.category) : undefined
  };

  // 只在有筛选条件时添加查询参数
  const query = Object.keys(filters).some(key => {
    const value = filters[key as keyof typeof filters];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  }) ? {
    filters: JSON.stringify(filters)
  } : undefined;

  router.push({
    name: 'products',
    query
  });
};

// 初始化筛选器
const initializeFilters = () => {
  // 清空现有筛选条件
  selectedTypes.value = [];
  selectedBrands.value = [];

  // 从统一的 filters 参数初始化所有筛选条件
  const filtersParam = route.query.filters as string;
  if (filtersParam) {
    try {
      const filters = JSON.parse(filtersParam) as {
        types: string[];
        brands: { categoryId: number; brands: string[] }[];
        category?: number;
      };

      // 初始化类型筛选
      if (filters.types) {
        selectedTypes.value = filters.types;
      }

      // 初始化品牌筛选
      if (filters.brands) {
        selectedBrands.value = filters.brands;
      }
    } catch (e) {
      console.error('Failed to parse filters:', e);
    }
  }
};

// 监听路由变化，重新初始化筛选器
watch(
  () => route.fullPath, // 监听完整的路由路径
  () => {
    // 完全重置筛选条件
    selectedTypes.value = [];
    selectedBrands.value = [];
    
    // 然后初始化新的筛选条件
    initializeFilters();
  },
  { immediate: true }
);

const currentCategory = computed(() =>
  categories.find(c => c.id === Number(route.query.category))
);

const toggleCategory = (categoryId: string | number) => {
  const index = activeCategories.value.indexOf(categoryId);
  if (index === -1) {
    // 如果分类未展开，则添加到数组中
    activeCategories.value.push(categoryId);
  } else {
    // 如果分类已展开，则从数组中移除
    activeCategories.value.splice(index, 1);
  }
};

const isCategoryActive = (categoryId: string | number) => {
  return activeCategories.value.includes(categoryId);
};

// 切换产品类型（新品/中古品）
const toggleType = (type: string) => {
  // 如果点击的是当前选中的类型，不做任何操作（保持选中状态）
  if (selectedTypes.value.includes(type)) {
    return;
  }
  // 替换为新选择的类型
  selectedTypes.value = [type];
  updateRoute();
};

// 计算活跃的筛选数量
const activeFiltersCount = computed(() => {
  // 检查是否是从新品菜单进入
  const isFromNewMenu = route.query.type === 'new' && 
                       route.query.category && 
                       route.query.filters;

  // 如果是从新品菜单进入，不计入筛选数量
  if (isFromNewMenu) {
    return 0;
  }

  // 计算有效的筛选数量（必须匹配到产品）
  let effectiveCount = 0;

  // 检查类型筛选是否有效
  if (selectedTypes.value.length > 0) {
    const hasMatchingType = products.some(product => 
      selectedTypes.value.includes(product.type)
    );
    if (hasMatchingType) {
      effectiveCount += selectedTypes.value.length;
    }
  }

  // 检查品牌筛选是否有效
  selectedBrands.value.forEach(filter => {
    filter.brands.forEach(brand => {
      // 检查是否有匹配的产品
      const hasMatchingProduct = products.some(product => 
        product.categoryId === filter.categoryId && 
        product.brand === brand
      );
      if (hasMatchingProduct) {
        effectiveCount += 1;
      }
    });
  });

  return effectiveCount;
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

  // 否则清除左侧菜单的筛选条件
  selectedTypes.value = [];
  selectedBrands.value = [];
  router.push({
    name: 'products'
  });
};

// 筛选产品
const filteredProducts = computed(() => {
  // 如果没有任何筛选条件，显示所有产品
  if (selectedTypes.value.length === 0 && 
      selectedBrands.value.length === 0 && 
      !route.query.category) {
    return products;
  }

  return products.filter((product: Product) => {
    // 1. 类型筛选（新品/中古品）
    if (selectedTypes.value.length > 0 && !selectedTypes.value.includes(product.type)) {
      return false;
    }

    // 2. 品牌筛选
    if (selectedBrands.value.length > 0) {
      // 检查产品是否匹配选中的分类和品牌
      const matchedFilter = selectedBrands.value.find(filter => {
        // 检查分类匹配
        if (filter.categoryId !== product.categoryId) {
          return false;
        }
        
        // 检查品牌匹配
        const category = categories.find((c: Category) => c.id === filter.categoryId);
        return category?.brands.includes(product.brand) && filter.brands.includes(product.brand);
      });

      if (!matchedFilter) {
        return false;
      }
    }

    // 3. 分类筛选（从 URL 参数）
    const categoryParam = Number(route.query.category);
    if (categoryParam && product.categoryId !== categoryParam) {
      return false;
    }

    return true;
  });
});

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

// 修改新品菜单点击处理函数
const handleNewProductClick = (brand: any) => {
  const filters = {
    types: ['new'],
    brands: [{
      categoryId: brand.categoryId,
      brands: [brand.name]
    }],
    category: brand.categoryId
  };

  router.push({
    name: 'products',
    query: {
      filters: JSON.stringify(filters)
    },
    replace: true
  });
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
        background: linear-gradient(
          45deg,
          transparent,
          rgba(255, 255, 255, 0.1)
        );
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
</style>
