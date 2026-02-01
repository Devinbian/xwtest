<template>
  <header>
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="container top-container">
        <div class="company-info">
          <span>鑫万测电子科技（苏州）有限公司</span>
        </div>
        <div class="contact-info">
          <a href="tel:186-6258-5852">
            <i class="fas fa-phone-alt"></i> 186-6258-5852
          </a>
          <a href="mailto:sales@xwtest.com.cn">
            <i class="fas fa-envelope"></i> sales@xwtest.com.cn
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
          <div
            class="nav-item"
            @mouseenter="!isMobile && showSubmenu('new')"
            @mouseleave="!isMobile && scheduleHideSubmenu()"
          >
            <button
              type="button"
              class="nav-link"
              :class="{ 'menu-trigger': isMobile, 'is-open': activeSubmenu === 'new' }"
              ref="productsTrigger"
              :aria-expanded="isMobile ? activeSubmenu === 'new' : undefined"
              :aria-controls="isMobile ? 'nav-submenu-products' : undefined"
              @click="handleProductsClick"
            >
              产品
              <i
                v-if="isMobile"
                :class="[
                  'fas',
                  activeSubmenu === 'new' ? 'fa-chevron-up' : 'fa-chevron-down',
                ]"
              ></i>
            </button>
            <div
              id="nav-submenu-products"
              ref="newSubmenu"
              class="submenu new-products"
              :class="{ active: activeSubmenu === 'new' }"
              @mouseenter="!isMobile && cancelHideSubmenu()"
              @mouseleave="!isMobile && scheduleHideSubmenu()"
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
                    :key="brand.id"
                    class="brand-section"
                  >
                    <button
                      type="button"
                      class="brand-header"
                      @click="handleBrandClick(brand)"
                    >
                      <img
                        :src="brand.logo"
                        :alt="brand.name"
                        loading="lazy"
                        decoding="async"
                      />
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
                            brands: `${brand.categoryId}:${brand.name}`,
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
            @click="closeMenu"
          >
            中古品
          </router-link>
          <a
            href="https://shop198581009.taobao.com"
            target="_blank"
            class="nav-link"
            @click="closeMenu"
            >淘宝店</a
          >
          <router-link to="/about" class="nav-link" @click="closeMenu"
            >关于我们</router-link
          >
        </div>

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
    </nav>

    <div
      class="nav-backdrop"
      :class="{ active: !!activeSubmenu && !isMobile }"
      @click="hideSubmenu"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAssetUrl } from '@/utils/assets';

//获取产品下拉菜单数据
import { topBrands } from '@/data/navigation/menuForNewProds';

const router = useRouter();

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

  if (topBar)
    document.documentElement.style.setProperty(
      '--top-bar-height',
      `${topBar.clientHeight}px`,
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

const handleBrandClick = (brand: any) => {
  router.push({
    name: 'products',
    query: {
      type: 'new',
      brands: `${brand.categoryId}:${brand.name}`,
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
  background: vars.$primary-black;
  color: white;
  padding: var(--space-1) 0;
  font-size: 0.9rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;

  .top-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-4);
    min-height: 32px; // 设置最小高度

    .company-info {
      font-weight: 500;
    }

    .contact-info {
      display: flex;
      gap: var(--space-4);

      a {
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: var(--space-1);
        transition: color 0.3s, transform 0.18s ease, opacity 0.18s ease;

        &:hover {
          color: vars.$primary-green;
        }

        &:active {
          transform: translateY(1px);
        }

        i {
          font-size: 0.9rem;
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
  gap: var(--space-4);
  height: 100%;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--text-md);
  transition: color 0.3s, transform 0.18s ease, opacity 0.18s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font: inherit;
  display: inline-flex;
  align-items: center;
  height: 100%;
  position: relative;

  &.is-open {
    color: vars.$primary-green;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 14px;
      height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg, transparent, vars.$primary-green, transparent);
    }
  }

  &:hover {
    color: vars.$primary-green;
  }

  &:active {
    transform: translateY(1px);
  }
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: stretch;
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
  overflow-x: hidden;
  overflow-y: auto;
  transform: translate(-50%, 0) scale(0.98);
  transform-origin: top center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 20px;
  padding: var(--space-5);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.165, 0.84, 0.44, 1), visibility 0s linear 0.18s;
  z-index: 1002;
  will-change: transform, opacity;
  scrollbar-gutter: stable;

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
    padding-bottom: var(--space-4);
    margin-bottom: var(--space-4);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .submenu-title {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .eyebrow {
      font-size: 0.85rem;
      color: rgba(0, 0, 0, 0.55);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .title {
      font-size: 1.1rem;
      font-weight: 600;
      color: vars.$primary-black;
      letter-spacing: 0.3px;
    }
  }

  .submenu-all {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 999px;
    text-decoration: none;
    color: vars.$primary-black;
    background: rgba(vars.$primary-green, 0.10);
    border: 1px solid rgba(vars.$primary-green, 0.20);
    transition: transform 0.2s ease, background 0.2s ease;

    i {
      font-size: 0.9rem;
    }

    &:hover {
      transform: translateY(-1px);
      background: rgba(vars.$primary-green, 0.16);
    }
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-4);
    width: 100%;

    .brand-section {
      position: relative;
      padding: var(--space-3);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 40px;
        background: linear-gradient(
          180deg,
          vars.$primary-green 0%,
          rgba(vars.$primary-green, 0) 100%
        );
      }

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(vars.$primary-green, 0.18);
        box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
      }

      .brand-header {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);

        img {
          height: 36px;
          width: auto;
          object-fit: contain;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }

        h3 {
          margin: 0;
          font-size: var(--text-lg);
          color: vars.$primary-black;
          font-weight: 500;
          letter-spacing: 0.5px;
        }

        &:hover img {
          filter: grayscale(0%);
        }
      }

      .products-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);

        .product-item {
          display: flex;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: 12px;
          transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.05);
          min-width: 0;

          &:hover {
            background: rgba(vars.$primary-green, 0.03);
            border-color: rgba(vars.$primary-green, 0.1);
            transform: translateX(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

            img {
              transform: scale(1.05);
            }

            h4 {
              color: vars.$primary-green;
            }
          }

          img {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease;
          }

          .product-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 0;

            h4 {
              margin: 0 0 var(--space-2);
              font-size: 1.1rem;
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
              font-size: 0.95rem;
              color: #666;
              line-height: 1.6;
              opacity: 0.9;
              display: -webkit-box;
              -webkit-line-clamp: 2;
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
  .nav-backdrop {
    display: none;
  }

  .top-bar {
    position: fixed;
    background: vars.$primary-black;

    .top-container {
      flex-direction: column;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-2);

      .company-info {
        font-size: 0.9rem;
      }

      .contact-info {
        display: flex;
        flex-direction: row; // 改为水平排列
        justify-content: center;
        gap: var(--space-3);
        font-size: 0.9rem;

        a {
          color: white;
          display: flex;
          align-items: center;
          gap: var(--space-1);

          i {
            width: 14px;
            font-size: 0.9rem;
          }
        }
      }
    }
  }

  .nav-menu {
    position: fixed;
    top: var(--header-offset);
    left: 0;
    right: 0;
    height: 0; // 初始高度为0
    background: white;
    flex-direction: column;
    padding: 0; // 初始padding为0
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    pointer-events: none;
    overflow: hidden; // 隐藏溢出内容
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    &.menu-active {
      height: calc(100dvh - var(--header-offset)); // 展开到全屏高度（动态视口）
      height: calc(100vh - var(--header-offset)); // fallback
      padding: var(--space-3);
      opacity: 1;
      pointer-events: auto;
      overflow-y: auto; // 允许滚动
    }

    .nav-link {
      min-height: 48px;
      display: block;
      padding: var(--space-2);
      text-align: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      font-size: var(--text-lg);
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

        &.active {
          display: block;
          padding: var(--space-2);
          margin: var(--space-1) 0;
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

              img {
                height: 24px;
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
