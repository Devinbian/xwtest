<template>
  <div class="app-wrapper" :class="{ 'app-wrapper--products': route.name === 'products' }">
    <TheNavigation />
    <main class="main-content">
      <PageTransition>
        <router-view></router-view>
      </PageTransition>
    </main>
    <TheFooter />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import TheNavigation from '@/components/TheNavigation.vue';
import TheFooter from '@/components/TheFooter.vue';
import PageTransition from '@/components/PageTransition.vue';
import BackToTop from '@/components/BackToTop.vue';

const route = useRoute();
</script>

<style lang="scss">
@use '@/styles/index.scss' as *;

.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: var(--header-offset); // 为固定导航栏留出空间（动态高度）
}

@media (min-width: 769px) {
  // 产品页仅由左右列表滚动，避免外层页脚产生第二条页面滚动条。
  .app-wrapper--products {
    height: 100vh;
    height: 100dvh;
    min-height: 0;
    overflow: clip;

    > .main-content {
      min-height: 0;
      overflow: hidden;
    }

    > .site-footer,
    > .back-to-top {
      display: none;
    }
  }
}
</style>
