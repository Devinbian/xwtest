<template>
  <nav class="main-nav" :class="{ 'nav-scrolled': isScrolled }">
    <div class="nav-content">
      <div class="logo">
        <router-link to="/">
          <img :src="logo" alt="Logo">
        </router-link>
      </div>

      <div class="nav-links">
        <div 
          v-for="(item, index) in menuItems" 
          :key="index"
          class="nav-item"
          @mouseenter="activeMenu = item.key"
          @mouseleave="activeMenu = null"
        >
          <router-link :to="item.path" class="nav-link">
            {{ item.label }}
            <span class="arrow" v-if="item.children">▾</span>
          </router-link>

          <transition name="fade">
            <div class="mega-menu" v-if="item.children && activeMenu === item.key">
              <div class="menu-content">
                <div class="menu-categories">
                  <div 
                    v-for="(child, childIndex) in item.children" 
                    :key="childIndex"
                    class="category"
                    @mouseenter="activeCategory = child.key"
                  >
                    <div class="category-title">{{ child.label }}</div>
                    <div class="category-items">
                      <router-link 
                        v-for="subItem in child.items"
                        :key="subItem.id"
                        :to="subItem.path"
                        class="category-item"
                      >
                        <img :src="subItem.image" :alt="subItem.name">
                        <span>{{ subItem.name }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>
                <div class="menu-preview" v-if="activeCategory">
                  <img :src="getCategoryImage(activeCategory)" :alt="activeCategory">
                  <div class="preview-text">
                    {{ getCategoryText(activeCategory) }}
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <search-bar class="nav-search" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import SearchBar from './SearchBar.vue'
import { ASSETS } from '@/constants/assets'

const activeMenu = ref<string | null>(null)
const activeCategory = ref<string | null>(null)
const isScrolled = ref(false)
const { y } = useWindowScroll()

const logo = ASSETS.BASE.LOGO.DEFAULT

// 监听滚动以改变导航栏样式
const updateNavStyle = () => {
  isScrolled.value = y.value > 50
}

onMounted(() => {
  updateNavStyle()
  window.addEventListener('scroll', updateNavStyle)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateNavStyle)
})

const getCategoryText = (categoryKey: string) => {
  switch (categoryKey) {
    case 'oscilloscopes':
      return '高精度波形测量与分析解决方案'
    case 'power-supplies':
      return '稳定可靠的电源设备'
    case 'featured':
      return '全球领先的测试测量设备制造商'
    default:
      return ''
  }
}

const menuItems = [
  {
    key: 'products',
    label: '产品中心',
    path: '/products',
    children: [
      {
        key: 'oscilloscopes',
        label: '示波器',
        items: [
          {
            id: 1,
            name: 'MSO46 示波器',
            path: '/products/mso46',
            image: ASSETS.PRODUCTS.ITEMS.OSCILLOSCOPES.MSO46.THUMB
          },
          {
            id: 2,
            name: 'TBS2000B 示波器',
            path: '/products/tbs2000b',
            image: ASSETS.PRODUCTS.ITEMS.OSCILLOSCOPES.TBS2000B.THUMB
          }
        ]
      },
      {
        key: 'power-supplies',
        label: '电源',
        items: [
          {
            id: 3,
            name: 'E36312A 电源',
            path: '/products/e36312a',
            image: ASSETS.PRODUCTS.ITEMS.POWER_SUPPLIES.E36312A.THUMB
          }
        ]
      }
    ]
  },
  {
    key: 'brands',
    label: '品牌',
    path: '/brands',
    children: [
      {
        key: 'featured',
        label: '主要品牌',
        items: [
          {
            id: 1,
            name: 'Keysight',
            path: '/brands/keysight',
            image: ASSETS.HOME.BRANDS.KEYSIGHT
          },
          {
            id: 2,
            name: 'Tektronix',
            path: '/brands/tektronix',
            image: ASSETS.HOME.BRANDS.TEKTRONIX
          }
        ]
      }
    ]
  },
  {
    key: 'about',
    label: '关于我们',
    path: '/about'
  }
]

const getCategoryImage = (categoryKey: string) => {
  switch (categoryKey) {
    case 'oscilloscopes':
      return ASSETS.PRODUCTS.ITEMS.OSCILLOSCOPES.MSO46.IMAGE
    case 'power-supplies':
      return ASSETS.PRODUCTS.ITEMS.POWER_SUPPLIES.E36312A.IMAGE
    case 'featured':
      return ASSETS.HOME.BRANDS.KEYSIGHT
    default:
      return ''
  }
}
</script>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as mix;

.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: vars.$header-height;
  background-color: white;
  box-shadow: vars.$shadow-sm;
  transition: vars.$transition-normal;
  z-index: vars.$z-index-fixed;

  &.nav-scrolled {
    background-color: white;
    box-shadow: vars.$shadow-md;
  }

  .nav-content {
    max-width: vars.$max-width;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 vars.$side-padding;

    .logo {
      img {
        height: 40px;
        width: auto;
      }
    }

    .nav-links {
      display: flex;
      margin-left: 4rem;
      height: 100%;

      .nav-item {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 1.5rem;

        .nav-link {
          color: vars.$primary-dark;
          text-decoration: none;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;

          &:hover {
            color: vars.$primary-green;
          }

          .arrow {
            font-size: 0.8em;
            transition: vars.$transition-normal;
          }
        }

        &:hover .arrow {
          transform: rotate(180deg);
        }
      }
    }

    .nav-search {
      margin-left: auto;
    }
  }
}

// Mega Menu 样式
.mega-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 900px;
  max-width: 1200px;
  width: 90vw;
  background: white;
  box-shadow: vars.$shadow-lg;
  border-radius: vars.$border-radius-lg;
  padding: 0;
  z-index: vars.$z-index-dropdown;
  overflow: hidden;
  border: 1px solid vars.$gray-200;

  .menu-content {
    display: grid;
    grid-template-columns: 3fr 1.2fr;
    gap: 0;
  }

  .menu-categories {
    padding: 2rem;
    background: white;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2.5rem;
  }

  .category {
    &-title {
      font-weight: 600;
      color: vars.$primary-dark;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid vars.$primary-green;
      font-size: 1.1rem;
      letter-spacing: -0.5px;
    }

    &-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    &-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 0.75rem;
      border-radius: vars.$border-radius;
      text-decoration: none;
      color: vars.$gray-700;
      transition: vars.$transition-normal;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: vars.$border-radius;
        background: vars.$gray-100;
        opacity: 0;
        transition: vars.$transition-normal;
      }
      
      img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        padding: 0.5rem;
        background: white;
        border: 1px solid vars.$gray-200;
        border-radius: vars.$border-radius;
        position: relative;
        z-index: 1;
        transition: vars.$transition-normal;
      }

      span {
        position: relative;
        z-index: 1;
        font-weight: 500;
      }

      &:hover {
        color: vars.$primary-green;
        transform: translateX(5px);

        &::before {
          opacity: 1;
        }

        img {
          border-color: vars.$primary-green;
          transform: scale(1.05);
        }
      }
    }
  }

  .menu-preview {
    background: vars.$gray-100;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(
        135deg,
        vars.$primary-dark,
        vars.$primary-green
      );
      opacity: 0.1;
    }

    img {
      max-width: 100%;
      height: 180px;
      object-fit: contain;
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 1;
      transition: vars.$transition-normal;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));

      &:hover {
        transform: translateY(-5px);
        filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.15));
      }
    }

    .preview-text {
      text-align: center;
      color: vars.$primary-dark;
      font-weight: 500;
      font-size: 0.9rem;
      position: relative;
      z-index: 1;
    }
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px) translateX(-50%);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0) translateX(-50%);
}

// 响应式设计
@media (max-width: 1024px) {
  .mega-menu {
    width: 95vw;
    min-width: 700px;
    
    .menu-content {
      grid-template-columns: 1fr;
    }
    
    .menu-preview {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .mega-menu {
    width: 100vw;
    min-width: auto;
    left: 0;
    transform: none;
    
    .menu-categories {
      grid-template-columns: 1fr;
    }
  }
}
</style> 