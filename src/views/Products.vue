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
              <i :class="['fas', activeCategoryId === category.id ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
            <div class="brands-list" :class="{ active: activeCategoryId === category.id }">
              <button v-for="brand in category.brands" :key="brand" class="brand-link"
                :class="{ active: selectedBrands.includes(brand) }" @click="toggleBrand(category.id, brand)">
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
          <div class="header-actions">
            <button class="clear-btn" @click="clearFilters" v-if="activeFiltersCount > 0">
              清除
            </button>
            <button class="close-btn" @click="showFilter = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
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
                :class="{ active: selectedBrands.includes(brand) }" @click="toggleBrand(category.id, brand)">
                <img :src="`${getAssetUrl('/images/brands/${brand.toLowerCase()}.png')}`" :alt="brand">
                <span>{{ brand }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 遮罩层 -->
    <div class="filter-overlay" :class="{ active: showFilter }" @click="showFilter = false"></div>

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
            <img :src="product.image" :alt="product.name">
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="specs-list">
              <span v-for="(spec, index) in product.specs" :key="index" class="spec-tag">
                {{ spec }}
              </span>
            </div>
            <div class="product-brand">{{ product.brand }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAssetUrl } from '@/utils/assets';
const route = useRoute();
const router = useRouter();
const activeCategoryId = ref<string | number | null>(null);
const currentBrand = computed(() => route.query.brand as string);
const currentType = computed(() => (route.query.type as string) || 'new'); // 默认显示新品

// 添加移动端相关状态
const isMobile = ref(false);
const showFilter = ref(false);

// 添加选中项的状态管理
const selectedTypes = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);

// 检查是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 应用筛选并关闭菜单
const applyFilter = () => {
  showFilter.value = false;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // 确保类型只能选择一个
  const typeParam = route.query.type as string;
  if (typeParam) {
    // 只取第一个类型值
    selectedTypes.value = [typeParam.split(',')[0]];
  }

  // 品牌可以多选
  const brandParam = route.query.brand as string;
  if (brandParam) {
    selectedBrands.value = brandParam.split(',');
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// 分类数据
const categories = [
  {
    id: 1,
    name: '数字万用表/源表',
    brands: ['KEITHLEY', 'RIGOL', 'GWINSTEK']
  },
  {
    id: 2,
    name: '电压/电流源',
    brands: ['KEITHLEY', 'KIKUSUI', 'RIGOL']
  },
  {
    id: 3,
    name: '示波器',
    brands: ['TEKTRONIX', 'KEYSIGHT', 'RIGOL']
  },
  {
    id: 4,
    name: '电气安规试验',
    brands: ['KIKUSUI', 'HIOKI', 'GWINSTEK']
  }
];

const currentCategory = computed(() =>
  categories.find(c => c.id === Number(route.query.category))
);

const toggleCategory = (categoryId: string | number) => {
  activeCategoryId.value = activeCategoryId.value === categoryId ? null : categoryId;
};

// 切换产品类型（新品/中古品）
const toggleType = (type: string) => {
  // 如果点击的是当前选中的类型，则取消选择
  if (selectedTypes.value.includes(type)) {
    selectedTypes.value = [];
  } else {
    // 否则替换为新选择的类型
    selectedTypes.value = [type];
  }
  updateRoute();
};

// 切换品牌选择
const toggleBrand = (categoryId: string | number, brand: string) => {
  const index = selectedBrands.value.indexOf(brand);
  if (index === -1) {
    selectedBrands.value.push(brand);
  } else {
    selectedBrands.value.splice(index, 1);
  }
  updateRoute();
};

// 更新路由
const updateRoute = () => {
  router.push({
    name: 'products',
    query: {
      ...route.query,
      type: selectedTypes.value.length > 0 ? selectedTypes.value.join(',') : undefined,
      brand: selectedBrands.value.length > 0 ? selectedBrands.value.join(',') : undefined,
      category: route.query.category
    }
  });
};

// 修改已选筛选项计数
const activeFiltersCount = computed(() => {
  return selectedTypes.value.length + selectedBrands.value.length;
});

// 清除所有筛选
const clearFilters = () => {
  selectedTypes.value = [];
  selectedBrands.value = [];
  updateRoute();
  showFilter.value = false;
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

// 示例产品数据
const products = [
  {
    id: 1,
    name: 'Keithley 2450 数字源表',
    description: '高精度数字源表，支持电压/电流源和测量功能',
    image: getAssetUrl('/images/products/keithley-2450.jpg'),
    brand: 'KEITHLEY',
    type: 'new',
    condition: 'new',
    categoryId: 1,
    specs: ['电压源', '电流源', '四线测量']
  },
  {
    id: 2,
    name: 'Rigol DM3068 数字万用表',
    description: '6½ 位高精度数字万用表',
    image: getAssetUrl('/images/products/rigol-dm3068.jpg'),
    brand: 'RIGOL',
    type: 'used',
    condition: 'used',
    categoryId: 1,
    specs: ['6½位', 'USB接口', 'LAN接口']
  },
  {
    id: 3,
    name: 'Tektronix MSO46 示波器',
    description: '高性能混合信号示波器',
    image: getAssetUrl('/images/products/tektronix-mso46.jpg'),
    brand: 'TEKTRONIX',
    type: 'new',
    condition: 'new',
    categoryId: 1,
    specs: ['4通道', '1GHz带宽', '数字通道']
  },
  {
    id: 4,
    name: 'Kikusui PCR500M 交流电源',
    description: '高性能交流电源',
    image: getAssetUrl('/images/products/kikusui-pcr500m.jpg'),
    brand: 'KIKUSUI',
    type: 'used',
    condition: 'used',
    categoryId: 1,
    specs: ['500VA', '1-500V', '40-500Hz']
  }
];

// 修改筛选产品的计算属性
const filteredProducts = computed(() => {
  let filtered = [...products];

  if (route.query.category) {
    filtered = filtered.filter(p => p.categoryId === Number(route.query.category));
  }

  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(p => selectedTypes.value.includes(p.type));
  }

  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter(p => selectedBrands.value.includes(p.brand));
  }

  return filtered;
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

.products-page {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: calc(var(--top-bar-height) + var(--nav-height) + 2rem);
  min-height: 100vh;

  @media (max-width: 768px) {
    display: block;
    padding: 0;
    padding-top: calc(var(--top-bar-height) + var(--nav-height));
  }
}

.categories-menu {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: calc(var(--top-bar-height) + var(--nav-height) + 2rem);

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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2.5rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr; // 移动端单列显示
      gap: 1rem;

      .product-card {
        .image-wrapper {
          padding-top: 66%; // 调整图片比例

          img {
            object-fit: contain; // 确保图片完整显示
            padding: 1rem; // 添加内边距
            background: #f8f8f8; // 添加背景色
          }
        }

        .product-info {
          padding: 1rem;

          h3 {
            font-size: 1.1rem;
          }
        }
      }
    }

    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: all 0.4s ease;
      position: relative;

      // 成色标签
      .condition-tag {
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        font-size: 0.85rem;
        font-weight: 500;
        border-radius: 6px;
        backdrop-filter: blur(8px);
        z-index: 2;
        letter-spacing: 0.5px;

        &.new {
          background: rgba(vars.$primary-green, 0.9);
        }

        &.used {
          background: rgba(#FF9800, 0.9);
        }

        &.refurbished {
          background: rgba(#2196F3, 0.9);
        }
      }

      &:hover {
        border-color: rgba(vars.$primary-green, 0.3);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

        .image-wrapper {
          img {
            transform: scale(1.05);
          }

          &::after {
            opacity: 0.7;
          }
        }
      }

      .image-wrapper {
        position: relative;
        padding-top: 75%;
        overflow: hidden;
        background: #000;

        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top,
              rgba(0, 0, 0, 0.8) 0%,
              rgba(0, 0, 0, 0) 60%);
          opacity: 0.5;
          transition: opacity 0.4s ease;
          z-index: 1;
        }
      }

      .product-info {
        position: relative;
        padding: 1.5rem;
        background: white;
        border-top: 1px solid rgba(0, 0, 0, 0.05);

        h3 {
          margin: 0 0 0.8rem;
          font-size: 1.2rem;
          color: vars.$primary-black;
          font-weight: 600;
          letter-spacing: 0.3px;
          line-height: 1.3;
        }

        p {
          margin: 0 0 1.2rem;
          font-size: 0.9rem;
          color: #666;
          line-height: 1.6;
        }

        .specs-list {
          display: flex;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 1.2rem;

          .spec-tag {
            padding: 0.4rem 0.8rem;
            background: #f5f5f5;
            color: #666;
            font-size: 0.85rem;
            font-weight: 500;
            border-radius: 6px;
            letter-spacing: 0.3px;
            transition: all 0.3s ease;

            &:hover {
              background: rgba(vars.$primary-green, 0.08);
              color: vars.$primary-green;
            }
          }
        }

        .product-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1.2rem;
          background: vars.$primary-black;
          color: white;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 8px;
          letter-spacing: 0.3px;

          &::before {
            content: '';
            display: block;
            width: 6px;
            height: 6px;
            background: vars.$primary-green;
            border-radius: 50%;
          }
        }
      }
    }
  }
}

// 移动端筛选样式
.mobile-filter {

  // 筛选按钮
  .filter-btn {
    position: fixed;
    top: calc(var(--top-bar-height) + var(--nav-height));
    left: 0;
    width: 100%;
    height: 52px;
    background: white;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.2rem;
    font-size: 1rem;
    color: #333;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .left-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: vars.$primary-green;
        font-size: 1.1rem;
      }

      span {
        font-weight: 500;
      }
    }

    .right-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;

      .active-filters {
        padding: 0.3rem 0.8rem;
        background: rgba(vars.$primary-green, 0.08);
        border-radius: 20px;
        color: vars.$primary-green;
        font-weight: 500;
      }

      i {
        font-size: 0.8rem;
      }
    }
  }

  // 筛选菜单
  .filter-menu {
    position: fixed;
    top: calc(var(--top-bar-height) + var(--nav-height) + 52px);
    left: 0;
    width: 100%;
    height: calc(100vh - var(--top-bar-height) - var(--nav-height) - 52px);
    background: #f8f9fa;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    transform: translateY(-100%);
    transition: transform 0.3s ease;

    &.active {
      transform: translateY(0);
    }

    .menu-header {
      height: 60px;
      padding: 0 1.2rem;
      background: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;

      h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: vars.$primary-black;
      }

      .close-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #f5f5f5;
        border: none;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        &:active {
          background: #eee;
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;

        .clear-btn {
          padding: 0.5rem 1rem;
          color: #666;
          font-size: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;

          &:active {
            color: vars.$primary-green;
          }
        }
      }
    }

    .menu-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.2rem;

      .filter-section {
        background: white;
        border-radius: 12px;
        padding: 1.2rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: vars.$primary-black;
          margin-bottom: 1rem;
        }

        .filter-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;

          .filter-item {
            padding: 0.8rem;
            background: #f5f5f5;
            border-radius: 8px;
            text-align: center;
            color: #666;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;

            &.active {
              background: vars.$primary-green;
              color: white;

              // 移除选中对勾图标，保持与 PC 端一致
              &::after {
                display: none;
              }
            }

            &:active {
              transform: scale(0.98);
            }
          }
        }

        .brand-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;

          .brand-item {
            flex: 1 0 calc(50% - 0.4rem);
            padding: 0.8rem;
            background: #f5f5f5;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #666;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;

            img {
              width: 24px;
              height: 24px;
              object-fit: contain;
            }

            &.active {
              background: rgba(vars.$primary-green, 0.08);
              color: vars.$primary-green;
            }

            &:active {
              transform: scale(0.98);
            }
          }
        }
      }
    }
  }
}

// 遮罩层
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 98;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 768px) {
  .products-page {
    padding-top: calc(var(--top-bar-height) + var(--nav-height) + 48px); // 为筛选按钮留出空间
  }

  .products-content {
    padding: 1rem;
  }
}

.filter-item,
.brand-item {
  &.active {
    position: relative;

    &::after {
      content: '\f00c';
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 0.8rem;
    }
  }
}
</style>
