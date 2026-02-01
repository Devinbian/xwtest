<template>
  <div class="brands-page">
    <div class="page-hero">
      <div class="container">
        <h1>合作品牌</h1>
        <p>与全球顶尖仪器仪表品牌深度合作</p>
      </div>
    </div>

    <div class="container">
      <section class="partner-brands">
        <h2 class="section-title">合作品牌</h2>
        <div class="brands-wrapper">
          <div class="brands-scroll">
            <div class="brands-grid">
              <div v-for="brand in displayedBrands" :key="brand.name" class="brand-card">
                <div class="brand-logo">
                  <img :src="brand.logo" :alt="brand.name" loading="lazy" decoding="async">
                </div>
                <div class="brand-info">
                  <h3>{{ brand.name }}</h3>
                  <p>{{ brand.description }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <button v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }"
              @click="changePage(page)">
              {{ page }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { partners } from '@/data/home/partners.js'

// 分页相关
const currentPage = ref(1)
const brandsPerPage = 12 // 每页显示12个品牌

const totalPages = computed(() => Math.ceil(partners.length / brandsPerPage))

const displayedBrands = computed(() => {
  const start = (currentPage.value - 1) * brandsPerPage
  const end = start + brandsPerPage
  return partners.slice(start, end)
})

const changePage = (page: number) => {
  currentPage.value = page
}
</script>

<style lang="scss" scoped>
@use 'sass:color';

$primary-green: #83B735;
$primary-black: #333;

.brands-page {
  min-height: calc(100vh - 80px);
  padding-top: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-hero {
  background: linear-gradient(135deg, color.adjust($primary-green, $lightness: -10%), $primary-green);
  color: white;
  padding: 4rem 0;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: $primary-black;
  margin-bottom: 3rem;
  font-weight: 600;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -0.8rem;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: $primary-green;
    border-radius: 2px;
  }
}

.partner-brands {
  padding: 4rem 0;

  .brands-wrapper {
    .brands-scroll {
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      transition: transform 0.3s ease, opacity 0.3s ease;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .brand-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      transition: transform 0.3s ease, opacity 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

        .brand-logo img {
          transform: scale(1.05);
        }
      }

      .brand-logo {
        height: 60px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;

        img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
      }

      .brand-info {
        text-align: center;

        h3 {
          font-size: 1rem;
          color: $primary-black;
          margin-bottom: 0.5rem;
        }

        p {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;

    button {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background: #f5f5f5;
      color: #666;
      font-size: 1rem;
      cursor: pointer;
      transition: transform 0.3s ease, opacity 0.3s ease;

      &:hover {
        background: rgba($primary-green, 0.1);
        color: $primary-green;
      }

      &.active {
        background: $primary-green;
        color: white;
      }
    }
  }
}

@media (max-width: 768px) {
  .page-hero {
    padding: 3rem 1rem;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
}
</style>
