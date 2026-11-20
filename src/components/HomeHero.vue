<template>
  <section
    ref="heroElement"
    class="hero-section"
    :class="{ 'motion-paused': isPaused || !isVisible || isDocumentHidden }"
    aria-label="鑫万测品牌与服务"
    aria-roledescription="轮播"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @focusin="isFocused = true"
    @focusout="handleFocusOut"
  >
    <div class="hero-atmosphere" aria-hidden="true">
      <div class="light-field"></div>
      <div class="perspective-grid"></div>
      <span class="edge-label">PRECISION / TECHNOLOGY</span>
    </div>
    <h1 class="sr-only">鑫万测 · 仪器设备与测试测量解决方案</h1>
    <div class="hero-slider">
      <article
        v-for="(slide, index) in slides"
        :key="slide.title"
        class="hero-slide"
        :class="{ active: currentSlide === index }"
        :aria-hidden="currentSlide !== index"
        :inert="currentSlide !== index ? true : undefined"
      >
        <div class="slide-content">
          <span class="hero-eyebrow"><span aria-hidden="true"></span>{{ slide.eyebrow }}</span>
          <h2><span>{{ slide.heading }}</span><span class="title-accent">{{ slide.accent }}</span></h2>
          <p>{{ slide.description }}</p>
          <div class="hero-actions">
            <router-link :to="slide.link" class="cta-button" :tabindex="currentSlide === index ? 0 : -1">
              {{ slide.buttonText }}<span aria-hidden="true">↗</span>
            </router-link>
            <span class="hero-action-note">{{ slide.note }}</span>
          </div>
        </div>
        <figure class="slide-visual" :class="{ 'is-tall': slide.tall }">
          <div class="visual-orbit" aria-hidden="true"></div>
          <div class="visual-orbit inner" aria-hidden="true"></div>
          <div class="visual-floor" aria-hidden="true"></div>
          <div class="visual-topline" aria-hidden="true">
            <span>ENGINEERED FOR PRECISION</span><span class="crosshair">+</span>
          </div>
          <LazyPicture
            v-if="currentSlide === index || (currentSlide + 1) % slides.length === index"
            :src="slide.image"
            :alt="slide.imageAlt"
            :eager="currentSlide === index"
          />
          <InstrumentMotion :mode="index" :paused="isPaused || currentSlide !== index || !isVisible || isDocumentHidden" />
          <figcaption>
            <span class="visual-caption-line" aria-hidden="true"></span>
            <span><strong>{{ slide.brand }}</strong><span class="visual-model">{{ slide.imageAlt }}</span></span>
            <span class="visual-index" aria-hidden="true">0{{ index + 1 }}</span>
          </figcaption>
        </figure>
      </article>
    </div>
    <div class="hero-footer">
      <div class="hero-signature" aria-hidden="true">
        <svg viewBox="0 0 100 32"><path d="M0 16H22L28 7L37 26L47 3L58 28L67 10L75 16H100" /></svg>
        <span>精于测量 · 专注品质</span>
      </div>
      <div class="slider-controls" aria-label="首屏轮播控制">
        <div class="slide-selectors">
          <button
            v-for="(slide, index) in slides"
            :key="slide.title"
            type="button"
            class="slide-selector"
            :class="{ active: currentSlide === index }"
            :aria-label="`查看${slide.title}`"
            :aria-current="currentSlide === index ? 'true' : undefined"
            @click="goToSlide(index)"
          ><span class="selector-number">0{{ index + 1 }}</span><span>{{ slide.title }}</span></button>
        </div>
        <button type="button" class="playback-button" :aria-label="isPaused ? '播放轮播与测试动画' : '暂停轮播与测试动画'" @click="isPaused = !isPaused">
          <svg v-if="isPaused" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 9 6-9 6Z" fill="currentColor" /></svg>
          <svg v-else viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10M13 5v10" stroke="currentColor" stroke-width="2" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { getAssetUrl } from '@/utils/assets';
import LazyPicture from '@/components/LazyPicture.vue';
import InstrumentMotion from '@/components/InstrumentMotion.vue';

const slides = [
  {
    title: '创新测量方案',
    heading: '创新测量',
    accent: '精准洞见',
    eyebrow: 'PRECISION IN EVERY DETAIL',
    description: '为您提供专业精准的仪器仪表解决方案',
    note: '仪器设备 / 测试测量',
    image: getAssetUrl('images/hero/scope-cutout.png'),
    imageAlt: '6 系列 B MSO 混合信号示波器',
    brand: 'TEKTRONIX',
    tall: false,
    link: '/products',
    buttonText: '探索产品'
  },
  {
    title: '全方位技术支持',
    heading: '专业技术',
    accent: '全程支持',
    eyebrow: 'EXPERTISE BEYOND MEASUREMENT',
    description: '专业团队为您提供完整的技术支持与服务',
    note: '技术咨询 / 安装调试 / 维修保养',
    image: getAssetUrl('images/hero/metrology-cutout.png'),
    imageAlt: 'NEXIV VMZ-S 系列影像测量仪',
    brand: 'NIKON',
    tall: true,
    link: '/services',
    buttonText: '查看服务'
  },
  {
    title: '行业领先品牌',
    heading: '汇聚品牌',
    accent: '连接创新',
    eyebrow: 'CONNECTED BY INNOVATION',
    description: '与全球顶尖仪器仪表品牌深度合作',
    note: '电子测试 / 影像测量 / 环境试验',
    image: getAssetUrl('images/hero/microscope-cutout.png'),
    imageAlt: 'L300 / L200 系列检查显微镜',
    brand: 'NIKON',
    tall: false,
    link: '/brands',
    buttonText: '探索品牌'
  }
];

const heroElement = ref<HTMLElement | null>(null);
const isVisible = ref(true);
const isDocumentHidden = ref(false);
let visibilityObserver: IntersectionObserver | undefined;
const syncVisibility = () => { isDocumentHidden.value = document.hidden; };
const currentSlide = ref(0);
const isPaused = ref(false);
const isHovering = ref(false);
const isFocused = ref(false);
let autoplayInterval: number | undefined;
let motionPreference: MediaQueryList | undefined;

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const handleFocusOut = (event: FocusEvent) => {
  isFocused.value = (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null);
};

const syncMotionPreference = () => {
  if (motionPreference?.matches) isPaused.value = true;
};

onMounted(() => {
  syncVisibility();
  document.addEventListener('visibilitychange', syncVisibility);
  visibilityObserver = new IntersectionObserver(([entry]) => { isVisible.value = entry.isIntersecting; });
  if (heroElement.value) visibilityObserver.observe(heroElement.value);
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  syncMotionPreference();
  motionPreference.addEventListener('change', syncMotionPreference);
  autoplayInterval = window.setInterval(() => {
    if (isPaused.value || isHovering.value || isFocused.value || !isVisible.value || document.hidden) return;
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 7000);
});

onUnmounted(() => {
  visibilityObserver?.disconnect();
  document.removeEventListener('visibilitychange', syncVisibility);
  window.clearInterval(autoplayInterval);
  motionPreference?.removeEventListener('change', syncMotionPreference);
});
</script>

<style lang="scss" scoped>
.motion-paused .light-field { animation-play-state: paused; }

.hero-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: #fff;
  color: #263321;
  padding: 0 var(--ui-gutter);
}

.hero-atmosphere {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 78% 42%, #b4dc7940, transparent 50%),
    linear-gradient(110deg, #ffffff 20%, #edf8dc 70%, #d7edb8);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #ffffff80, transparent 55%), linear-gradient(0deg, #fff, transparent 22%);
  }
}

.light-field {
  position: absolute;
  width: 65%;
  height: 90%;
  right: -12%;
  top: -34%;
  border-radius: 50%;
  background: radial-gradient(ellipse, #83b73545, #b7e17e22 48%, transparent 68%);
  filter: blur(20px);
  animation: light-breathe 10s ease-in-out infinite alternate;
}

.perspective-grid {
  position: absolute;
  left: 35%;
  top: 48%;
  width: 90%;
  height: 90%;
  transform: perspective(600px) rotateX(62deg) rotateZ(-24deg);
  background-image: linear-gradient(#83b73528 1px, transparent 1px), linear-gradient(90deg, #83b73528 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse, #000, transparent 68%);
}

.edge-label {
  position: absolute;
  right: 22px;
  top: 22%;
  writing-mode: vertical-rl;
  font-size: 11px;
  letter-spacing: 0.3em;
  color: #507d2270;
}

.hero-slider,
.hero-footer {
  max-width: calc(var(--ui-content-width) - var(--ui-gutter) * 2);
  margin: 0 auto;
}

.hero-slider { display: grid; }
.hero-slide {
  grid-area: 1 / 1;
  min-width: 0;
  min-height: clamp(580px, calc(100svh - var(--header-offset) - 100px), 790px);
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  align-items: center;
  gap: 36px;
  padding: 50px 0 28px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.65s ease, visibility 0.65s;

  &.active { opacity: 1; visibility: visible; pointer-events: auto; }
  &.active .slide-content { transform: none; }
  &.active .slide-visual :deep(.lazy-picture) { transform: translateY(0) scale(1); }
}

.slide-content {
  min-width: 0;
  position: relative;
  z-index: 2;
  padding-bottom: 24px;
  transform: translateY(18px);
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);

  h2 {
    margin: 26px 0;
    font-size: clamp(64px, 6.2vw, 104px);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.045em;
    > span { display: block; }
    .title-accent {
      margin-top: 6px;
      color: #679d2c;
    }
  }

  p { color: #5b6b51; font-size: 20px; line-height: 1.9; }
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #507d22;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.17em;
  > span {
    width: 6px;
    height: 6px;
    background: var(--action-color);
    box-shadow: 0 0 16px #83b73530;
  }
}

.hero-actions { display: flex; align-items: center; gap: 22px; margin-top: 38px; }
.hero-action-note { max-width: 17em; font-size: 14px; text-wrap: balance; line-height: 1.8; color: #65715e; }
.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 42px;
  min-height: 58px;
  padding: 0 24px;
  background: #83b735;
  color: #20350f;
  border: 1px solid #83b735;
  border-radius: 4px;
  box-shadow: 0 0 30px #507d2220;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  > span { font-size: 22px; color: var(--action-color); }
  &:hover { box-shadow: 0 0 36px #83b73535; transform: translateY(-2px); }
}

.slide-visual {
  position: relative;
  min-width: 0;
  height: clamp(460px, 39vw, 610px);
  margin: 0 -28px 0 0;
  display: flex;
  align-items: center;
  isolation: isolate;

  :deep(.lazy-picture) {
    width: 100%;
    height: 78%;
    background: transparent;
    overflow: visible;
    filter: drop-shadow(0 28px 28px #365c2528);
    transform: translateY(16px) scale(0.96);
    transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
  }

  :deep(.main-image) { object-fit: contain; }
  :deep(.loading-spinner) { color: var(--action-color); }
  &.is-tall :deep(.lazy-picture) { height: 88%; padding: 0 18%; }
  &.is-tall :deep(picture) { inset: 0 18%; }

  figcaption {
    position: absolute;
    z-index: 2;
    left: 4%;
    right: 2%;
    bottom: -4px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: #344c25;
    strong { font-size: 14px; letter-spacing: 0.16em; font-weight: 500; }
  }
}

.visual-caption-line { width: 36px; height: 1px; background: #83b73588; }
.visual-model { display: block; margin-top: 4px; font-size: 14px; color: #65715e; }
.visual-index { margin-left: auto; font-size: 48px; line-height: 1; font-weight: 300; color: #507d2230; }
.visual-topline {
  position: absolute;
  top: 2%;
  left: 4%;
  right: 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #65715e;
  font-size: 11px;
  letter-spacing: 0.18em;
  .crosshair { font-size: 24px; font-weight: 200; color: #83b735; }
}

.visual-orbit {
  position: absolute;
  z-index: -1;
  width: 94%;
  aspect-ratio: 1;
  left: 3%;
  top: 50%;
  margin-top: -47%;
  border: 1px solid #83b73530;
  border-right-color: #83b73580;
  border-radius: 50%;
  transform: rotate(-25deg) scaleY(0.78);
  box-shadow: inset -12px 0 34px #83b73508, 12px 0 40px #83b73512;

  &.inner {
    width: 78%;
    left: 11%;
    margin-top: -39%;
    border-style: dashed;
    border-color: #83b73530;
    box-shadow: none;
    transform: rotate(25deg) scaleY(0.78);
  }
}

.visual-floor {
  position: absolute;
  z-index: -1;
  bottom: 4%;
  left: 0;
  right: 0;
  height: 28%;
  border-radius: 50%;
  background: radial-gradient(ellipse, #83b73535, #83b73515 40%, transparent 70%);
  filter: blur(12px);
}

.hero-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  min-height: 100px;
  border-top: 1px solid #507d2226;
}
.hero-signature {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
  color: #65715e;
  font-size: 14px;
  letter-spacing: 0.1em;
  svg { width: 70px; height: 28px; fill: none; stroke: #83b735; stroke-width: 1; }
}
.slider-controls { display: flex; align-items: center; gap: 32px; }
.slide-selectors { display: flex; gap: 28px; }
.slide-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 60px;
  border: 0;
  border-top: 2px solid transparent;
  padding: 0;
  background: transparent;
  color: #65715e;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.25s ease, border-color 0.25s ease;
  .selector-number { font-size: 12px; font-variant-numeric: tabular-nums; color: #65715e; }
  &.active { color: #263321; border-top-color: var(--action-color); }
  &.active .selector-number { color: var(--action-color); }
  &:hover { color: var(--action-color); }
}
.playback-button {
  display: grid;
  place-items: center;
  flex: 0 0 44px;
  height: 44px;
  padding: 0;
  border: 1px solid #507d2240;
  border-radius: 50%;
  background: #ffffff05;
  color: #507d22;
  cursor: pointer;
  svg { width: 18px; height: 18px; }
  &:hover { background: #83b73515; }
}

@keyframes light-breathe { to { transform: translate(-8%, 10%) scale(1.15); opacity: 0.65; } }

@media (max-width: 1100px) {
  .hero-signature { display: none; }
  .slider-controls { width: 100%; justify-content: space-between; }
  .slide-selectors { gap: 24px; }
  .hero-action-note { display: none; }
}

@media (max-width: 768px) {
  .hero-slide { grid-template-columns: minmax(0, 1fr); min-height: 0; padding: 38px 0 20px; gap: 0; }
  .slide-content {
    padding: 0;
    h2 { font-size: clamp(48px, 11vw, 68px); margin: 20px 0; }
    p { font-size: 16px; max-width: 23em; }
  }
  .hero-eyebrow { font-size: 10px; letter-spacing: 0.13em; }
  .hero-actions { margin-top: 24px; }
  .cta-button { min-height: 48px; padding: 0 20px; }
  .slide-visual {
    height: clamp(260px, 75vw, 430px);
    margin: 18px 0 8px;
    :deep(.lazy-picture) { height: 76%; }
    figcaption { bottom: -4px; left: 0; right: 0; }
    &.is-tall :deep(.lazy-picture) { height: 78%; }
  }
  .visual-topline { top: 4%; left: 0; font-size: 9px; }
  .visual-index { font-size: 32px; }
  .visual-caption-line { width: 20px; }
  .visual-model { font-size: 12px; }
  .hero-footer { min-height: 86px; }
  .slider-controls { gap: 12px; }
  .slide-selectors { flex: 1; gap: 12px; justify-content: space-between; }
  .slide-selector { flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; font-size: 11px; min-height: 56px; }
  .edge-label { display: none; }
  .light-field { width: 160%; height: 60%; top: 20%; right: -80%; }
  .perspective-grid { left: 0; top: 40%; width: 160%; }
}

@media (max-width: 360px) {
  .slider-controls, .slide-selectors { gap: 8px; }
  .slide-selector { font-size: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  .light-field { animation: none; }
  .hero-slide, .slide-content, .slide-visual :deep(.lazy-picture) { transition: none; transform: none; }
}
</style>
