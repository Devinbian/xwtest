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
        <PartnerBrands variant="page" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import PartnerBrands from '@/components/PartnerBrands.vue'
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
