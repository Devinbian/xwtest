<template>
  <nav class="main-nav" :class="{ 'nav-scrolled': isScrolled }">
    <div class="container nav-container">
      <div class="nav-logo">
        <router-link to="/">
          <img src="/images/logo.svg" alt="Logo">
        </router-link>
      </div>

      <div class="nav-menu" :class="{ 'menu-active': isMenuOpen }">
        <router-link to="/" class="nav-link">首页</router-link>

        <div class="nav-item" @mouseenter="showSubmenu('products')" @mouseleave="hideSubmenu">
          <router-link to="/products" class="nav-link">产品中心</router-link>
          <div class="submenu" v-show="activeSubmenu === 'products'">
            <div class="container submenu-container">
              <div class="submenu-grid">
                <div class="submenu-category" v-for="category in categories" :key="category.id">
                  <div class="category-header">
                    <img :src="category.image" :alt="category.name">
                    <h3>{{ category.name }}</h3>
                  </div>
                  <ul>
                    <li v-for="brand in category.brands" :key="brand">
                      <img :src="`/images/brands/${brand.toLowerCase()}/logo.png`" :alt="brand">
                      <span>{{ brand }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <router-link to="/shop" class="nav-link">电商平台</router-link>
        <router-link to="/about" class="nav-link">关于我们</router-link>
      </div>

      <button class="mobile-menu-btn" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMenuOpen = ref(false);
const activeSubmenu = ref<string | null>(null);

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

const showSubmenu = (menu: string) => {
  activeSubmenu.value = menu;
};

const hideSubmenu = () => {
  activeSubmenu.value = null;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
  img {
    height: 60px;
    width: auto;
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
    color: var(--primary-color);
  }

  &.router-link-active {
    color: var(--primary-color);
  }
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;

  &.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.submenu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.submenu-category {
  .category-header {
    position: relative;
    margin-bottom: 1.5rem;
    overflow: hidden;
    border-radius: 8px;

    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      transition: transform 0.3s;
    }

    h3 {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0;
      padding: 1rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  ul {
    li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.3s;

      img {
        width: 40px;
        height: auto;
        object-fit: contain;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
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

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 2rem;
    transform: translateY(-100%);
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;

    &.menu-active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
  }

  .mobile-menu-btn {
    display: flex;
  }

  .submenu {
    position: static;
    box-shadow: none;
    padding: 1rem 0;

    .submenu-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
