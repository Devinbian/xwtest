<template>
  <div class="app-wrapper">
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
import TheNavigation from '@/components/TheNavigation.vue';
import TheFooter from '@/components/TheFooter.vue';
import PageTransition from '@/components/PageTransition.vue';
import BackToTop from '@/components/BackToTop.vue';
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
</style>
