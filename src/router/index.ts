import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '@/views/Products.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/products',
    name: 'products',
    component: Products
  },
  {
    path: '/shop',
    name: 'Shop',
    component: () => import('../views/Shop.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
}) 
