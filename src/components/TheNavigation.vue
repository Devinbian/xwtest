<template>
  <header>
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="container top-container">
        <div class="company-info">
          <span class="company-wordmark" aria-label="鑫万测电子科技（苏州）有限公司">
            <span class="company-brand">鑫万测</span>
            <span class="company-divider" aria-hidden="true"></span>
            <span class="company-rest">电子科技（苏州）有限公司</span>
          </span>
          <span class="company-tagline" aria-hidden="true">仪器设备 · 测试测量解决方案</span>
        </div>
        <div class="contact-info">
          <a href="tel:186-6258-5852">
            <i class="fas fa-phone-alt"></i>
            <span>186-6258-5852</span>
          </a>
          <a href="mailto:sales@xwtest.com.cn">
            <i class="fas fa-envelope"></i>
            <span>sales@xwtest.com.cn</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <nav class="main-nav" :class="{ 'nav-scrolled': isScrolled }">
      <div class="container nav-container">
        <div class="nav-logo">
          <router-link to="/">
            <img
              :src="getAssetUrl('/images/logo.svg')"
              alt="Logo"
              decoding="async"
            />
          </router-link>
        </div>

        <div
          id="primary-navigation"
          class="nav-menu"
          :class="{ 'menu-active': isMenuOpen }"
        >
          <router-link to="/" class="nav-link" @click="closeMenu"
            >首页</router-link
          >

          <!-- 产品下拉菜单 -->
          <router-link
            v-if="isMobile"
            :to="{ name: 'products', query: { type: 'new' } }"
            class="nav-link"
            :class="{ 'is-route-active': isNewProductsRoute }"
            active-class="_navlink-active"
            exact-active-class="_navlink-exact-active"
            @click="closeMenu"
          >
            产品
          </router-link>
          <div
            v-else
            class="nav-item"
            @mouseenter="showSubmenu('new')"
            @mouseleave="scheduleHideSubmenu()"
          >
            <button
              type="button"
              class="nav-link"
              :class="{
                'is-open': activeSubmenu === 'new',
                'is-route-active': isNewProductsRoute,
              }"
              ref="productsTrigger"
              @click="handleProductsClick"
            >
              产品
            </button>
            <div
              id="nav-submenu-products"
              ref="newSubmenu"
              class="submenu new-products"
              :class="{ active: activeSubmenu === 'new' }"
              @mouseenter="cancelHideSubmenu()"
              @mouseleave="scheduleHideSubmenu()"
            >
              <div class="container submenu-container">
                <div class="submenu-header">
                  <div class="submenu-title">
                    <span class="eyebrow">新品</span>
                    <span class="title">品牌与热销型号</span>
                  </div>
                  <router-link
                    :to="{ name: 'products', query: { type: 'new' } }"
                    class="submenu-all"
                    @click="closeMenu"
                  >
                    查看全部
                    <i class="fas fa-arrow-right"></i>
                  </router-link>
                </div>
                <div class="brands-grid">
                  <div
                    v-for="brand in topBrands"
                    :key="brand.name"
                    class="brand-section"
                  >
                    <button
                      type="button"
                      class="brand-header"
                      @click="handleBrandClick(brand)"
                    >
                      <div class="brand-mark" aria-hidden="true">
                        <img
                          :src="getBrandLogoUrl(brand.name)"
                          :alt="brand.name"
                          loading="lazy"
                          decoding="async"
                          @error="handleBrandLogoError(brand.name)"
                        />
                      </div>
                      <h3>{{ brand.name }}</h3>
                    </button>
                    <div class="products-list">
                      <router-link
                        v-for="product in brand.products"
                        :key="product.id"
                        :to="{
                          name: 'products',
                          query: {
                            type: 'new',
                            id: String(product.id),
                          },
                        }"
                        class="product-item"
                        @click="closeMenu"
                      >
                        <img
                          :src="product.image"
                          :alt="product.name"
                          loading="lazy"
                          decoding="async"
                        />
                        <div class="product-info">
                          <h4>{{ product.name }}</h4>
                          <p>{{ product.description }}</p>
                        </div>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <router-link
            :to="{
              name: 'products',
              query: { type: 'used' },
            }"
            class="nav-link"
            :class="{ 'is-route-active': isUsedProductsRoute }"
            active-class="_navlink-active"
            exact-active-class="_navlink-exact-active"
            @click="closeMenu"
          >
            中古品
          </router-link>
          <a
            href="https://shop198581009.taobao.com"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link"
            @click="closeMenu"
            >淘宝店</a
          >
          <router-link to="/about" class="nav-link" @click="closeMenu"
            >关于我们</router-link
          >
        </div>

        <div class="nav-actions">
          <a
            v-if="isMobile && !isMenuOpen"
            class="nav-action"
            href="tel:186-6258-5852"
            aria-label="拨打电话 186-6258-5852"
          >
            <i class="fas fa-phone-alt" aria-hidden="true"></i>
          </a>
          <a
            v-if="isMobile && !isMenuOpen"
            class="nav-action"
            href="mailto:sales@xwtest.com.cn"
            aria-label="发送邮件 sales@xwtest.com.cn"
          >
            <i class="fas fa-envelope" aria-hidden="true"></i>
          </a>

          <button
            type="button"
            class="mobile-menu-btn"
            :aria-expanded="isMenuOpen"
            aria-controls="primary-navigation"
            :aria-label="isMenuOpen ? '关闭菜单' : '打开菜单'"
            @click="toggleMenu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile overlay + underlay:
           - underlay: fixes iOS/微信滚动合成导致“菜单变半透明”
           - overlay: tap outside to dismiss -->
      <div
        v-if="isMobile && isMenuOpen"
        class="mobile-menu-underlay"
        aria-hidden="true"
      ></div>
      <button
        v-if="isMobile && isMenuOpen"
        type="button"
        class="mobile-menu-overlay"
        aria-label="关闭菜单"
        @click="closeMenu"
      ></button>
    </nav>

    <div
      class="nav-backdrop"
      :class="{ active: !!activeSubmenu && !isMobile }"
      @click="hideSubmenu"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAssetUrl } from '@/utils/assets';

// @ts-ignore
import { products } from '@/data/products/products.js';

const router = useRouter();
const route = useRoute();

type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  brand: string;
  type: string;
  categoryId: number;
  isHot?: boolean;
  hotRank?: number;
};

type MenuBrand = {
  name: string;
  brandsParam: string;
  products: Array<Pick<Product, 'id' | 'name' | 'description' | 'image'>>;
};

const typedProducts = products as Product[];

const BRAND_LOGO_OVERRIDES: Record<string, string[]> = {
  // Existing assets live under `public/images/co-brands/nik.*`
  NIKON: ['/images/co-brands/nik.avif', '/images/co-brands/nik.webp', '/images/co-brands/nik.png'],
};

const brandFolderName = (brandName: string): string => {
  const raw = String(brandName ?? '').trim().toLowerCase();
  // Keep it aligned with existing folder naming under public/images/brands/
  // e.g. "R&S" -> "rs"
  const slug = raw.replace(/[^a-z0-9]+/g, '');
  return slug || raw;
};

const splitUrl = (url: string): { path: string; suffix: string } => {
  const match = url.match(/^([^?#]+)([?#].*)?$/);
  return { path: match?.[1] ?? url, suffix: match?.[2] ?? '' };
};

const replaceExt = (url: string, nextExt: string): string => {
  const { path, suffix } = splitUrl(url);
  const lastSlash = path.lastIndexOf('/');
  const lastDot = path.lastIndexOf('.');
  if (lastDot <= lastSlash) return url;
  return `${path.slice(0, lastDot)}.${nextExt}${suffix}`;
};

const toBaselineImage = (url: string): string => {
  const { path } = splitUrl(url.toLowerCase());
  if (path.endsWith('.avif') || path.endsWith('.webp')) {
    return replaceExt(url, 'jpg');
  }
  return url;
};

// Keep the mega-menu within one viewport (no scrollbar).
// With typical desktop widths this yields 2 rows max.
const MAX_MENU_BRANDS = 4;
const MAX_PRODUCTS_PER_BRAND = 2;

const brandLogoStepByName = reactive<Record<string, number>>({});
const getBrandLogoUrl = (brandName: string): string => {
  const step = brandLogoStepByName[brandName] ?? 0;
  const overrides = BRAND_LOGO_OVERRIDES[String(brandName ?? '').trim()];
  const candidates = overrides?.length
    ? overrides.map((p) => getAssetUrl(p))
    : (() => {
        const folder = brandFolderName(brandName);
        return [
          getAssetUrl(`/images/brands/${folder}/logo.avif`),
          getAssetUrl(`/images/brands/${folder}/logo.webp`),
          getAssetUrl(`/images/brands/${folder}/logo.png`),
          getAssetUrl(`/images/brands/${folder}/logo.svg`),
          getAssetUrl(`/images/brands/${folder}/logo.jpg`),
        ];
      })();
  return candidates[Math.min(step, candidates.length - 1)];
};

const handleBrandLogoError = (brandName: string) => {
  brandLogoStepByName[brandName] = (brandLogoStepByName[brandName] ?? 0) + 1;
};

const topBrands = computed<MenuBrand[]>(() => {
  const newProducts = typedProducts.filter((p) => p.type === 'new' && !!String(p.brand ?? '').trim());
  const byBrand = new Map<string, Product[]>();

  for (const product of newProducts) {
    const key = String(product.brand).trim();
    const list = byBrand.get(key) ?? [];
    list.push(product);
    byBrand.set(key, list);
  }

  const brands = Array.from(byBrand.entries()).map(([brandName, list]) => {
    const categoryIds = Array.from(new Set(list.map((p) => p.categoryId).filter((id) => Number.isFinite(id))));
    const brandsParam = categoryIds.map((id) => `${id}:${brandName}`).join(',');

    const hotRanks = list
      .filter((p) => p.isHot)
      .map((p) => (Number.isFinite(p.hotRank) ? (p.hotRank as number) : Number.POSITIVE_INFINITY));

    const hotCount = hotRanks.length;
    const minHotRank = hotRanks.length ? Math.min(...hotRanks) : Number.POSITIVE_INFINITY;

    const sortedProducts = [...list].sort((a, b) => {
      const aHot = !!a.isHot;
      const bHot = !!b.isHot;
      if (aHot !== bHot) return aHot ? -1 : 1;

      const aRank = Number.isFinite(a.hotRank) ? (a.hotRank as number) : Number.POSITIVE_INFINITY;
      const bRank = Number.isFinite(b.hotRank) ? (b.hotRank as number) : Number.POSITIVE_INFINITY;
      if (aRank !== bRank) return aRank - bRank;

      return a.id - b.id;
    });

    return {
      name: brandName,
      brandsParam,
      products: sortedProducts.slice(0, MAX_PRODUCTS_PER_BRAND).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        image: toBaselineImage(p.image),
      })),
      _sort: {
        hotCount,
        minHotRank,
        totalCount: list.length,
      },
    };
  });

  brands.sort((a, b) => {
    if (a._sort.hotCount !== b._sort.hotCount) return b._sort.hotCount - a._sort.hotCount;
    if (a._sort.minHotRank !== b._sort.minHotRank) return a._sort.minHotRank - b._sort.minHotRank;
    if (a._sort.totalCount !== b._sort.totalCount) return b._sort.totalCount - a._sort.totalCount;
    return a.name.localeCompare(b.name);
  });

  return brands
    .filter((b) => !!b.brandsParam && b.products.length > 0)
    .slice(0, MAX_MENU_BRANDS)
    .map(({ _sort: _unused, ...brand }) => brand);
});

const currentProductsType = computed(() => {
  const raw = route.query?.type;
  return Array.isArray(raw) ? raw[0] : raw;
});

const isUsedProductsRoute = computed(
  () => route.name === 'products' && currentProductsType.value === 'used',
);

const isNewProductsRoute = computed(
  () => route.name === 'products' && currentProductsType.value !== 'used',
);

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const activeSubmenu = ref<string | null>(null);
const isMobile = ref(false);

const lockedScrollY = ref(0);

const productsTrigger = ref<HTMLElement | null>(null);
const newSubmenu = ref<HTMLElement | null>(null);

let submenuCloseTimer: number | null = null;

const cancelHideSubmenu = () => {
  if (submenuCloseTimer) {
    window.clearTimeout(submenuCloseTimer);
    submenuCloseTimer = null;
  }
};

const scheduleHideSubmenu = () => {
  cancelHideSubmenu();
  submenuCloseTimer = window.setTimeout(() => {
    activeSubmenu.value = null;
    submenuCloseTimer = null;
  }, 160);
};

const updateSubmenuArrow = async () => {
  if (isMobile.value) return;
  if (activeSubmenu.value !== 'new') return;
  if (!productsTrigger.value || !newSubmenu.value) return;

  await nextTick();
  requestAnimationFrame(() => {
    if (!productsTrigger.value || !newSubmenu.value) return;
    const triggerRect = productsTrigger.value.getBoundingClientRect();
    const submenuRect = newSubmenu.value.getBoundingClientRect();
    const anchorX = triggerRect.left + triggerRect.width / 2;
    const raw = anchorX - submenuRect.left;
    const clamped = Math.max(24, Math.min(submenuRect.width - 24, raw));
    newSubmenu.value.style.setProperty('--submenu-arrow-left', `${clamped}px`);
  });
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const checkMobile = () => {
  const nextIsMobile = window.innerWidth <= 768;
  if (!nextIsMobile && isMenuOpen.value) {
    unlockBodyScroll();
    closeMenu();
  }
  isMobile.value = nextIsMobile;
};

const showSubmenu = (menu: string) => {
  cancelHideSubmenu();
  activeSubmenu.value = menu;
  updateSubmenuArrow();
};

const hideSubmenu = () => {
  cancelHideSubmenu();
  activeSubmenu.value = null;
};

const toggleSubmenu = (menu: string) => {
  if (activeSubmenu.value === menu) {
    activeSubmenu.value = null;
  } else {
    activeSubmenu.value = menu;
  }
};

const closeMenu = () => {
  isMenuOpen.value = false;
  activeSubmenu.value = null;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 更新 header 高度（用于移动端菜单与页面 padding 计算）
const updateHeaderHeights = () => {
  const topBar = document.querySelector('.top-bar');
  const mainNav = document.querySelector('.main-nav');

  document.documentElement.style.setProperty(
    '--top-bar-height',
    `${topBar ? topBar.clientHeight : 0}px`,
  );
  if (mainNav)
    document.documentElement.style.setProperty(
      '--nav-height',
      `${(mainNav as HTMLElement).clientHeight}px`,
    );

  updateSubmenuArrow();
};

const handleTouchStart = (event: TouchEvent) => {
  const element = event.currentTarget as HTMLElement;
  element.classList.add('touch-active');
};

const handleTouchEnd = (event: TouchEvent) => {
  const element = event.currentTarget as HTMLElement;
  element.classList.remove('touch-active');
};

const handleProductsClick = () => {
  if (isMobile.value) {
    toggleSubmenu('new');
  } else {
    router.push({
      name: 'products',
      query: { type: 'new' },
    });
    closeMenu();
  }
};

const handleBrandClick = (brand: MenuBrand) => {
  router.push({
    name: 'products',
    query: {
      type: 'new',
      brands: brand.brandsParam,
    },
  });
  closeMenu();
};

const lockBodyScroll = () => {
  lockedScrollY.value = window.scrollY || 0;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${lockedScrollY.value}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.width = '100%';
};

const unlockBodyScroll = () => {
  const scrollY = lockedScrollY.value;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollY);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) closeMenu();
};

watch(isMenuOpen, (open) => {
  if (!isMobile.value) return;
  if (open) lockBodyScroll();
  else unlockBodyScroll();
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  updateHeaderHeights();
  window.addEventListener('resize', updateHeaderHeights);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateHeaderHeights);
  window.removeEventListener('resize', checkMobile);
  document.removeEventListener('keydown', handleKeydown);
  cancelHideSubmenu();
  unlockBodyScroll();
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

.top-bar {
  background:
    radial-gradient(900px 260px at 20% -60%, rgba(vars.$primary-green, 0.22), rgba(0, 0, 0, 0) 60%),
    rgba(0, 0, 0, 0.92);
  color: white;
  padding: 8px 0;
  font-size: 0.9rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .top-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-4);
    min-height: 36px;
    gap: var(--space-3);

    .company-info {
      display: inline-flex;
      align-items: baseline;
      gap: 12px;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .company-wordmark {
        min-width: 0;
        display: inline-flex;
        align-items: baseline;
        gap: 10px;
        color: rgba(255, 255, 255, 0.92);
        font-weight: 650;
        letter-spacing: 0.2px;
        overflow: hidden;
      }

      .company-brand {
        flex: 0 0 auto;
        font-weight: 900;
        letter-spacing: 1.2px;
        background: linear-gradient(
          90deg,
          rgba(vars.$primary-green, 1) 0%,
          rgba(vars.$primary-green, 0.85) 55%,
          rgba(255, 255, 255, 0.92) 110%
        );
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 10px 24px rgba(vars.$primary-green, 0.22);
      }

      .company-divider {
        flex: 0 0 auto;
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: rgba(vars.$primary-green, 0.9);
        box-shadow: 0 0 0 4px rgba(vars.$primary-green, 0.14);
        opacity: 0.9;
      }

      .company-rest {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(255, 255, 255, 0.86);
        font-weight: 650;
        letter-spacing: 0.25px;
      }

      .company-tagline {
        flex: 0 0 auto;
        color: rgba(255, 255, 255, 0.58);
        font-size: 0.82rem;
        letter-spacing: 0.6px;
        padding-left: 12px;
        border-left: 1px solid rgba(255, 255, 255, 0.14);
      }
    }

    .contact-info {
      display: flex;
      gap: var(--space-4);
      align-items: center;

      a {
        color: rgba(255, 255, 255, 0.92);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: var(--space-1);
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        background: rgba(255, 255, 255, 0.06);
        transition: color 0.22s ease, transform 0.18s ease, opacity 0.18s ease, background 0.22s ease, border-color 0.22s ease;
        min-width: 0;

        &:hover {
          border-color: rgba(vars.$primary-green, 0.45);
          background: rgba(vars.$primary-green, 0.12);
          color: #fff;
        }

        &:active {
          transform: translateY(1px);
        }

        i {
          font-size: 0.9rem;
          color: rgba(vars.$primary-green, 0.95);
          flex: 0 0 auto;
        }

        span {
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        &:focus-visible {
          outline: 3px solid rgba(vars.$primary-green, 0.35);
          outline-offset: 3px;
        }
      }
    }
  }
}

@media (max-width: 1100px) {
  .top-bar {
    .top-container {
      .company-info {
        gap: 8px;

        .company-tagline {
          display: none;
        }
      }
    }
  }
}

.main-nav {
  position: fixed;
  top: var(--top-bar-height); // 使用 CSS 变量
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, opacity 0.3s ease;

  &.nav-scrolled {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .nav-menu {
      background: rgba(255, 255, 255, 0.7);
      border-color: rgba(0, 0, 0, 0.12);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }
  }
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 var(--space-4);
}

.nav-logo {
  display: flex;
  align-items: center;
  height: 100%;

  a {
    display: flex;
    align-items: center;
    height: 100%;
  }

  img {
    height: 60px;
    width: auto;
    object-fit: contain;
    vertical-align: middle;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 6px;
  height: auto;
  padding: 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font: inherit;
  font-weight: 650;
  font-size: 1.02rem;
  transition: color 0.3s, transform 0.18s ease, opacity 0.18s ease;
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  height: 44px;
  position: relative;
  border-radius: 999px;
  opacity: 0.92;

  &.is-open {
    color: vars.$primary-black;
    background: linear-gradient(
      180deg,
      rgba(vars.$primary-green, 0.28),
      rgba(vars.$primary-green, 0.12)
    );
    border-color: rgba(vars.$primary-green, 0.35);
    opacity: 1;
  }

  &:hover {
    color: vars.$primary-black;
    background: rgba(vars.$primary-green, 0.12);
    opacity: 1;
  }

  &:focus-visible {
    outline: 3px solid rgba(vars.$primary-green, 0.35);
    outline-offset: 3px;
    opacity: 1;
  }

  &:active {
    transform: translateY(1px);
  }
}

.nav-link.is-route-active,
.nav-link.router-link-exact-active,
.nav-link.router-link-active {
  color: vars.$primary-black;
  background: linear-gradient(
    180deg,
    rgba(vars.$primary-green, 0.32),
    rgba(vars.$primary-green, 0.14)
  );
  border-color: rgba(vars.$primary-green, 0.4);
  opacity: 1;
}

.nav-item {
  position: relative;
  height: auto;
  display: flex;
  align-items: center;
}

.nav-backdrop {
  position: fixed;
  inset: 0;
  top: var(--header-offset);
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(2px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0s linear 0.2s;
  z-index: 998;
}

.nav-backdrop.active {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s ease, visibility 0s;
}

.submenu {
  // Desktop mega-menu: centered card (never clipped), with backdrop
  position: fixed;
  top: calc(var(--header-offset) - 2px);
  left: 50%;
  width: min(1240px, calc(100vw - 2rem));
  max-height: calc(100dvh - var(--header-offset) - 1rem);
  max-height: calc(100vh - var(--header-offset) - 1rem);
  overflow: hidden;
  transform: translate(-50%, 0) scale(0.98);
  transform-origin: top center;
  background:
    radial-gradient(1100px 520px at 14% -12%, rgba(vars.$primary-green, 0.20), rgba(255, 255, 255, 0) 58%),
    radial-gradient(900px 460px at 110% 10%, rgba(15, 23, 42, 0.10), rgba(255, 255, 255, 0) 60%),
    rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-radius: 20px;
  padding: var(--space-4);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0s linear 0.18s;
  z-index: 1002;
  will-change: transform, opacity;
  overscroll-behavior: contain;

  // Hover bridge: prevents a visible gap/flicker when moving cursor down
  &::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 0;
    right: 0;
    height: 14px;
    background: transparent;
  }

  // Arrow pointer (anchored by JS to productsTrigger)
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: var(--submenu-arrow-left, 50%);
    width: 14px;
    height: 14px;
    background: rgba(255, 255, 255, 0.98);
    border-left: 1px solid rgba(0, 0, 0, 0.10);
    border-top: 1px solid rgba(0, 0, 0, 0.10);
    transform: translate(-50%, -50%) rotate(45deg);
    z-index: 2;
  }

  &.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translate(-50%, 0) scale(1);
    transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0s;
  }

  .submenu-container {
    max-width: none;
    margin: 0;
    padding: 0;
  }

  .submenu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  }

  .submenu-title {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;

    .eyebrow {
      display: inline-flex;
      align-items: center;
      height: 26px;
      padding: 0 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(15, 23, 42, 0.76);
      background: rgba(vars.$primary-green, 0.14);
      border: 1px solid rgba(vars.$primary-green, 0.22);
      flex: 0 0 auto;
    }

    .title {
      font-size: 1.22rem;
      font-weight: 850;
      color: vars.$primary-black;
      letter-spacing: 0.2px;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.15;
    }
  }

  .submenu-all {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 14px;
    border-radius: 999px;
    text-decoration: none;
    color: vars.$primary-black;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72)) padding-box,
      linear-gradient(135deg, rgba(vars.$primary-green, 0.34), rgba(15, 23, 42, 0.16)) border-box;
    border: 1px solid transparent;
    transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
    flex: 0 0 auto;

    i {
      font-size: 0.9rem;
    }

    &:hover {
      transform: translateY(-1px);
      opacity: 0.95;
    }

    &:active {
      transform: translateY(0);
    }

    &:focus-visible {
      outline: 3px solid rgba(vars.$primary-green, 0.28);
      outline-offset: 3px;
    }
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--space-4);
    width: 100%;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .brand-section {
      position: relative;
      padding: var(--space-3);
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.90), rgba(255, 255, 255, 0.70)) padding-box,
        linear-gradient(135deg, rgba(vars.$primary-green, 0.30), rgba(15, 23, 42, 0.12)) border-box;
      border: 1px solid transparent;
      transition: transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 18px;
        right: 18px;
        height: 2px;
        background: linear-gradient(
          90deg,
          rgba(vars.$primary-green, 0) 0%,
          rgba(vars.$primary-green, 0.85) 40%,
          rgba(vars.$primary-green, 0) 100%
        );
        opacity: 0.65;
      }

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 22px 60px rgba(15, 23, 42, 0.14);
        opacity: 0.98;
      }

      .brand-header {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-3);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        .brand-mark {
          flex: 0 0 auto;
          width: 44px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.035);
          border: 1px solid rgba(15, 23, 42, 0.07);

          img {
            height: 28px;
            width: auto;
            object-fit: contain;
            filter: grayscale(100%);
            transition: filter 0.25s ease;
          }
        }

        h3 {
          margin: 0;
          font-size: var(--text-lg);
          color: vars.$primary-black;
          font-weight: 650;
          letter-spacing: 0.25px;
        }

        &:hover .brand-mark img {
          filter: grayscale(0%);
        }
      }

      .products-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);

        .product-item {
          display: flex;
          gap: var(--space-2);
          padding: 12px;
          border-radius: 14px;
          transition: transform 0.22s ease, background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(15, 23, 42, 0.06);
          min-width: 0;

          &:hover {
            background: rgba(vars.$primary-green, 0.03);
            border-color: rgba(vars.$primary-green, 0.1);
            transform: translateX(4px);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.10);

            img {
              transform: scale(1.05);
            }

            h4 {
              color: vars.$primary-green;
            }
          }

          &:focus-visible {
            outline: 3px solid rgba(vars.$primary-green, 0.28);
            outline-offset: 3px;
          }

          img {
            width: 72px;
            height: 72px;
            object-fit: cover;
            border-radius: 10px;
            box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
            transition: transform 0.22s ease;
          }

          .product-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 0;

            h4 {
              margin: 0 0 var(--space-1);
              font-size: 0.98rem;
              color: vars.$primary-black;
              font-weight: 500;
              letter-spacing: 0.3px;
              transition: color 0.3s ease;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            p {
              margin: 0;
              font-size: 0.82rem;
              color: #666;
              line-height: 1.35;
              opacity: 0.9;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 14px 12px;
  transition: transform 0.18s ease, opacity 0.18s ease;

  &:active {
    transform: scale(0.96);
  }

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--text-color);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.nav-actions {
  display: none;
  align-items: center;
  gap: 10px;
}

.contact-info {
  a {
    i {
      width: 16px; // 固定图标宽度
      text-align: center;
      margin-right: 6px;
    }
  }
}

@media (max-width: 768px) {
  .top-bar {
    display: none;
  }

  .nav-backdrop {
    display: none;
  }

  .main-nav {
    height: 72px;
    background: #ffffff;
    backdrop-filter: none;
  }

  .nav-container {
    height: 72px;
    padding: 0 var(--space-2);
  }

  .nav-logo img {
    height: 44px;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .nav-action {
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: rgba(15, 23, 42, 0.03);
    color: rgba(15, 23, 42, 0.78);
    display: grid;
    place-items: center;
    text-decoration: none;
    transition: transform 0.18s ease, opacity 0.18s ease, border-color 0.18s ease, background 0.18s ease;
    -webkit-tap-highlight-color: transparent;

    i {
      font-size: 1rem;
    }

    &:active {
      transform: scale(0.98);
      opacity: 0.92;
    }
  }

  .nav-menu {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    height: auto;
    background: #ffffff;
    backdrop-filter: none;
    flex-direction: column;
    align-items: stretch;
    padding: 0; // 初始padding为0
    opacity: 0;
    transform: translate3d(0, 100%, 0);
    transition: transform 0.34s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.2s ease;
    pointer-events: none;
    overflow: hidden;
    z-index: 1000;
    box-shadow: 0 -18px 50px rgba(15, 23, 42, 0.18);
    border: 1px solid rgba(15, 23, 42, 0.08);
    border-bottom: none;
    border-radius: 18px 18px 0 0;
    gap: 0;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    isolation: isolate;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;

    &.menu-active {
      max-height: calc(var(--app-vh, 1vh) * 100 - var(--header-offset));
      padding: 14px var(--space-3) calc(14px + env(safe-area-inset-bottom, 0px));
      opacity: 1;
      pointer-events: auto;
      overflow-y: auto;
      gap: 10px;
      transform: translate3d(0, 0, 0);
    }

    .nav-link {
      min-height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 12px 14px;
      text-align: center;
      border: 1px solid rgba(15, 23, 42, 0.08);
      background: rgba(15, 23, 42, 0.02);
      font-size: 1.05rem;
      border-radius: 14px;
      line-height: 1.2;
      transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease, opacity 0.18s ease;
      opacity: 1;

      &:active {
        transform: scale(0.99);
      }

      &.router-link-exact-active,
      &.router-link-active,
      &.is-route-active {
        background: rgba(vars.$primary-green, 0.14);
        border-color: rgba(vars.$primary-green, 0.30);
      }
    }

    .nav-item {
      width: 100%;

      .menu-trigger {
        display: flex;
        align-items: center;
        justify-content: center; // 整体居中
        gap: var(--space-1); // 使用 gap 替代 margin
        padding: var(--space-2);
        cursor: pointer;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        width: 100%;
        min-height: 48px;

        i {
          font-size: 0.8rem;
          transition: transform 0.3s ease;
        }
      }

      .submenu {
        display: none;
        position: static;
        width: 100%;
        background: #f8f8f8;
        box-shadow: none;
        padding: 0;
        margin: 0;
        opacity: 1;
        visibility: visible;
        transform: none;
        max-height: none;
        overflow: visible;

        &::before,
        &::after {
          display: none;
        }

        &.active {
          display: block;
          padding: var(--space-2);
          margin: var(--space-1) 0;
        }

        .submenu-header {
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-2) var(--space-3);
          margin-bottom: var(--space-2);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          text-align: center;
        }

        .submenu-title {
          align-items: center;

          .eyebrow {
            font-size: 0.8rem;
          }

          .title {
            font-size: 1.02rem;
          }
        }

        .submenu-all {
          width: 100%;
          justify-content: center;
        }

        .brands-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);

            .brand-section {
              background: white;
              padding: var(--space-3);
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

              .brand-header {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                margin-bottom: var(--space-3);
                padding-bottom: var(--space-2);
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);

              .brand-mark {
                width: 36px;
                height: 30px;
                display: grid;
                place-items: center;
                border-radius: 8px;
                background: rgba(15, 23, 42, 0.04);
                border: 1px solid rgba(15, 23, 42, 0.06);

                img {
                  height: 20px;
                  width: auto;
                  object-fit: contain;
                }
              }

              h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 500;
                color: vars.$primary-black;
              }
            }

            .products-list {
              display: block;
              text-decoration: none;
              background: #f8f8f8;
              padding: var(--space-2);
              border-radius: 6px;
              text-align: center;
              border: 1px solid transparent;
              transition: transform 0.2s ease, opacity 0.2s ease;
              cursor: pointer;
              -webkit-tap-highlight-color: transparent;
              position: relative;
              overflow: hidden;

              .product-item {
                display: block;
                text-decoration: none;
                background: #f8f8f8;
                padding: var(--space-2);
                border-radius: 6px;
                text-align: center;
                border: 1px solid transparent;
                transition: transform 0.2s ease, opacity 0.2s ease;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
                position: relative;
                overflow: hidden;

                &::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: vars.$primary-green;
                  opacity: 0;
                  transition: opacity 0.2s ease;
                }

                &:active::after {
                  opacity: 0.1;
                }

                &.touch-active {
                  border-color: vars.$primary-green;
                }

                img {
                  width: 100%;
                  height: 100px;
                  object-fit: cover;
                  border-radius: 4px;
                  margin-bottom: var(--space-2);
                }

                .product-info {
                  position: relative;
                  z-index: 1;

                  h4 {
                    font-size: 0.9rem;
                    margin-bottom: var(--space-1);
                    color: vars.$primary-green;
                    font-weight: 500;
                  }

                  p {
                    font-size: 0.8rem;
                    line-height: 1.4;
                    color: #666;
                  }
                }

                &:hover {
                  transform: none;
                  box-shadow: none;
                  background: #f8f8f8;
                }
              }
            }
          }
        }
      }
    }
  }

  .mobile-menu-underlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 998;
    pointer-events: none;
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.28);
    border: none;
    padding: 0;
    margin: 0;
    z-index: 999;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-menu-btn {
    display: flex;
    z-index: 1002;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    max-height: 2000px;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .nav-container {
    padding: 0 var(--space-2);
  }

  .nav-logo img {
    height: 50px;
  }

  .submenu {
    .brands-grid .brand-section {
      .product-item {
        flex-direction: column;
        align-items: center;
        text-align: center;

        img {
          width: 100%;
          height: auto;
          max-width: 200px;
        }
      }
    }
  }
}

// 添加滑动动画
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
  max-height: 2000px; // 足够大的高度以容纳内容
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.products-list .product-item {
  text-decoration: none;
  /* 去掉下划线 */
}
</style>
