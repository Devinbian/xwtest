<template>
  <transition
    name="page"
    mode="out-in"
    @before-leave="beforeLeave"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <slot></slot>
  </transition>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const beforeLeave = (el: Element) => {
  gsap.to(el, {
    opacity: 0,
    y: 30,
    duration: 0.3
  })
}

const enter = (el: Element, done: () => void) => {
  gsap.fromTo(
    el,
    {
      opacity: 0,
      y: 30
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      onComplete: done
    }
  )
}

const afterEnter = (el: Element) => {
  gsap.set(el, { clearProps: 'all' })
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  position: absolute;
  width: 100%;
}
</style> 