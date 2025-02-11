<template>
  <div class="products">
    <div class="hero" :style="{ backgroundImage: `url(${ASSETS.PRODUCTS.HERO})` }">
      <h1>产品展示</h1>
      <p>专业的测试测量解决方案</p>
    </div>

    <div class="filters">
      <button 
        v-for="category in categories" 
        :key="category"
        :class="{ active: currentCategory === category }"
        @click="currentCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id"
        class="product-card"
      >
        <div v-lazy class="image-wrapper">
          <img :data-src="product.image" :alt="product.name">
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <div class="brand">{{ product.brand }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ASSETS } from '@/constants/assets'

const categories = ['全部', '示波器', '电源', '万用表', '信号发生器']
const currentCategory = ref('全部')

const products = [
  ASSETS.PRODUCTS.ITEMS.OSCILLOSCOPES.MSO46,
  ASSETS.PRODUCTS.ITEMS.OSCILLOSCOPES.TBS2000B,
  ASSETS.PRODUCTS.ITEMS.POWER_SUPPLIES.E36312A,
  ASSETS.PRODUCTS.ITEMS.MULTIMETERS.FLUKE_87V
]

const filteredProducts = computed(() => {
  if (currentCategory.value === '全部') return products
  return products.filter(p => p.category === currentCategory.value)
})
</script>

<style scoped lang="scss">
.products {
  padding-top: 60px;

  .hero {
    height: 40vh;
    background: linear-gradient(45deg, #2c3e50, #3498db);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  }

  .filters {
    padding: 2rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;

    button {
      padding: 0.5rem 1rem;
      border: none;
      background: #f5f5f5;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &.active {
        background: #2c3e50;
        color: white;
      }
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;

    .product-card {
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .image-wrapper {
        opacity: 0;
        transition: opacity 0.3s;
        
        &.loaded {
          opacity: 1;
        }
      }

      img {
        width: 100%;
        height: 200px;
        object-fit: contain;
        background: #f5f5f5;
      }

      .product-info {
        padding: 1rem;

        h3 {
          margin-bottom: 0.5rem;
        }

        .brand {
          margin-top: 1rem;
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .products {
    .hero {
      height: 30vh;

      h1 {
        font-size: 2rem;
      }
    }

    .products-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      padding: 1rem;
    }
  }
}
</style> 