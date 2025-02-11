<template>
  <div class="brands-page">
    <div class="hero" :style="{ backgroundImage: `url(${ASSETS.BRANDS.HERO})` }">
      <h1>合作品牌</h1>
      <p>与全球顶尖仪器制造商深度合作</p>
    </div>

    <div class="brands-grid">
      <div v-for="brand in brands" :key="brand.id" class="brand-card">
        <div class="brand-logo">
          <img :src="brand.logo" :alt="brand.name">
        </div>
        <div class="brand-info">
          <h3>{{ brand.name }}</h3>
          <p>{{ brand.description }}</p>
          <div class="product-count">{{ brand.productCount }}+ 产品</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ASSETS } from '@/constants/assets'

const brands = [
  {
    id: 1,
    name: 'KEYSIGHT',
    logo: ASSETS.BRANDS.KEYSIGHT.LOGO,
    banner: ASSETS.BRANDS.KEYSIGHT.BANNER,
    description: '是德科技是全球领先的电子测量公司，提供尖端的测试和测量解决方案。',
    productCount: 200
  },
  {
    id: 2,
    name: 'FLUKE',
    logo: 'https://www.fluke.com/images/fluke-logo.png',
    description: '福禄克是电子测试工具和软件的全球领导者，为工业维护、安装和服务提供解决方案。',
    productCount: 150
  },
  {
    id: 3,
    name: 'HIOKI',
    logo: 'https://www.hioki.com/global/images/common/logo.png',
    description: '日置电机创立于1935年，专注于电气测量仪器的研发和制造。',
    productCount: 100
  },
  {
    id: 4,
    name: 'TEKTRONIX',
    logo: 'https://www.tek.com/content/dam/tektronix/images/tektronix-logo.svg',
    description: '泰克科技是示波器和视频测试设备的全球领导者。',
    productCount: 180
  },
  {
    id: 5,
    name: 'YOKOGAWA',
    logo: 'https://www.yokogawa.com/public/img/logo_yokogawa.png',
    description: '横河电机在测量、控制和信息领域提供创新的产品和服务。',
    productCount: 120
  },
  {
    id: 6,
    name: 'RIGOL',
    logo: 'https://www.rigol.com/images/logo.png',
    description: '普源精电是中国领先的测试测量仪器制造商。',
    productCount: 90
  }
]
</script>

<style scoped lang="scss">
.brands-page {
  padding-top: 60px;

  .hero {
    height: 40vh;
    background: linear-gradient(45deg, #1a237e, #0d47a1);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 1rem;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;

    .brand-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }

      .brand-logo {
        height: 150px;
        padding: 2rem;
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
        }
      }

      .brand-info {
        padding: 1.5rem;

        h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }

        p {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .product-count {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #e3f2fd;
          color: #1976d2;
          border-radius: 20px;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .brands-page {
    .hero {
      height: 30vh;
      
      h1 {
        font-size: 2rem;
      }
      
      p {
        font-size: 1rem;
      }
    }

    .brands-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      padding: 1rem;
      gap: 1rem;
    }
  }
}
</style> 