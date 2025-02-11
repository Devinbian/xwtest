<template>
  <div class="app">
    <loading-spinner :loading="isLoading" />
    <main-nav />
    
    <page-transition>
      <router-view></router-view>
    </page-transition>

    <main-footer />
    <back-to-top />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageTransition from './components/PageTransition.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import MainNav from './components/MainNav.vue'
import MainFooter from '@/components/MainFooter.vue'

const isLoading = ref(false)
const router = useRouter()

router.beforeEach(() => {
  isLoading.value = true
})

router.afterEach(() => {
  isLoading.value = false
})
</script>

<style scoped lang="scss">
.app {
  .main-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    gap: 2rem;
    justify-content: center;
    z-index: 100;

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      
      .nav-links {
        display: flex;
        gap: 2rem;
      }
      
      .nav-search {
        margin-left: 2rem;
      }
    }

    a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;

      &:hover {
        color: #000;
      }

      &.router-link-active {
        color: #000;
        font-weight: 600;
      }
    }
  }
}

@media (max-width: 768px) {
  .app {
    .main-nav {
      .nav-content {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        
        .nav-search {
          margin-left: 0;
          width: 100%;
        }
      }
    }
  }
}
</style> 