<template>
  <div ref="element" class="scroll-reveal" :class="{ visible }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const element = ref<HTMLElement | null>(null)
const visible = ref(false)

onMounted(() => {
  if (element.value) {
    const { stop } = useIntersectionObserver(
      element,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          visible.value = true
          stop()
        }
      },
      { threshold: 0.2 }
    )
  }
})
</script>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
</style> 