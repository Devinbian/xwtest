<template>
  <div class="page home">
    <!-- Hero Section -->
    <section class="hero" :style="{ backgroundImage: `url(${ASSETS.HOME.HERO})` }">
      <div class="hero-content">
        <h1>引领精密测量的未来</h1>
        <p>为您提供世界顶级仪器设备解决方案</p>
        <router-link to="/products" class="button outline">浏览产品</router-link>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="section bg-white">
      <div class="section-header">
        <h2>合作品牌</h2>
        <p>与全球顶尖仪器制造商深度合作</p>
      </div>
      <div class="section-content">
        <div class="brands-showcase">
          <swiper
            :slides-per-view="3"
            :breakpoints="{
              320: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30
              }
            }"
            :space-between="30"
            :loop="true"
            :modules="modules"
            :autoplay="{
              delay: 2500,
              disableOnInteraction: false,
            }"
          >
            <swiper-slide v-for="brand in brands" :key="brand.id">
              <div class="brand-card card">
                <img :src="brand.logo" :alt="brand.name">
                <h3>{{ brand.name }}</h3>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section">
      <div class="section-header">
        <h2>产品类别</h2>
        <p>专业的测试测量解决方案，满足您的各种需求</p>
      </div>
      <div class="section-content">
        <div class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card card"
            :style="{ backgroundImage: `url(${category.image})` }"
          >
            <div class="category-content">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <router-link :to="`/products?category=${category.name}`" class="button">
                了解更多
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section bg-white">
      <div class="section-header">
        <h2>我们的优势</h2>
        <p>为什么选择我们</p>
      </div>
      <div class="section-content">
        <div class="features-grid">
          <div class="feature-card card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ASSETS } from '@/constants/assets'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

gsap.registerPlugin(ScrollTrigger)

const modules = [Autoplay]

const brands = [
  { id: 1, name: 'KEYSIGHT', logo: ASSETS.HOME.BRANDS.KEYSIGHT },
  { id: 2, name: 'TEKTRONIX', logo: ASSETS.HOME.BRANDS.TEKTRONIX },
  { id: 3, name: 'FLUKE', logo: ASSETS.HOME.BRANDS.FLUKE }
]

const categories = [
  {
    id: 1,
    name: '示波器',
    description: '高精度波形测量与分析',
    image: ASSETS.PRODUCTS.ITEMS.OSCILLOSCOPES.MSO46.IMAGE
  },
  {
    id: 2,
    name: '电源设备',
    description: '稳定可靠的电源解决方案',
    image: ASSETS.PRODUCTS.ITEMS.POWER_SUPPLIES.E36312A.IMAGE
  },
  {
    id: 3,
    name: '万用表',
    description: '精确的电气参数测量工具',
    image: ASSETS.PRODUCTS.ITEMS.MULTIMETERS.FLUKE_87V.IMAGE
  }
]

const features = [
  {
    icon: '🌟',
    title: '品牌齐全',
    description: '与全球顶尖仪器制造商深度合作，提供最全面的产品选择'
  },
  {
    icon: '💯',
    title: '正品保障',
    description: '所有产品均为原厂正品，确保品质'
  },
  {
    icon: '🛠️',
    title: '技术支持',
    description: '专业的技术团队提供全方位的技术支持和服务'
  },
  {
    icon: '⚡',
    title: '快速响应',
    description: '24小时响应客户需求，提供及时的解决方案'
  }
]

onMounted(() => {
  // 添加滚动动画
  gsap.utils.toArray('.section').forEach((section: any) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1
      }
    })
  })
})
</script>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as mix;

.home {
  .brands-showcase {
    padding: 2rem 0;

    .swiper {
      padding: 1rem;
    }

    .swiper-slide {
      width: 300px;
    }

    .brand-card {
      padding: 2rem;
      text-align: center;

      img {
        height: 60px;
        width: auto;
        margin-bottom: 1rem;
        object-fit: contain;
      }

      h3 {
        color: vars.$primary-dark;
      }
    }
  }

  .categories-grid {
    @include mix.grid-auto-fit;

    .category-card {
      height: 400px;
      background-size: cover;
      background-position: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      }

      .category-content {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem;
        color: white;

        h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }
      }
    }
  }

  .features-grid {
    @include mix.grid-auto-fit;

    .feature-card {
      padding: 2rem;
      text-align: center;

      .feature-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h3 {
        color: vars.$primary-dark;
        margin-bottom: 1rem;
      }

      p {
        color: vars.$gray-600;
        line-height: 1.6;
      }
    }
  }
}
</style> 