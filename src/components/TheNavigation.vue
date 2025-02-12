<template>
  <header>
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="container top-container">
        <div class="company-info">
          <span>鑫万测电子科技（苏州）有限公司</span>
        </div>
        <div class="contact-info">
          <a href="tel:18112550622">
            <i class="fas fa-phone-alt"></i> 18112550622
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
            <img src="/images/logo.svg" alt="Logo">
          </router-link>
        </div>

        <div class="nav-menu" :class="{ 'menu-active': isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">首页</router-link>

          <!-- 新品下拉菜单 -->
          <div class="nav-item" @mouseenter="!isMobile && showSubmenu('new')" @mouseleave="!isMobile && hideSubmenu()">
            <div class="nav-link" :class="{ 'menu-trigger': isMobile }" @click="isMobile && toggleSubmenu('new')">
              新品
              <i v-if="isMobile" :class="['fas', activeSubmenu === 'new' ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </div>
            <div class="submenu new-products" :class="{ active: activeSubmenu === 'new' }">
              <div class="container submenu-container">
                <div class="brands-grid">
                  <div v-for="brand in topBrands" :key="brand.id" class="brand-section">
                    <div class="brand-header">
                      <img :src="brand.logo" :alt="brand.name">
                      <h3>{{ brand.name }}</h3>
                    </div>
                    <div class="products-list">
                      <router-link v-for="product in brand.products" :key="product.id" :to="{
                        name: 'products',
                        query: {
                          category: getCategoryIdByBrand(brand.name),
                          brand: brand.name,
                          type: 'new'
                        }
                      }" class="product-item" @touchstart.native="handleTouchStart" @touchend.native="handleTouchEnd"
                        @click.native="handleProductClick">
                        <img :src="product.image" :alt="product.name">
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

          <router-link to="/used" class="nav-link" @click="closeMenu">中古品</router-link>
          <a href="https://shop198581009.taobao.com" target="_blank" class="nav-link" @click="closeMenu">淘宝店</a>
          <router-link to="/about" class="nav-link" @click="closeMenu">关于我们</router-link>
        </div>

        <button class="mobile-menu-btn" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const activeSubmenu = ref<string | null>(null);
const isMobile = ref(false);

// 完整的 Top3 品牌数据
const topBrands = [
  {
    id: 1,
    name: 'KEITHLEY',
    logo: '/images/brands/keithley/logo.png',
    products: [
      {
        id: 1,
        name: 'KEITHLEY 2450',
        image: '/images/products/battery-tester.jpg',
        description: '高精度数字源表'
      },
      {
        id: 2,
        name: 'KEITHLEY 2460',
        image: '/images/products/data-acquisition.jpg',
        description: '高压数字源表'
      }
    ]
  },
  {
    id: 2,
    name: 'TEKTRONIX',
    logo: '/images/brands/tektronix/logo.png',
    products: [
      {
        id: 3,
        name: 'MSO46',
        image: '/images/products/environmental-chamber.jpg',
        description: '混合信号示波器'
      },
      {
        id: 4,
        name: 'TBS1000C',
        image: '/images/products/multimeter-1.jpg',
        description: '数字示波器'
      }
    ]
  },
  {
    id: 3,
    name: 'KIKUSUI',
    logo: '/images/brands/kikusui/logo.svg',
    products: [
      {
        id: 5,
        name: 'PWX1500L',
        image: '/images/products/oscilloscope-1.jpg',
        description: '可编程直流电源'
      },
      {
        id: 6,
        name: 'PCR-WE/WE2',
        image: '/images/products/power-analyzer.jpg',
        description: '交流电源'
      }
    ]
  }
];

const categories = [
  {
    id: 1,
    name: '数字万用表/源表',
    image: '/images/products/keithley-2450.jpg',
    brands: ['ADC', 'KEITHLEY', 'RIGOL', 'TEXIO', 'GWINSTEK']
  },
  {
    id: 2,
    name: '电压/电流源',
    image: '/images/products/kikusui-pwx1500l.jpg',
    brands: ['ADC', 'KEITHLEY', 'KIKUSUI', 'RIGOL', 'TEXIO']
  },
  {
    id: 3,
    name: '示波器',
    image: '/images/products/tektronix-mso46.jpg',
    brands: ['TEKTRONIX', 'KEYSIGHT', 'RIGOL', 'TEXIO', 'GWINSTEK']
  },
  {
    id: 4,
    name: '电气安规试验',
    image: '/images/products/chroma-62000p.jpg',
    brands: ['KIKUSUI', 'HIOKI', 'TEXIO', 'GWINSTEK']
  }
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const showSubmenu = (menu: string) => {
  activeSubmenu.value = menu;
};

const hideSubmenu = () => {
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

// 添加一个函数来更新 top-bar 高度
const updateTopBarHeight = () => {
  const topBar = document.querySelector('.top-bar');
  if (topBar) {
    const height = topBar.offsetHeight;
    document.documentElement.style.setProperty('--top-bar-height', `${height}px`);
  }
};

const handleTouchStart = (event: TouchEvent) => {
  const element = event.currentTarget as HTMLElement;
  element.classList.add('touch-active');
};

const handleTouchEnd = (event: TouchEvent) => {
  const element = event.currentTarget as HTMLElement;
  element.classList.remove('touch-active');
};

// 添加辅助函数来根据品牌名获取对应的分类ID
const getCategoryIdByBrand = (brandName: string) => {
  const brandCategories = {
    'KEITHLEY': 1, // 数字万用表/源表
    'RIGOL': 1,
    'GWINSTEK': 1,
    'KIKUSUI': 2, // 电压/电流源
    'TEKTRONIX': 3, // 示波器
    'KEYSIGHT': 3,
    'HIOKI': 4 // 电气安规试验
  } as { [key: string]: number; };

  return brandCategories[brandName] || 1; // 默认返回第一个分类
};

const handleProductClick = (event: Event) => {
  // 阻止默认行为，避免重复触发
  event.preventDefault();

  // 获取目标链接
  const link = event.currentTarget as HTMLElement;
  const routerLink = link.getAttribute('to');

  if (routerLink) {
    // 使用编程式导航
    router.push(JSON.parse(routerLink));
  }

  // 关闭菜单
  closeMenu();
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  updateTopBarHeight(); // 初始化时更新高度
  window.addEventListener('resize', updateTopBarHeight); // 监听窗口大小变化
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateTopBarHeight);
  window.removeEventListener('resize', checkMobile);
});
</script>

<style lang="scss" scoped>
@use '../styles/variables' as vars;

// 添加 CSS 变量来管理高度
:root {
  --top-bar-height: auto; // 让高度自适应内容
  --nav-height: 80px;
}

.top-bar {
  background: vars.$primary-black;
  color: white;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  height: var(--top-bar-height);

  .top-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    min-height: 32px; // 设置最小高度

    .company-info {
      font-weight: 500;
    }

    .contact-info {
      display: flex;
      gap: 2rem;

      a {
        color: white;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: color 0.3s;

        &:hover {
          color: vars.$primary-green;
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
  transition: all 0.3s ease;

  &.nav-scrolled {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 2rem;
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
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: vars.$primary-green;
  }

  &.router-link-active {
    color: vars.$primary-green;
  }
}

.nav-item {
  position: relative;
}

.submenu {
  position: fixed;
  top: 80px; // 顶部信息栏(32px) + 导航栏高度(80px)
  left: 0;
  right: 0;
  width: 100%;
  transform: translateY(0); // 移除初始下移
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem 0;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 999;

  &.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0); // 保持位置不变
  }

  .submenu-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4rem;
    width: 100%;

    .brand-section {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: -1rem;
        left: 0;
        width: 2px;
        height: 40px;
        background: linear-gradient(180deg,
            vars.$primary-green 0%,
            rgba(vars.$primary-green, 0) 100%);
      }

      .brand-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
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
          font-size: 1.2rem;
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
        gap: 1.5rem;

        .product-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.2rem;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.05);

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

            h4 {
              margin: 0 0 0.8rem;
              font-size: 1.1rem;
              color: vars.$primary-black;
              font-weight: 500;
              letter-spacing: 0.3px;
              transition: color 0.3s ease;
            }

            p {
              margin: 0;
              font-size: 0.95rem;
              color: #666;
              line-height: 1.6;
              opacity: 0.9;
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
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--text-color);
    transition: all 0.3s ease;
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
  .top-bar {
    position: fixed;
    background: vars.$primary-black;

    .top-container {
      flex-direction: column;
      gap: 0.8rem;
      padding: 0.8rem 1rem;

      .company-info {
        font-size: 0.9rem;
      }

      .contact-info {
        display: flex;
        flex-direction: row; // 改为水平排列
        justify-content: center;
        gap: 1.5rem;
        font-size: 0.9rem;

        a {
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;

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
    top: var(--top-bar-height); // 从顶部信息栏下方开始
    left: 0;
    right: 0;
    height: 0; // 初始高度为0
    background: white;
    flex-direction: column;
    padding: 0; // 初始padding为0
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    overflow: hidden; // 隐藏溢出内容
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    &.menu-active {
      height: calc(100vh - var(--top-bar-height)); // 展开到全屏高度
      padding: 1.5rem;
      opacity: 1;
      pointer-events: auto;
      overflow-y: auto; // 允许滚动
    }

    .nav-link {
      display: block;
      padding: 1rem;
      text-align: center;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      font-size: 1.1rem;
    }

    .nav-item {
      width: 100%;

      .menu-trigger {
        display: flex;
        align-items: center;
        justify-content: center; // 整体居中
        gap: 0.5rem; // 使用 gap 替代 margin
        padding: 1rem;
        cursor: pointer;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);

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
          padding: 1rem;
          margin: 0.5rem 0;
        }

        .brands-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;

          .brand-section {
            background: white;
            padding: 1.2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

            .brand-header {
              display: flex;
              align-items: center;
              gap: 1rem;
              margin-bottom: 1.2rem;
              padding-bottom: 0.8rem;
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
              padding: 0.8rem;
              border-radius: 6px;
              text-align: center;
              border: 1px solid transparent;
              transition: all 0.2s ease;
              cursor: pointer;
              -webkit-tap-highlight-color: transparent;
              position: relative;
              overflow: hidden;

              .product-item {
                display: block;
                text-decoration: none;
                background: #f8f8f8;
                padding: 0.8rem;
                border-radius: 6px;
                text-align: center;
                border: 1px solid transparent;
                transition: all 0.2s ease;
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
                  margin-bottom: 0.8rem;
                }

                .product-info {
                  position: relative;
                  z-index: 1;

                  h4 {
                    font-size: 0.9rem;
                    margin-bottom: 0.4rem;
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

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
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
  transition: all 0.3s ease;
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
  text-decoration: none; /* 去掉下划线 */
}
</style>
