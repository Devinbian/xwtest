<template>
  <div class="hero-section" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
    <div class="hero-slider" ref="slider">
      <div v-for="(slide, index) in slides" :key="index" class="hero-slide"
        :class="{ 'active': currentSlide === index, 'prev': isPrevSlide(index), 'next': isNextSlide(index) }">
        <div class="slide-background">
          <LazyImage :src="slide.image" :placeholder="slide.imagePlaceholder" :alt="slide.title" />
        </div>
        <div class="slide-content">
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.description }}</p>
          <router-link :to="slide.link" class="cta-button">
            {{ slide.buttonText }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="slider-controls">
      <button class="prev" @click="prevSlide">‹</button>
      <div class="dots">
        <span v-for="(_, index) in slides" :key="index" :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"></span>
      </div>
      <button class="next" @click="nextSlide">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getAssetUrl } from '@/utils/assets';
import { generatePlaceholderUrl } from '@/utils/image';
import LazyImage from '@/components/LazyImage.vue';

const slides = [
  {
    title: '创新测量方案',
    description: '为您提供专业精准的仪器仪表解决方案',
    image: getAssetUrl('images/hero/slide1.png'),
    imagePlaceholder: generatePlaceholderUrl(getAssetUrl('images/hero/slide1.png')),
    link: '/products',
    buttonText: '了解更多'
  },
  {
    title: '全方位技术支持',
    description: '专业团队为您提供完整的技术支持与服务',
    image: getAssetUrl('images/hero/slide2.jpg'),
    imagePlaceholder: generatePlaceholderUrl(getAssetUrl('images/hero/slide2.jpg')),
    link: '/services',
    buttonText: '查看服务'
  },
  {
    title: '行业领先品牌',
    description: '与全球顶尖仪器仪表品牌深度合作',
    image: getAssetUrl('images/hero/slide3.png'),
    imagePlaceholder: generatePlaceholderUrl(getAssetUrl('images/hero/slide3.png')),
    link: '/brands',
    buttonText: '品牌介绍'
  }
];

const slider = ref<HTMLElement | null>(null);
const currentSlide = ref(0);
let autoplayInterval: number;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
  preloadNextSlide();
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const startAutoplay = () => {
  stopAutoplay();
  autoplayInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
};

const pauseAutoplay = () => {
  stopAutoplay();
};

const resumeAutoplay = () => {
  startAutoplay();
};

const isPrevSlide = (index: number) => {
  if (currentSlide.value === 0 && index === slides.length - 1) return true;
  return index === currentSlide.value - 1;
};

const isNextSlide = (index: number) => {
  if (currentSlide.value === slides.length - 1 && index === 0) return true;
  return index === currentSlide.value + 1;
};

const preloadImages = () => {
  slides.forEach(slide => {
    const img = new Image();
    img.src = slide.image;
  });
};

const preloadNextSlide = () => {
  const nextIndex = (currentSlide.value + 1) % slides.length;
  const img = new Image();
  img.src = slides[nextIndex].image;
};

onMounted(() => {
  preloadImages();
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  height: calc(100vh - 80px);
  overflow: hidden;
  background: #000;
}

.hero-slider {
  position: relative;
  height: 100%;
}

.hero-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scale(1.05);
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  visibility: visible;
  z-index: 1;

  &.active {
    opacity: 1;
    transform: scale(1);
    z-index: 2;

    .slide-content {
      opacity: 1;
      transform: translateY(0);
    }

    &::before {
      opacity: 0.4;
    }
  }

  &.prev,
  &.next {
    opacity: 0;
    z-index: 1;
    transform: scale(1.05);
    pointer-events: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.6s ease;
  }

  .slide-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    :deep(.lazy-image) {
      width: 100%;
      height: 100%;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(to top,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0) 60%);
        opacity: 0.5;
        z-index: 1;
      }
    }
  }

  .slide-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    color: white;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
    will-change: transform, opacity;

    h2 {
      font-size: 3.5rem;
      font-weight: 300;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .cta-button {
      display: inline-block;
      padding: 1rem 2.5rem;
      background: var(--primary-color);
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background: var(--primary-color-dark);
        transform: translateY(-2px);
      }
    }
  }

  @media (max-width: 768px) {
    .slide-background {
      :deep(.lazy-image) {
        img {
          object-position: center;
        }
      }
    }

    .slide-content {
      padding: 0 1rem;
      text-align: center;

      h2 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }

      .cta-button {
        padding: 0.8rem 2rem;
        font-size: 1rem;
      }
    }
  }
}

.slider-controls {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  z-index: 3;

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  .dots {
    display: flex;
    gap: 0.8rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2rem;
    backdrop-filter: blur(4px);

    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;

      &.active {
        background: white;
        transform: scale(1.2);
      }

      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
