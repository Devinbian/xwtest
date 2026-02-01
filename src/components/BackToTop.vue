<template>
  <Transition name="fade">
    <button v-show="show" class="back-to-top" @click="scrollToTop" :title="'返回顶部'">
      <i class="fas fa-arrow-up"></i>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const show = ref(false);
const scrollThreshold = 300; // 显示按钮的滚动阈值

// 检查滚动位置
const checkScroll = () => {
  show.value = window.scrollY > scrollThreshold;
};

// 平滑滚动到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

// 移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../styles/variables' as vars;

.back-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: vars.$primary-green;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, opacity 0.3s ease;

  // 移动端适配
  @media (max-width: 768px) {
    right: 20px;
    bottom: 80px; // 避免遮挡底部导航
    width: 40px;
    height: 40px;
  }

  i {
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    background: color.adjust(vars.$primary-green, $lightness: -5%);
  }

  &:active {
    transform: translateY(0);
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 
