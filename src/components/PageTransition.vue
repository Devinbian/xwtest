<template>
  <transition
    name="page"
    mode="out-in"
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const beforeEnter = (el: Element) => {
  gsap.set(el, {
    opacity: 0,
    y: 20
  })
}

const enter = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    onComplete: done
  })
}

const beforeLeave = (el: Element) => {
  gsap.set(el, {
    opacity: 1,
    y: 0
  })
}

const leave = (el: Element, done: () => void) => {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    duration: 0.5,
    onComplete: done
  })
}

// 空函数以满足 TypeScript
const afterEnter = () => {}
const afterLeave = () => {}
</script>

<style lang="scss" scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style> 
