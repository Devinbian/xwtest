<template>
  <div class="home">
    <HomeHero />

    <!-- 合作品牌板块 -->
    <section ref="partnersSectionEl" class="partners-section">
      <div class="container">
        <h2 class="section-title">合作品牌</h2>
        <PartnerBrands
          v-if="renderPartners"
          variant="home"
          :auto-play="partnersInView && !prefersReducedMotion"
        />
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
            <div class="category-inner" @touchstart="handleTouchStartEvent"
              @touchend="handleTouchEndEvent" @touchcancel="handleTouchEndEvent">
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
	            @touchstart="handleTouchStartEvent" @touchend="handleTouchEndEvent"
	            @touchcancel="handleTouchEndEvent">
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
    <section ref="featuredSectionEl" class="featured-products" :class="{ 'is-visible': featuredTitleShown }">
      <div class="container">
        <div class="featured-header">
          <span class="featured-scanlines" aria-hidden="true"></span>
          <div class="featured-header-main">
            <h2 class="section-title">
              <span class="title-icon" aria-hidden="true">
                <i class="fas fa-microchip"></i>
                <i class="fas fa-fire title-flame"></i>
              </span>
              <span class="title-text">热门产品</span>
              <span
                class="title-badge"
                :aria-label="`热度榜，当前展示 ${featuredHotCount} 款`"
              >
                <span class="badge-label">热度榜</span>
                <span class="badge-sep">/</span>
                <span class="badge-label-en">HOT PICK</span>
                <span class="badge-count">{{ featuredHotCount }}</span>
              </span>
            </h2>
            <button type="button" class="featured-cta" @click="goToHotProducts" aria-label="查看全部热门产品">
              查看全部
              <i class="fas fa-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
          <p class="featured-subtitle">高频咨询 · 热度排序 · 一键直达品牌</p>
        </div>
        <div
          v-if="renderFeatured && featuredProducts.length > 0"
          class="products-slider"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div class="slider-wrapper" ref="sliderWrapper" :style="{ transform: `translate3d(${-currentSlide * 100}%, 0, 0)` }">
            <div v-for="(product, index) in featuredProducts" :key="product.id" class="product-slide">
              <div class="product-content">
                <div class="product-image">
                  <LazyPicture
                    :src="product.image"
                    :placeholder="generatePlaceholderUrl(product.image)"
                    :alt="product.title"
                    :eager="index === currentSlide"
                    :disable-sources="disableFeaturedModernSources"
                    rootMargin="600px 0px"
                  />
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
import PartnerBrands from '@/components/PartnerBrands.vue';
import { getAssetUrl } from '@/utils/assets';
import LazyPicture from '@/components/LazyPicture.vue';
import { generatePlaceholderUrl } from '@/utils/image';
import { useHomePageState } from '@/composables/home/useHomePageState';

const {
  industries,
  productCategories,
  services,
  activeIndustry,
  partnersSectionEl,
  industriesSectionEl,
  mainProductsSectionEl,
  servicesSectionEl,
  featuredSectionEl,
  ctaSectionEl,
  renderPartners,
  renderIndustries,
  renderMainProducts,
  renderServices,
  renderFeatured,
  renderCta,
  partnersInView,
  featuredInView,
  featuredTitleShown,
  prefersReducedMotion,
  disableFeaturedModernSources,
  featuredProducts,
  featuredHotCount,
  currentSlide,
  prevSlide,
  nextSlide,
  goToSlide,
  handleMouseEnter,
  handleMouseLeave,
  handleTouchStartEvent,
  handleTouchEndEvent,
  goToProduct,
  goToHotProducts,
  handleIndustryTouchStart,
  handleIndustryTouchEnd,
  handleIndustryTouchCancel,
} = useHomePageState();
</script>

<style lang="scss" scoped src="../../styles/views/home.scss"></style>
