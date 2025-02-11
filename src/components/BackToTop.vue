<template>
  <transition name="fade">
    <div 
      v-show="show" 
      class="back-to-top"
      @click="scrollToTop"
    >
      <div class="icon">↑</div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const show = ref(false)
const { y } = useWindowScroll()

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const checkScroll = () => {
  show.value = y.value > 300
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped lang="scss">
.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
  z-index: 1000;

  &:hover {
    transform: translateY(-3px);
  }

  .icon {
    font-size: 1.2rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 