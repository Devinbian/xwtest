import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/products',
      component: () => import('../views/Products.vue')
    },
    {
      path: '/products/:id',
      component: () => import('../views/ProductDetail.vue')
    },
    {
      path: '/brands',
      component: () => import('../views/Brands.vue')
    },
    {
      path: '/about',
      component: () => import('../views/About.vue')
    }
  ]
})

export default router 