<template>
  <div class="home">
    <HomeHero />

    <!-- 合作品牌板块 -->
    <section ref="partnersSectionEl" class="partners-section">
      <div class="container">
        <h2 class="section-title">合作品牌</h2>
        <div v-if="renderPartners" class="partners-slider" @mouseenter="handlePartnerMouseEnter" @mouseleave="handlePartnerMouseLeave">
          <div class="slider-wrapper" ref="partnerSliderWrapper"
            :style="{ transform: `translateX(${-currentPartnerSlide * 100}%)` }">
            <div class="partner-slide" v-for="(group, index) in partnerGroups" :key="index">
              <div class="partners-grid">
                <div v-for="partner in group" :key="partner.id" class="partner-card"
                  :class="{ 'empty-card': partner.isEmpty }">
                  <a v-if="!partner.isEmpty" :href="partner.website" target="_blank" class="card-content">
                      <div class="card-inner">
                        <div class="logo-wrapper">
                        <img :src="partner.logo" :alt="partner.name" loading="lazy" decoding="async" />
                      </div>
                      <div class="card-glow"></div>
                      <div class="card-border"></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="slider-nav prev"
            aria-label="上一组品牌"
            @click="prevPartnerSlide"
            :disabled="currentPartnerSlide === 0"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            type="button"
            class="slider-nav next"
            aria-label="下一组品牌"
            @click="nextPartnerSlide"
            :disabled="currentPartnerSlide === partnerGroups.length - 1"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
          <div class="slider-dots">
            <button
              v-for="(_, index) in partnerGroups"
              :key="index"
              type="button"
              class="dot"
              :class="{ active: currentPartnerSlide === index }"
              :aria-label="`切换到第 ${index + 1} 组品牌`"
              :aria-current="currentPartnerSlide === index ? 'true' : undefined"
              @click="goToPartnerSlide(index)"
            />
          </div>
        </div>
        <div v-else class="section-placeholder" aria-hidden="true"></div>
      </div>
    </section>

    <!-- 八大行业板块 -->
    <section ref="industriesSectionEl" class="industries-section">
      <div class="container-fluid">
        <h2 class="section-title">八大行业解决方案</h2>
        <div v-if="renderIndustries" class="industries-slider">
          <div v-for="(industry, index) in industries" :key="industry.id" class="slider-item"
            @mouseenter="activeIndustry = index" @mouseleave="activeIndustry = null"
            @touchstart="(e) => handleIndustryTouchStart(e, index)" @touchend="handleIndustryTouchEnd"
            @touchcancel="handleIndustryTouchCancel">
            <div class="slider-bg">
              <LazyPicture :src="industry.image" :placeholder="generatePlaceholderUrl(industry.image)" :alt="industry.name" />
              <div class="slider-content">
                <h3>{{ industry.name }}</h3>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="section-placeholder" aria-hidden="true"></div>
      </div>
    </section>

    <!-- 主营产品板块 -->
    <section ref="mainProductsSectionEl" class="main-products-section">
      <div class="container">
        <h2 class="section-title">主营产品</h2>
        <div v-if="renderMainProducts" class="products-grid">
          <div v-for="category in productCategories" :key="category.id" class="product-category">
            <div class="category-inner" @touchstart="(e) => handleTouchStart(e.currentTarget)"
              @touchend="(e) => handleTouchEnd(e.currentTarget)" @touchcancel="(e) => handleTouchEnd(e.currentTarget)">
              <div class="category-header">
                <div class="header-content">
                  <span class="category-number">0{{ category.id }}</span>
                  <h3>{{ category.name }}</h3>
                </div>
                <div class="tech-line"></div>
              </div>
              <div class="category-content">
                <div class="items-wrapper">
                  <div v-for="(item, index) in category.items" :key="index" class="item-card">
                    <div class="item-inner">
                      <span class="item-dot"></span>
                      <span class="item-text">{{ item }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="section-placeholder" aria-hidden="true"></div>
      </div>
    </section>

    <section ref="servicesSectionEl" class="services-section">
      <div class="container">
	        <h2 class="section-title">我们的服务</h2>
	        <div v-if="renderServices" class="services-grid">
	          <div v-for="service in services" :key="service.id" class="service-card"
	            @touchstart="(e) => handleTouchStart(e.currentTarget)" @touchend="(e) => handleTouchEnd(e.currentTarget)"
	            @touchcancel="(e) => handleTouchEnd(e.currentTarget)">
	            <i class="service-decor" :class="service.icon" aria-hidden="true"></i>
	            <div class="service-icon">
	              <i :class="service.icon"></i>
	            </div>
	            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <div class="service-features">
              <ul>
                <li v-for="(feature, index) in service.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-else class="section-placeholder" aria-hidden="true"></div>
      </div>
    </section>

    <!-- 热门产品板块 -->
    <section ref="featuredSectionEl" class="featured-products">
      <div class="container">
        <h2 class="section-title">热门产品</h2>
        <div
          v-if="renderFeatured && featuredProducts.length > 0"
          class="products-slider"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div class="slider-wrapper" ref="sliderWrapper" :style="{ transform: `translateX(${-currentSlide * 100}%)` }">
            <div v-for="product in featuredProducts" :key="product.id" class="product-slide">
              <div class="product-content">
                <div class="product-image">
                  <LazyPicture :src="product.image" :placeholder="generatePlaceholderUrl(product.image)" :alt="product.title" />
                </div>
                <div class="product-info">
                  <span class="product-brand">{{ product.brand }}</span>
                  <h3 class="product-title">{{ product.title }}</h3>
                  <p class="product-description">{{ product.description }}</p>
                  <button type="button" class="product-link" :aria-label="`了解更多：${product.title}`"
                    @click="goToProduct(product.brand)">
                    了解更多
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" class="slider-nav prev" aria-label="上一项热门产品" @click="prevSlide"
            :disabled="currentSlide === 0">
            <span>←</span>
          </button>
          <button type="button" class="slider-nav next" aria-label="下一项热门产品" @click="nextSlide"
            :disabled="currentSlide === featuredProducts.length - 1">
            <span>→</span>
          </button>
          <div class="slider-dots">
            <button
              v-for="(_, index) in featuredProducts"
              :key="index"
              type="button"
              class="dot"
              :class="{ active: currentSlide === index }"
              :aria-label="`切换到第 ${index + 1} 个热门产品`"
              :aria-current="currentSlide === index ? 'true' : undefined"
              @click="goToSlide(index)"
            />
          </div>
        </div>
        <div v-else-if="renderFeatured" class="featured-empty">
          暂无热门产品
        </div>
        <div v-else class="section-placeholder" aria-hidden="true"></div>
      </div>
    </section>

    <section ref="ctaSectionEl" class="cta-section">
      <div class="container">
        <div v-if="renderCta" class="cta-wrapper">
          <div class="cta-content">
            <div class="cta-header">
              <span class="section-tag">专业支持</span>
              <h2>需要专业建议？</h2>
              <p class="cta-description">
                专业的技术团队为您提供全方位的解决方案，从技术咨询到售后服务，我们始终与您同在
              </p>
            </div>

            <div class="cta-features">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12,15C7.58,15 4,16.79 4,19V21H20V19C20,16.79 16.42,15 12,15M8,9A4,4 0 0,0 12,13A4,4 0 0,0 16,9M11.5,2C11.2,2 11,2.21 11,2.5V5.5H10V3C10,2.45 10.45,2 11,2H13C13.55,2 14,2.45 14,3V5.5H13V2.5C13,2.21 12.8,2 12.5,2H11.5Z" />
                  </svg>
                </div>
                <div class="feature-text">
                  <h4>技术专家团队</h4>
                  <p>资深工程师提供专业技术支持</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8" />
                  </svg>
                </div>
                <div class="feature-text">
                  <h4>24小时响应</h4>
                  <p>快速响应您的紧急需求</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z" />
                  </svg>
                </div>
                <div class="feature-text">
                  <h4>定制化方案</h4>
                  <p>根据需求提供个性化解决方案</p>
                </div>
              </div>
            </div>

            <div class="cta-actions">
              <!-- 左侧联系信息 -->
              <div class="contact-left">
                <!-- 服务热线 -->
                <div class="contact-item">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                    </svg>
                  </div>
                  <div class="contact-info">
                    <span class="label">服务热线</span>
                    <strong class="value">186-6258-5852</strong>
                  </div>
                </div>

                <!-- 邮箱咨询 -->
                <div class="contact-item">
                  <div class="contact-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                    </svg>
                  </div>
                  <div class="contact-info">
                    <span class="label">邮件咨询</span>
                    <strong class="value">sales@xwtest.com.cn</strong>
                  </div>
                </div>

                <!-- 咨询按钮 -->
                <router-link to="/contact" class="cta-button">
                  立即咨询
                  <svg viewBox="0 0 24 24" fill="currentColor" class="arrow-icon">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                  </svg>
                </router-link>
              </div>

              <!-- 右侧二维码 -->
              <div class="contact-right">
                <div class="contact-qr">
                  <img :src="getAssetUrl('/images/qrcode.png')" alt="扫码咨询" loading="lazy" decoding="async">
                  <span>扫码添加客服</span>
                </div>
              </div>
            </div>
          </div>

          <div class="cta-image">
            <LazyPicture
              :src="getAssetUrl('/images/support-team.jpg')"
              :placeholder="generatePlaceholderUrl(getAssetUrl('/images/support-team.jpg'))"
              alt="专业支持团队"
            />
            <div class="image-overlay">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">15<span>年</span></div>
                  <div class="stat-label">行业经验</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">2000<span>+</span></div>
                  <div class="stat-label">服务客户</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">24<span>h</span></div>
                  <div class="stat-label">响应时间</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="section-placeholder" aria-hidden="true"></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HomeHero from '@/components/HomeHero.vue';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAssetUrl } from '@/utils/assets';
import LazyPicture from '@/components/LazyPicture.vue';
import { generatePlaceholderUrl } from '@/utils/image';
import { HOT_PRODUCTS_CHANGED_EVENT, applyHotOverrides, fetchHotConfig } from '@/utils/hotProducts';

import { partners } from '../data/home/partners.js';
//获取八大行业数据
import { industries } from '../data/home/industries.js';
//获取主营产品
import {productCategories} from '../data/home/productCategories.js'
//获取我们的服务
import {services} from '../data/home/services.js'
// @ts-ignore
import { products } from '../data/products/products.js';

const router = useRouter();

type FeaturedProduct = {
  id: number;
  title: string;
  image: string;
  brand: string;
  description: string;
};

type ProductSource = {
  id: number;
  name: string;
  image: string;
  description: string;
  brand?: string;
  brandDisplay?: string;
  isHot?: boolean;
  hotRank?: number;
};

const toFeaturedProduct = (p: ProductSource): FeaturedProduct => ({
  id: p.id,
  title: p.name,
  image: p.image,
  brand: p.brandDisplay ?? p.brand ?? '',
  description: p.description,
});

const hotConfig = ref<{ overrides: Record<string, { isHot?: boolean; hotRank?: number | null }>; disableAllHot: boolean }>({
  overrides: {},
  disableAllHot: false,
});

const loadHotOverrides = async () => {
  const cfg = await fetchHotConfig();
  hotConfig.value = { overrides: cfg.overrides ?? {}, disableAllHot: cfg.disableAllHot === true };
};

const pickFeaturedProducts = (): FeaturedProduct[] => {
  const list = applyHotOverrides(
    products as ProductSource[],
    hotConfig.value.overrides,
    hotConfig.value.disableAllHot,
  ).slice();
  const hot = list
    .filter((p) => typeof p.hotRank === 'number' || p.isHot)
    .sort((a, b) => {
      const ar = typeof a.hotRank === 'number' ? a.hotRank : Number.POSITIVE_INFINITY;
      const br = typeof b.hotRank === 'number' ? b.hotRank : Number.POSITIVE_INFINITY;
      if (ar !== br) return ar - br;
      return a.id - b.id;
    })
    .slice(0, 10)
    .map(toFeaturedProduct);

  if (hot.length) return hot;
  if (hotConfig.value.disableAllHot) return [];
  return list.slice(0, 10).map(toFeaturedProduct);
};

const featuredProducts = computed<FeaturedProduct[]>(() => {
  hotConfig.value;
  return pickFeaturedProducts();
});

const activeIndustry = ref<number | null>(null);

const partnersSectionEl = ref<HTMLElement | null>(null);
const industriesSectionEl = ref<HTMLElement | null>(null);
const mainProductsSectionEl = ref<HTMLElement | null>(null);
const servicesSectionEl = ref<HTMLElement | null>(null);
const featuredSectionEl = ref<HTMLElement | null>(null);
const ctaSectionEl = ref<HTMLElement | null>(null);

const renderPartners = ref(false);
const renderIndustries = ref(false);
const renderMainProducts = ref(false);
const renderServices = ref(false);
const renderFeatured = ref(false);
const renderCta = ref(false);

const partnersInView = ref(false);
const featuredInView = ref(false);

const prefersReducedMotion = ref(false);

const currentSlide = ref(0);

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const nextSlide = () => {
  if (currentSlide.value < featuredProducts.value.length - 1) {
    currentSlide.value++;
  }
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

// 自动播放相关逻辑
const autoPlayInterval = ref<number | null>(null);
const isHovering = ref(false);

const startAutoPlay = () => {
  if (autoPlayInterval.value) return;
  autoPlayInterval.value = window.setInterval(() => {
    if (!isHovering.value) {
      if (currentSlide.value < featuredProducts.value.length - 1) {
        currentSlide.value++;
      } else {
        currentSlide.value = 0;
      }
    }
  }, 5000); // 每5秒切换一次
};

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
    autoPlayInterval.value = null;
  }
};

// 鼠标悬停时暂停自动播放
const handleMouseEnter = () => {
  isHovering.value = true;
};

const handleMouseLeave = () => {
  isHovering.value = false;
};

watch([renderFeatured, featuredInView, prefersReducedMotion], ([mounted, visible, reduce]) => {
  if (!mounted) return;
  if (reduce || !visible) stopAutoPlay();
  else startAutoPlay();
});

watch(featuredProducts, (nextList) => {
  if (currentSlide.value > nextList.length - 1) currentSlide.value = 0;
});

// 在 script setup 中添加
const handleTouchStart = (element: HTMLElement) => {
  element.classList.add('active');
};

const handleTouchEnd = (element: HTMLElement) => {
  element.classList.remove('active');
};

// 跳转到产品页面并显示对应分类
const goToCategory = (categoryId: number) => {
  router.push({
    path: '/products',
    query: {
      categories: String(categoryId)
    }
  });
};

// 跳转到产品页面并显示对应品牌的产品
const goToProduct = (brand: string) => {
  // 热门产品通过品牌名称跳转
  router.push({
    path: '/products',
    query: {
      brand: brand
    }
  });
};

const handleIndustryTouchStart = (e: TouchEvent, index: number) => {
  // 移除 preventDefault，允许页面滚动
  activeIndustry.value = index;
  const element = e.currentTarget as HTMLElement;
  element.classList.add('touch-active');
};

const handleIndustryTouchEnd = (e: TouchEvent) => {
  activeIndustry.value = null;
  const element = e.currentTarget as HTMLElement;
  element.classList.remove('touch-active');
};

const handleIndustryTouchCancel = (e: TouchEvent) => {
  activeIndustry.value = null;
  const element = e.currentTarget as HTMLElement;
  element.classList.remove('touch-active');
};

// 修改分组逻辑，每组显示10个品牌
const partnerGroups = computed(() => {
  const groups = [];
  const itemsPerGroup = 10; // 改为每组10个品牌，匹配 5x2 的网格布局
  for (let i = 0; i < partners.length; i += itemsPerGroup) {
    const group = partners.slice(i, i + itemsPerGroup);
    // 如果最后一组不足10个，用空对象填充以保持布局
    if (group.length < itemsPerGroup) {
      const padding = Array(itemsPerGroup - group.length).fill({
        id: `empty-${i}`,
        name: '',
        logo: '',
        website: '',
        isEmpty: true // 标记为空卡片
      });
      group.push(...padding);
    }
    groups.push(group);
  }
  return groups;
});

// 合作品牌轮播相关
const currentPartnerSlide = ref(0);
const partnerAutoPlayInterval = ref<number | null>(null);
const isPartnerHovering = ref(false);

const prevPartnerSlide = () => {
  if (currentPartnerSlide.value > 0) {
    currentPartnerSlide.value--;
  }
};

const nextPartnerSlide = () => {
  if (currentPartnerSlide.value < partnerGroups.value.length - 1) {
    currentPartnerSlide.value++;
  }
};

const goToPartnerSlide = (index: number) => {
  currentPartnerSlide.value = index;
};

const startPartnerAutoPlay = () => {
  if (partnerAutoPlayInterval.value) return;
  partnerAutoPlayInterval.value = window.setInterval(() => {
    if (!isPartnerHovering.value) {
      if (currentPartnerSlide.value < partnerGroups.value.length - 1) {
        currentPartnerSlide.value++;
      } else {
        currentPartnerSlide.value = 0;
      }
    }
  }, 9000);
};

const stopPartnerAutoPlay = () => {
  if (partnerAutoPlayInterval.value) {
    clearInterval(partnerAutoPlayInterval.value);
    partnerAutoPlayInterval.value = null;
  }
};

const handlePartnerMouseEnter = () => {
  isPartnerHovering.value = true;
};

const handlePartnerMouseLeave = () => {
  isPartnerHovering.value = false;
};

watch([renderPartners, partnersInView, prefersReducedMotion], ([mounted, visible, reduce]) => {
  if (!mounted) return;
  if (reduce || !visible) stopPartnerAutoPlay();
  else startPartnerAutoPlay();
});

let revealObserver: IntersectionObserver | null = null;
let visibilityObserver: IntersectionObserver | null = null;
let tiltRaf = 0;
let lastTiltEvent: MouseEvent | null = null;
let tiltCard: HTMLElement | null = null;
let tiltEnabled = false;

const resetTilt = (card: HTMLElement) => {
  card.style.setProperty('--rotate-x', '0');
  card.style.setProperty('--rotate-y', '0');
};

const handleTiltMove = (e: MouseEvent) => {
  lastTiltEvent = e;
  if (tiltRaf) return;
  tiltRaf = requestAnimationFrame(() => {
    tiltRaf = 0;
    if (!tiltEnabled) return;
    if (!lastTiltEvent) return;
    const target = lastTiltEvent.target as HTMLElement | null;
    const card = target?.closest?.('.partner-card') as HTMLElement | null;
    if (!card || card.classList.contains('empty-card')) {
      if (tiltCard) resetTilt(tiltCard);
      tiltCard = null;
      return;
    }

    if (tiltCard && tiltCard !== card) resetTilt(tiltCard);
    tiltCard = card;

    const rect = card.getBoundingClientRect();
    const x = lastTiltEvent.clientX - rect.left;
    const y = lastTiltEvent.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.setProperty('--rotate-x', rotateX.toString());
    card.style.setProperty('--rotate-y', rotateY.toString());
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  });
};

const handleTiltLeave = () => {
  if (tiltCard) resetTilt(tiltCard);
  tiltCard = null;
};

const setupPartnerTilt = () => {
  const root = partnersSectionEl.value;
  if (!root) return;
  if (!tiltEnabled) return;
  root.addEventListener('mousemove', handleTiltMove);
  root.addEventListener('mouseleave', handleTiltLeave);
};

const teardownPartnerTilt = () => {
  const root = partnersSectionEl.value;
  if (root) {
    root.removeEventListener('mousemove', handleTiltMove);
    root.removeEventListener('mouseleave', handleTiltLeave);
  }
  if (tiltRaf) cancelAnimationFrame(tiltRaf);
  tiltRaf = 0;
  lastTiltEvent = null;
  if (tiltCard) resetTilt(tiltCard);
  tiltCard = null;
};

watch([renderPartners, partnersInView, prefersReducedMotion], ([mounted, visible, reduce]) => {
  if (!mounted || reduce || !visible) {
    teardownPartnerTilt();
    return;
  }
  setupPartnerTilt();
});

const mountWhenNearViewport = () => {
  if (!('IntersectionObserver' in window)) {
    renderPartners.value = true;
    renderIndustries.value = true;
    renderMainProducts.value = true;
    renderServices.value = true;
    renderFeatured.value = true;
    renderCta.value = true;
    partnersInView.value = true;
    featuredInView.value = true;
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;

        if (el === partnersSectionEl.value) renderPartners.value = true;
        else if (el === industriesSectionEl.value) renderIndustries.value = true;
        else if (el === mainProductsSectionEl.value) renderMainProducts.value = true;
        else if (el === servicesSectionEl.value) renderServices.value = true;
        else if (el === featuredSectionEl.value) renderFeatured.value = true;
        else if (el === ctaSectionEl.value) renderCta.value = true;

        revealObserver?.unobserve(el);
      }
    },
    { root: null, rootMargin: '280px 0px', threshold: 0.01 },
  );

  const revealEls = [
    partnersSectionEl.value,
    industriesSectionEl.value,
    mainProductsSectionEl.value,
    servicesSectionEl.value,
    featuredSectionEl.value,
    ctaSectionEl.value,
  ].filter(Boolean) as HTMLElement[];

  revealEls.forEach((el) => revealObserver?.observe(el));

  visibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (el === partnersSectionEl.value) partnersInView.value = entry.isIntersecting;
        if (el === featuredSectionEl.value) featuredInView.value = entry.isIntersecting;
      }
    },
    { root: null, threshold: 0.12 },
  );

  if (partnersSectionEl.value) visibilityObserver.observe(partnersSectionEl.value);
  if (featuredSectionEl.value) visibilityObserver.observe(featuredSectionEl.value);
};

onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  prefersReducedMotion.value = reduce;

  loadHotOverrides();
  window.addEventListener(HOT_PRODUCTS_CHANGED_EVENT, loadHotOverrides);

  const canHover =
    (window.matchMedia?.('(hover: hover) and (pointer: fine)')?.matches ?? false) &&
    !prefersReducedMotion.value;
  tiltEnabled = canHover;

  mountWhenNearViewport();
});

onUnmounted(() => {
  window.removeEventListener(HOT_PRODUCTS_CHANGED_EVENT, loadHotOverrides);
  stopAutoPlay();
  stopPartnerAutoPlay();
  revealObserver?.disconnect();
  visibilityObserver?.disconnect();
  revealObserver = null;
  visibilityObserver = null;
  teardownPartnerTilt();
});
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use 'sass:map';
@use '../styles/variables' as vars;
// 更新背景色变量
$bg-gradients: (
  hero: (start: #000000,
    end: #111111),
  industries: (start: #ffffff,
    end: #f8f9fa),
  products: (start: #111111,
    end: #000000),
  brands: (start: #f8f9fa,
    end: #ffffff),
  featured: (start: #000000,
    end: #111111),
  cta: (start: #ffffff,
    end: #f8f9fa)
);

// 主题色变量
$primary-green: #83B735;
$primary-black: #000000;

.section-placeholder {
  width: 100%;
  min-height: 240px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, rgba($primary-green, 0.06), rgba(0, 0, 0, 0.02));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.25) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(-60%);
    animation: placeholder-sweep 1.6s ease-in-out infinite;
  }
}

@keyframes placeholder-sweep {
  0% {
    transform: translateX(-60%);
  }
  100% {
    transform: translateX(60%);
  }
}

// 更新 section-background mixin
@mixin section-background {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba($primary-green, 0.03) 0%, transparent 70%),
      radial-gradient(circle at 80% 80%, rgba($primary-green, 0.03) 0%, transparent 70%);
    pointer-events: none;
  }
}

// 更新过渡效果
@mixin section-transition {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to bottom,
        transparent,
        var(--next-section-color));
    opacity: 0.8;
  }
}

// 更新装饰线条
@mixin decorative-lines {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 100px;
    background: linear-gradient(to bottom,
        transparent,
        rgba($primary-green, 0.2),
        transparent);
  }
}

// 更新侧边装饰
.industries-section,
.main-products-section,
.featured-brands,
.featured-products,
.cta-section {
  &::before {
    background: linear-gradient(to bottom,
        transparent,
        rgba(255, 255, 255, 0.03),
        transparent);
  }

  &::after {
    background: linear-gradient(to bottom,
        transparent,
        rgba(255, 255, 255, 0.03),
        transparent);
  }
}

// 应用到各个section
.industries-section,
.main-products-section,
.featured-brands,
.featured-products,
.cta-section {
  @include section-background;
  @include section-transition;
  @include decorative-lines;
  position: relative;
  padding: var(--space-16) 0;
  margin-top: -2px;

  // 添加侧边装饰
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom,
        transparent,
        rgba(255, 255, 255, 0.02),
        transparent);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom,
        transparent,
        rgba(255, 255, 255, 0.02),
        transparent);
  }
}

// 更新移动端样式
@media (max-width: 768px) {

  .industries-section,
  .main-products-section,
  .featured-brands,
  .featured-products,
  .cta-section {
    padding: var(--space-8) 0;

    &::before,
    &::after {
      height: 60px;
    }
  }
}

// 更新标题样式
@mixin section-title {
  color: var(--section-text-color, #000000);
  text-align: center;
  font-size: var(--text-3xl);
  margin-bottom: var(--space-10);
  font-weight: 300;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  letter-spacing: 2px;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg,
        transparent,
        rgba($primary-green, 0.1),
        rgba($primary-green, 0.2),
        rgba($primary-green, 0.1),
        transparent);
    bottom: calc(-1 * var(--space-2));
    left: 0;
  }

  &::after {
    content: '';
    position: absolute;
    width: 30%;
    height: 2px;
    background: linear-gradient(90deg,
        transparent,
        $primary-green,
        transparent);
    bottom: calc(-1rem - 0.5px);
    left: 35%;
  }
}

// 更新卡片样式
.product-category .category-inner {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba($primary-green, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);

  &:hover {
    transform: translateY(-5px);
    border-color: rgba($primary-green, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    .tech-line {
      &::before {
        transform: translateX(100%);
      }
    }

    .category-number {
      color: $primary-green;
    }
  }

  .category-header h3 {
    background: linear-gradient(90deg, #fff, $primary-green);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

// 更新项目卡片样式
.item-card .item-inner {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba($primary-green, 0.05);

  &:hover {
    background: rgba($primary-green, 0.1);
    border-color: rgba($primary-green, 0.1);

    .item-dot {
      background: $primary-green;
      box-shadow: 0 0 10px rgba($primary-green, 0.3);
    }
  }
}

.container-fluid {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.featured-brands {
  padding: var(--space-16) 0;
  margin-top: -2px;
  background: linear-gradient(135deg, map.get(map.get($bg-gradients, brands), start), map.get(map.get($bg-gradients, brands), end));
  color: $primary-black;

  h2 {
    @include section-title;
  }

  .brands-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-4);
    align-items: center;
  }

  .brand-card {
    padding: var(--space-2);
    text-align: center;

    img {
      max-width: 120px;
      height: auto;
      filter: grayscale(1) brightness(0);
      opacity: 0.7;
      transition: filter 0.3s;

      &:hover {
        filter: none;
        opacity: 1;
      }
    }
  }
}

.featured-products {
  padding: var(--space-16) 0;
  background: linear-gradient(135deg, map.get(map.get($bg-gradients, featured), start), map.get(map.get($bg-gradients, featured), end));
  color: white;
  @include section-background;
  @include section-transition;

  .section-title {
    @include section-title;
    margin-bottom: var(--space-8);
  }

  .featured-empty {
    max-width: 880px;
    margin: 0 auto;
    padding: var(--space-6);
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    text-align: center;
    color: rgba(255, 255, 255, 0.82);
    letter-spacing: 0.2px;
  }

  .products-slider {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    overflow: hidden;
    padding: 0 var(--space-4);
  }

  .slider-wrapper {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .product-slide {
    flex: 0 0 100%;
    padding: 0 var(--space-2);
  }

  .product-content {
    display: flex;
    gap: var(--space-8);
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 24px;
    padding: var(--space-6);
    border: 1px solid rgba($primary-green, 0.1);
    backdrop-filter: blur(10px);
  }

  .product-image {
    flex: 0 0 50%;
    border-radius: 16px;
    overflow: hidden;

    :deep(.lazy-picture) {
      width: 100%;
      height: 400px;
    }

    :deep(.main-image) {
      transition: transform 0.6s ease;
    }

    &:hover :deep(.main-image) {
      transform: scale(1.05);
    }
  }

  .product-info {
    flex: 1;
    padding: var(--space-4) 0;
  }

  .product-brand {
    display: inline-block;
    font-size: 0.9rem;
    color: $primary-green;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: var(--space-2);
  }

  .product-title {
    font-size: 2.5rem;
    color: white;
    margin-bottom: var(--space-3);
    font-weight: 500;
  }

  .product-description {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: var(--space-4);
  }

  .product-link {
    display: inline-flex;
    align-items: center;
    color: $primary-green;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: 1px solid rgba($primary-green, 0.3);
    padding: 0.8rem var(--space-4);
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &:hover {
      background: rgba($primary-green, 0.1);
      border-color: $primary-green;
      transform: translateX(5px);
    }

    &::after {
      content: '→';
      margin-left: var(--space-2);
      transition: transform 0.3s ease;
    }

    &:hover::after {
      transform: translateX(5px);
    }
  }

  .slider-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba($primary-green, 0.2);
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 10;

    &:hover {
      background: rgba($primary-green, 0.2);
      border-color: $primary-green;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      transform: translateY(-50%);
    }

    &:active:not(:disabled) {
      transform: translateY(-50%) scale(0.96);
    }

    &.prev {
      left: 0;
    }

    &.next {
      right: 0;
    }

    span {
      font-size: 1.5rem;
    }
  }

  .slider-dots {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    margin-top: var(--space-4);

    .dot {
      width: 48px;
      height: 48px;
      border-radius: 999px;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: transform 0.3s ease, opacity 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.2);
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      &:hover {
        &::before {
          background: rgba($primary-green, 0.5);
        }
      }

      &.active {
        &::before {
          width: 24px;
          height: 8px;
          border-radius: 4px;
        }
      }
    }
  }

  @media (max-width: 1280px) {
    .product-content {
      flex-direction: column;
      gap: var(--space-4);
      padding: var(--space-4);
    }

    .product-image {
      flex: 0 0 100%;
      :deep(.lazy-picture) {
        height: 300px;
      }
    }

    .product-info {
      padding: 0;
    }

    .product-title {
      font-size: 2rem;
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-8) 0;

    .products-slider {
      padding: 0 var(--space-2);
    }

    .product-content {
      padding: var(--space-3);
    }

    .product-image :deep(.lazy-picture) {
      height: 250px;
    }

    .product-title {
      font-size: 1.8rem;
    }

    .product-description {
      font-size: 1rem;
    }

    .slider-nav {
      width: 40px;
      height: 40px;

      span {
        font-size: 1.2rem;
      }
    }
  }
}

.cta-section {
  // Keep this section compact so it can fit within one viewport on common screens.
  padding: clamp(40px, 5.5vh, 72px) 0;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  position: relative;

  .cta-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: var(--space-6);
    align-items: center;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: var(--space-4);
      padding: 0 var(--space-3);

	      .cta-image {
	        display: block;
	        width: 100%;
	        min-height: 300px;
	        margin-top: var(--space-4);
	      }
	    }

    @media (max-width: 640px) {
      padding: 0 var(--space-2);
      gap: var(--space-3);

      .cta-image {
        min-height: 400px;

		    .image-overlay {
	          padding: var(--space-4) var(--space-3);
	          display: flex;
	          align-items: flex-end;
	          min-height: 100%;

	          .stats-grid {
	            grid-template-columns: 1fr;
	            gap: var(--space-3);
	            width: 100%;
	            padding: var(--space-3);
	            background: rgba(0, 0, 0, 0.6);
	            border-radius: 12px;
	            backdrop-filter: blur(8px);

	            .stat-item {
	              padding: var(--space-2);
	              text-align: center;

	              &:not(:last-child) {
	                border-bottom: 1px solid rgba($primary-green, 0.2);
	                padding-bottom: var(--space-3);
	                margin-bottom: 0.5rem;
	              }

              &::after {
                display: none;
              }

              .stat-number {
                font-size: 2.6rem;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.3rem;

                span {
                  font-size: 1.2rem;
                }
              }

              .stat-label {
                font-size: 1rem;
                opacity: 0.9;
              }
            }
          }
        }
      }
    }
  }

  .cta-content {
    .section-tag {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      background: rgba($primary-green, 0.1);
      color: $primary-green;
      border-radius: 30px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: clamp(2rem, 2.2vw, 2.6rem);
      font-weight: 600;
      color: $primary-black;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .cta-description {
      font-size: 1.1rem;
      color: rgba($primary-black, 0.7);
      line-height: 1.6;
      margin-bottom: 1.6rem;
    }

    .cta-features {
      display: grid;
      gap: 0.85rem;
      margin-bottom: 1.6rem;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 12px;
        border: 1px solid rgba($primary-green, 0.1);
        transition: transform 0.3s ease, opacity 0.3s ease;

        &:hover {
          transform: translateX(10px);
          border-color: $primary-green;
          box-shadow: 0 4px 20px rgba($primary-green, 0.1);

          .feature-icon {
            background: $primary-green;
            color: white;
          }
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba($primary-green, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: $primary-green;
          transition: transform 0.3s ease, opacity 0.3s ease;

          svg {
            width: 100%;
            height: 100%;
          }
        }

        .feature-text {
          h4 {
            font-size: 1.1rem;
            color: $primary-black;
            margin-bottom: 0.3rem;
            font-weight: 500;
          }

          p {
            font-size: 0.9rem;
            color: rgba($primary-black, 0.6);
            line-height: 1.4;
          }
        }
      }
    }

		    .cta-actions {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
		      overflow: hidden;
		      display: flex;
		      gap: var(--space-3);
		      height: 100%;

      // 左侧联系信息
		      .contact-left {
		        flex: 1;
		        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: 1.1rem;
        justify-content: space-between;

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba($primary-green, 0.03);
          border-radius: 12px;
          transition: transform 0.3s ease, opacity 0.3s ease;

          &:hover {
            background: rgba($primary-green, 0.08);
            transform: translateX(5px);
          }

          .contact-icon {
            width: 44px;
            height: 44px;
            border-radius: 10px;
            background: rgba($primary-green, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: $primary-green;
            padding: 10px;

            svg {
              width: 100%;
              height: 100%;
            }
          }

          .contact-info {
            .label {
              display: block;
              font-size: 0.85rem;
              color: rgba($primary-black, 0.6);
              margin-bottom: 0.2rem;
            }

            .value {
              display: block;
              font-size: 1.1rem;
              color: $primary-black;
              font-weight: 500;
            }
          }
        }

        .cta-button {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem;
          background: $primary-green;
          color: white;
          border-radius: 8px;
          font-weight: 500;
          transition: transform 0.3s ease, opacity 0.3s ease;

	          &:hover {
	            background: color.adjust($primary-green, $lightness: -5%);
	            transform: translateY(-2px);
	            box-shadow: 0 8px 20px rgba($primary-green, 0.2);

            .arrow-icon {
              transform: translateX(3px);
            }
          }

          .arrow-icon {
            width: 18px;
            height: 18px;
            transition: transform 0.3s ease;
          }
        }
      }

      // 右侧二维码
	      .contact-right {
	        width: 200px;
	        padding: var(--space-4);
	        background: rgba($primary-green, 0.02);
	        border-left: 1px solid rgba($primary-black, 0.05);
	        display: flex;
        align-items: center;
        justify-content: center;

        .contact-qr {
          text-align: center;

          img {
            width: 140px;
            height: 140px;
            border-radius: 12px;
            margin-bottom: 0.8rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          span {
            display: block;
            font-size: 0.9rem;
            color: rgba($primary-black, 0.6);
          }
        }

        @media (max-width: 1024px) {
          width: auto;
          flex: 1;
          border-left: none;
          border-top: 1px solid rgba($primary-black, 0.05);
          padding: 1.5rem;
          display: flex;
          justify-content: center; // 确保内容居中
          align-items: center;

          .contact-qr {
            text-align: center; // 确保文字居中
            width: 100%; // 确保宽度撑满
            max-width: 200px; // 限制最大宽度
            margin: 0 auto; // 水平居中

            img {
              width: 110px;
              height: 110px;
              margin: 0 auto 0.8rem; // 图片水平居中
            }
          }
        }

        @media (max-width: 640px) {
          padding: 1.2rem;

          .contact-qr img {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }

  .cta-image {
    position: relative;
    height: 100%;
    min-height: clamp(360px, 46vh, 440px);
    border-radius: 20px;
    overflow: hidden;

    :deep(.lazy-picture) {
      width: 100%;
      height: 100%;
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
		      padding: var(--space-5);
      background: linear-gradient(to top,
          rgba(0, 0, 0, 0.95) 0%,
          rgba(0, 0, 0, 0.8) 40%,
          rgba(0, 0, 0, 0.4) 80%,
          transparent 100%);

	      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
	        gap: var(--space-3);
        width: 100%;

        .stat-item {
          text-align: center;
          position: relative;
          min-width: 0;

          &:not(:last-child)::after {
            content: '';
            position: absolute;
            right: -0.75rem;
            top: 50%;
            transform: translateY(-50%);
            height: 50px;
            width: 1px;
            background: linear-gradient(to bottom,
                transparent,
                rgba($primary-green, 0.3),
                transparent);
          }

          .stat-number {
            font-size: 2.8rem;
            font-weight: 600;
            color: $primary-green;
            line-height: 1;
            margin-bottom: 0.5rem;
            white-space: nowrap;

            span {
              font-size: 1.2rem;
              margin-left: 0.2rem;
              font-weight: 500;
            }
          }

	          .stat-label {
	            font-size: 1rem;
	            color: rgba(white, 0.9);
	            font-weight: 500;
	            position: relative;
	            padding-bottom: var(--space-1);
	            white-space: nowrap;

            &::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 20px;
              height: 2px;
              background: $primary-green;
              border-radius: 2px;
            }
          }
        }
      }
    }

	    @media (max-width: 1280px) {
	      .image-overlay {
	        padding: var(--space-5);

        .stats-grid .stat-item .stat-number {
          font-size: 2.5rem;
        }
      }
    }

    @media (max-width: 1024px) {
      .image-overlay {
        .stats-grid .stat-item .stat-number {
          font-size: 2.2rem;
        }
      }
    }

	    @media (max-width: 768px) {
	      .image-overlay {
	        padding: var(--space-4);

	        .stats-grid {
	          gap: var(--space-2);

          .stat-item {
            .stat-number {
              font-size: 2rem;

              span {
                font-size: 1rem;
              }
            }

            .stat-label {
              font-size: 0.9rem;
            }
          }
        }
      }
    }

    @media (max-width: 640px) {
      & {
        min-height: 400px;
        border-radius: 20px;
        overflow: hidden;
        position: relative;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        left: 0;
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: flex-end;
        background: linear-gradient(to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.7) 50%,
            rgba(0, 0, 0, 0.3) 80%,
            transparent 100%);

        .stats-grid {
          width: 100%;
          margin: 1.5rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;

          .stat-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;

            &:not(:last-child) {
              border-bottom: none;
            }

            .stat-number {
              font-size: 2.2rem;
              color: $primary-green;
              margin: 0;
              display: flex;
              align-items: center;
              gap: 0.2rem;

              span {
                font-size: 1rem;
                color: rgba($primary-green, 0.9);
              }
            }

            .stat-label {
              font-size: 0.95rem;
              color: rgba(white, 0.95);
              margin: 0;
            }
          }
        }
      }
    }
  }

}

.industries-section {
  padding: var(--space-16) 0;
  background: linear-gradient(135deg, map.get(map.get($bg-gradients, industries), start), map.get(map.get($bg-gradients, industries), end));
  position: relative;
  color: $primary-black;

  .section-title {
    @include section-title;
    color: $primary-black;
    font-weight: 400;
  }

  .industries-slider {
    display: flex;
    width: 100%;
    height: 600px;
    gap: 2px;
  }

  .slider-item {
    position: relative;
    flex: 1;
    min-width: calc(8% + 1px);
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    cursor: pointer;

    &:hover {
      flex: 10;

      .slider-bg {
        transform: scale(1.2);
      }

      .slider-content h3 {
        transform: translateY(-50%);
        opacity: 1;
        writing-mode: horizontal-tb;
        font-size: 2.5rem;
        letter-spacing: 2px;
      }
    }

    .slider-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);

      :deep(.lazy-picture) {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom,
            rgba($primary-green, 0.2),
            rgba($primary-black, 0.6));
        opacity: 0.35;
        transition: opacity 0.8s ease;
        z-index: 1;
      }
    }

    &:hover .slider-bg::after {
      opacity: 0.65;
    }

    .slider-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      h3 {
        color: white;
        font-size: 1.2rem;
        font-weight: 400;
        writing-mode: vertical-lr;
        transform: translateY(0);
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 1;
        text-transform: uppercase;
        letter-spacing: 4px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.55);
        padding: 1rem 0.9rem;
        background: rgba(0, 0, 0, 0.28);
        backdrop-filter: blur(6px);
        border-radius: 10px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-8) 0;

    .section-title {
      font-size: 2.8rem;
      margin-bottom: var(--space-4);
    }

    .industries-slider {
      height: auto;
      flex-wrap: wrap;
      gap: var(--space-2);
      padding: 0 var(--space-2);
    }

    .slider-item {
      flex: 0 0 calc(50% - 0.5rem);
      height: 240px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);

      &:hover {
        flex: 0 0 calc(50% - 0.5rem);
        transform: translateY(-5px);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);

        .slider-bg {
          transform: scale(1.1);
        }
      }

      .slider-content {
        background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.2));
        padding: 1rem;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;

        h3 {
          writing-mode: horizontal-tb;
          font-size: 1.4rem;
          opacity: 1;
          transform: none;
          padding: 0.8rem 1.2rem;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          border-radius: 8px;
          width: auto;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 1px;
        }
      }
    }

    .slider-item.touch-active {
      transform: scale(0.98) translateY(-2px);
      transition: transform 0.2s ease, opacity 0.2s ease;

      .slider-bg {
        transform: scale(1.05);
      }

      .slider-content {
        background: linear-gradient(to top,
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.3));

        h3 {
          transform: translateY(-5px);
          color: $primary-green;
        }
      }

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 2px solid $primary-green;
        border-radius: inherit;
        opacity: 0.3;
      }
    }

    .slider-content {
      transition: background 0.3s ease;

      h3 {
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
    }
  }

  @media (max-width: 640px) {
    .industries-slider {
      gap: 1.2rem;
    }

    .slider-item {
      flex: 0 0 100%;
      height: 200px;
      margin-bottom: 0;

      &:hover {
        flex: 0 0 100%;
      }

      .slider-content h3 {
        font-size: 1.3rem;
        padding: 0.7rem 1rem;
      }
    }
  }
}

.main-products-section {
  padding: var(--space-16) 0;
  margin-top: -2px; // 防止出现缝隙
  background: linear-gradient(135deg, map.get(map.get($bg-gradients, products), start), map.get(map.get($bg-gradients, products), end));
  color: $primary-black;

  .section-title {
    @include section-title;
  }

  // 主营产品需要更宽的内容区，避免子项换行
  .container {
    max-width: 1600px;
    padding: 0 var(--space-4);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(360px, 1fr));
    gap: var(--space-5);
    margin: 0 auto;
    padding: 0;
    position: relative;
    grid-auto-rows: 1fr;
  }

  .product-category {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;

    .category-inner {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba($primary-green, 0.1);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      overflow: hidden;
      transition: transform 0.4s ease, opacity 0.4s ease;
      display: flex;
      flex-direction: column;
      height: 100%;

      &:hover {
        transform: translateY(-5px);
        border-color: rgba($primary-green, 0.3);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

        .tech-line {
          &::before {
            transform: translateX(100%);
          }
        }

        .category-number {
          color: $primary-green;
        }
      }
    }

    .category-header {
      padding: var(--space-4);
      position: relative;

      .header-content {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .category-number {
        font-size: 1.2rem;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.5);
        font-family: 'Monaco', monospace;
        transition: color 0.3s ease;
      }

      h3 {
        font-size: 1.8rem;
        font-weight: 400;
        margin: 0;
        background: linear-gradient(90deg, #fff, $primary-green);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .tech-line {
        height: 1px;
        background: linear-gradient(90deg,
            transparent,
            $primary-green,
            transparent);
        margin-top: 1rem;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, $primary-green, transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
      }
    }

	    .category-content {
	      padding: 0 var(--space-4) var(--space-4);
	      flex: 1;
	      display: flex;
	      flex-direction: column;

      .items-wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        flex: 1;
        align-content: start;
      }

      .item-card {
        .item-inner {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          transition: transform 0.3s ease, opacity 0.3s ease;

          &:hover {
            background: rgba($primary-green, 0.1);
            transform: translateX(5px);

            .item-dot {
              background: $primary-green;
              box-shadow: 0 0 10px rgba($primary-green, 0.3);
            }
          }
        }

        .item-dot {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          flex-shrink: 0;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .item-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  @media (max-width: 1280px) {
    .products-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

	  @media (max-width: 768px) {
	    &.main-products-section {
	      padding: var(--space-8) 0;
	    }

	    .section-title {
	      font-size: 2.8rem;
	      margin-bottom: var(--space-6);
	    }

    .products-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .product-category {
      .category-inner {

        // 移除 hover 效果
        &:hover {
          transform: none;
        }

        // 添加触摸反馈
        &:active,
        &:focus {
          transform: translateY(-2px);
          border-color: rgba($primary-green, 0.3);
          background: rgba($primary-green, 0.05);
          transition: transform 0.2s ease, opacity 0.2s ease;

          .category-header {
            .tech-line {
              &::before {
                transform: translateX(0);
              }
            }

            .category-number {
              color: $primary-green;
            }
          }

          .item-card .item-inner {
            .item-dot {
              background: $primary-green;
              transform: scale(1.2);
            }
          }
        }
      }
    }
  }
}

// 为白色背景的section设置文字颜色
.industries-section,
.featured-brands,
.cta-section {
  --section-text-color: #{$primary-black};
}

// 为深色背景的section设置文字颜色
.main-products-section,
.featured-products {
  --section-text-color: #ffffff;
}

.services-section {
  padding: var(--space-16) 0;
  margin-top: -2px;
  background: linear-gradient(135deg, map.get(map.get($bg-gradients, brands), start), map.get(map.get($bg-gradients, brands), end));
  color: $primary-black;
  @include section-background;
  @include section-transition;

  // 与上方主营产品保持同宽
  .container {
    max-width: 1600px;
    padding: 0 var(--space-4);
  }

  .section-title {
    @include section-title;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(360px, 1fr));
    gap: var(--space-5);
    margin: 0 auto;
    padding: 0;
    grid-auto-rows: 1fr;
  }

	  .service-card {
	    background: rgba(255, 255, 255, 0.5);
	    border: 1px solid rgba($primary-green, 0.1);
	    border-radius: 16px;
	    padding: var(--space-5);
	    transition: transform 0.3s ease, opacity 0.3s ease;
	    backdrop-filter: blur(10px);
	    position: relative;
	    overflow: hidden;
	    display: flex;
	    flex-direction: column;
	    isolation: isolate;

	    &::before {
	      content: '';
	      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, $primary-green, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-5px);
      border-color: rgba($primary-green, 0.2);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);

      &::before {
        opacity: 1;
      }

	      .service-icon {
	        color: $primary-green;
	        transform: scale(1.1);
	      }
	    }

	    .service-decor {
	      position: absolute;
	      right: 22px;
	      bottom: 18px;
	      font-size: 10.5rem;
	      line-height: 1;
	      color: rgba($primary-green, 0.10);
	      transform: rotate(-12deg);
	      pointer-events: none;
	      z-index: 0;
	      filter: saturate(1.1);
	      text-shadow: 0 18px 40px rgba($primary-green, 0.06);
	    }

	    > *:not(.service-decor) {
	      position: relative;
	      z-index: 1;
	    }

	    .service-icon {
	      font-size: 2.5rem;
	      color: $primary-black;
	      margin-bottom: 1.5rem;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    h3 {
      font-size: 1.5rem;
      color: $primary-black;
      margin-bottom: 1rem;
      font-weight: 500;
      min-height: 2em;
      display: flex;
      align-items: center;
    }

    p {
      color: rgba($primary-black, 0.8);
      margin-bottom: 1.5rem;
      line-height: 1.6;
      min-height: 3.2em;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .service-features {
      flex: 1;
      display: flex;
      flex-direction: column;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          color: rgba($primary-black, 0.9);

          &::before {
            content: '•';
            color: $primary-green;
            margin-right: 0.8rem;
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  @media (max-width: 1280px) {
    .services-grid {
      grid-template-columns: repeat(2, minmax(360px, 1fr));
    }
  }

	  @media (max-width: 768px) {
	    padding: var(--space-8) 0;

	    .services-grid {
	      grid-template-columns: 1fr;
	      gap: var(--space-3);
	    }

		    .service-card {
		      padding: var(--space-4);

		      .service-decor {
		        font-size: 8.5rem;
		        right: 16px;
		        bottom: 12px;
		        opacity: 0.9;
		      }

	      .service-icon {
	        font-size: 2rem;
	      }

      h3 {
        font-size: 1.3rem;
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-section {
  .cta-content>* {
    animation: slideIn 0.6s ease forwards;
  }

  .cta-header {
    animation-delay: 0.2s;
  }

  .cta-features {
    animation-delay: 0.4s;
  }

  .cta-actions {
    animation-delay: 0.6s;
  }

  .stat-item {
    animation: slideIn 0.6s ease forwards;
    opacity: 0;

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        animation-delay: #{0.2 + ($i * 0.2)}s;
      }
    }
  }
}

@media (max-width: 1024px) {
  .cta-wrapper {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: 0 var(--space-3);
  }

  .cta-content {
    h2 {
      font-size: 2.4rem;
    }

    .cta-description {
      font-size: 1rem;
    }

      .cta-features {
        .feature-item {
          padding: var(--space-2);

        .feature-icon {
          width: 40px;
          height: 40px;
        }

        .feature-text {
          h4 {
            font-size: 1rem;
          }

          p {
            font-size: 0.85rem;
          }
        }
      }
    }

    .cta-actions {
      flex-direction: column;

      .contact-left {
        padding: var(--space-3);
        gap: var(--space-2);

        .contact-item {
          padding: var(--space-2);

          .contact-icon {
            width: 38px;
            height: 38px;
          }

          .contact-info {
            .label {
              font-size: 0.8rem;
            }

            .value {
              font-size: 1rem;
            }
          }
        }
      }

      .contact-right {
        width: 100%;
        padding: var(--space-3);
        border-left: none;
        border-top: 1px solid rgba($primary-black, 0.05);

        .contact-qr {
          img {
            width: 110px;
            height: 110px;
          }

          span {
            font-size: 0.85rem;
          }
        }
      }
    }
  }

  .cta-image {
    min-height: 350px;

    .image-overlay {
      padding: var(--space-4);

      .stats-grid {
        gap: 1.2rem;

        .stat-item {
          .stat-number {
            font-size: 2.2rem;

            span {
              font-size: 1rem;
            }
          }

          .stat-label {
            font-size: 0.9rem;
          }
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .cta-wrapper {
    padding: 0 var(--space-2);
    gap: var(--space-3);
  }

  .cta-content {
    .section-tag {
      font-size: 0.8rem;
      padding: var(--space-1) var(--space-2);
    }

    h2 {
      font-size: 2rem;
    }

    .cta-features {
      gap: 0.8rem;

      .feature-item {
        padding: 0.8rem;
        flex-direction: row;
        align-items: center;

        .feature-icon {
          width: 36px;
          height: 36px;
        }
      }
    }

    .cta-actions {
      .contact-left {
        padding: 1.2rem;

        .contact-item {
          padding: 0.8rem;
        }

        .cta-button {
          padding: 0.8rem;
          font-size: 0.9rem;

          .arrow-icon {
            width: 16px;
            height: 16px;
          }
        }
      }

      .contact-right {
        padding: 1.2rem;

        .contact-qr {
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
  }

  .cta-image {
    min-height: 400px;

    .image-overlay {
      padding: var(--space-4) var(--space-3);
      display: flex;
      align-items: flex-end;
      min-height: 100%;

      .stats-grid {
        grid-template-columns: 1fr;
        gap: var(--space-3);
        width: 100%;
        padding: var(--space-3);
        background: rgba(0, 0, 0, 0.6);
        border-radius: 12px;
        backdrop-filter: blur(8px);

        .stat-item {
          padding: var(--space-2);
          text-align: center;

          &:not(:last-child) {
            border-bottom: 1px solid rgba($primary-green, 0.2);
            padding-bottom: var(--space-3);
            margin-bottom: 0.5rem;
          }

          &::after {
            display: none;
          }

          .stat-number {
            font-size: 2.6rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;

            span {
              font-size: 1.2rem;
            }
          }

          .stat-label {
            font-size: 1rem;
            opacity: 0.9;
          }
        }
      }
    }
  }
}

// 添加波纹动画
@keyframes ripple {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }

  to {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.product-category {
  .category-inner {
    &.active {
      transform: translateY(-2px);
      border-color: rgba($primary-green, 0.3);
      background: rgba($primary-green, 0.05);
      transition: transform 0.2s ease, opacity 0.2s ease;

      .category-header {
        .tech-line::before {
          transform: translateX(0);
        }

        .category-number {
          color: $primary-green;
        }
      }

      .item-card .item-inner .item-dot {
        background: $primary-green;
        transform: scale(1.2);
      }
    }
  }
}

.service-card {
  &.active {
    transform: translateY(-2px);
    border-color: rgba($primary-green, 0.2);
    background: rgba($primary-green, 0.05);

    &::before {
      opacity: 1;
    }

    .service-icon {
      color: $primary-green;
      transform: scale(1.1);
    }

    &::after {
      opacity: 1;
    }
  }
}

.industries-section {
  @media (max-width: 768px) {
    .slider-item {
      &:hover {
        .slider-bg {
          transform: scale(1.1);
        }

        // 移除标题的复杂动画效果
        .slider-content h3 {
          transform: none; // 移除位移动画
          font-size: 1.4rem; // 保持固定大小
          opacity: 1;
          writing-mode: horizontal-tb;
          letter-spacing: 1px;
        }
      }

      .slider-content {
        background: linear-gradient(to top,
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.2));
        padding: 1rem;

        h3 {
          writing-mode: horizontal-tb; // 默认就是水平文字
          font-size: 1.4rem;
          opacity: 1;
          transform: none;
          padding: 0.8rem 1.2rem;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          border-radius: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          letter-spacing: 1px;
        }
      }

      // 触摸反馈效果
      &.touch-active {
        .slider-bg {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }

        .slider-content {
          background: linear-gradient(to top,
              rgba(0, 0, 0, 0.85),
              rgba(0, 0, 0, 0.3));
        }
      }
    }
  }
}

.partners-section {
  padding: var(--space-8) 0;
  background: vars.$primary-black;
  color: white;

  .section-title {
    text-align: center;
    font-size: 2.8rem;
    margin-bottom: var(--space-10);
    font-weight: 300;
    position: relative;
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;

    &::after {
      content: '';
      position: absolute;
      background: linear-gradient(90deg, transparent, vars.$primary-green, transparent);
      width: 10%;
      height: 2px;
      bottom: calc(-1 * var(--space-2) - 0.5px);
      left: 45%;
    }
  }
}

@media (max-width: 768px) {
  .partners-section {
    .section-title {
      font-size: 2rem;
      margin-bottom: var(--space-6);

      &::after {
        width: 20%; // 在移动端增加宽度比例
        left: 40%; // 调整位置以保持居中
      }
    }
  }
}

@media (max-width: 640px) {
  .partners-section {
    .section-title {
      font-size: 2.8rem;
      margin-bottom: var(--space-5);

      &::after {
        width: 30%; // 在更小的屏幕上进一步增加宽度比例
        left: 35%; // 调整位置以保持居中
      }
    }
  }
}

.partners-slider {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  max-width: 1200px;

  .slider-wrapper {
    display: flex;
    transition: transform 0.5s ease;
  }

  .partner-slide {
    flex: 0 0 100%;
    width: 100%;
  }

  .partners-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr); // 改为5列，这样每行显示更多
    grid-template-rows: repeat(2, 1fr);
    gap: 1.2rem; // 减小间距
    padding: 0 var(--space-2);
  }
}

.partner-card {
  position: relative;
  height: 90px; // 减小卡片高度
  perspective: 1000px;

  .card-content {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95); // 改为白色背景
    border-radius: 8px; // 减小圆角
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(130deg,
          transparent 0%,
          rgba(vars.$primary-green, 0.05) 30%,
          rgba(vars.$primary-green, 0.02) 70%,
          transparent 100%);
    }
  }

  .logo-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem; // 减小内边距
    z-index: 1;

    img {
      max-width: 85%; // 增大logo尺寸占比
      max-height: 85%;
      object-fit: contain;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  .card-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(vars.$primary-green, 0.15) 0%,
        transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2;
    pointer-events: none;
  }

  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    padding: 1px;
    background: linear-gradient(130deg,
        transparent,
        rgba(vars.$primary-green, 0.5) 50%,
        transparent);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s;
  }

  &:hover {
    .card-inner {
      transform: translateY(-3px); // 减小上浮距离
      background: rgba(255, 255, 255, 1);
      box-shadow:
        0 10px 20px rgba(0, 0, 0, 0.1),
        0 0 20px rgba(vars.$primary-green, 0.1);
    }

    .logo-wrapper img {
      transform: scale(1.08); // 减小放大比例
    }

    .card-glow {
      opacity: 1;
    }

    .card-border {
      opacity: 1;
    }
  }

  // 添加空卡片样式
  &.empty-card {
    opacity: 0;
    pointer-events: none;
  }
}

@media (max-width: 1024px) {
  .partners-grid {
    grid-template-columns: repeat(4, 1fr); // 中等屏幕4列
  }
}

@media (max-width: 768px) {
  .partners-grid {
    grid-template-columns: repeat(3, 1fr); // 小屏幕3列
    gap: 1rem;
  }

  .partner-card {
    height: 70px; // 移动端更小的高度

    .logo-wrapper {
      padding: 0.8rem;
    }
  }
}

@media (max-width: 640px) {
  .partners-grid {
    grid-template-columns: repeat(2, 1fr); // 超小屏幕2列
  }
}

// 添加鼠标跟踪效果
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .partner-card {
    &:hover {
      .card-inner {
        transform:
          translateY(-3px) rotateX(calc(var(--rotate-x, 0) * 1deg)) rotateY(calc(var(--rotate-y, 0) * 1deg));
      }
    }
  }
}

// 导航按钮样式
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, opacity 0.3s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-50%) scale(1.1);
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.96);
  }

  &.prev {
    left: -60px;
  }

  &.next {
    right: -60px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  i {
    font-size: 1.2rem;
  }
}

// 指示点样式
.slider-dots {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 2.5rem;

  .dot {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    &.active {
      &::before {
        width: 24px;
        background: vars.$primary-green;
      }
    }

    &:hover:not(.active)::before {
      background: rgba(vars.$primary-green, 0.6);
    }

    &:hover:not(.active) {
      background: rgba(255, 255, 255, 0.3);
    }

    &:active:not(.active) {
      transform: scale(0.96);
    }
  }
}

@media (max-width: 1024px) {
  .partners-slider {
    .partners-grid {
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }
}

@media (max-width: 768px) {
  .partners-slider {
    .partners-grid {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 1fr);
      gap: 1rem;
    }
  }

  .slider-nav {
    display: none;
  }

  .partner-card {
    .logo-wrapper {
      padding: 1.5rem;
    }
  }
}
</style>
