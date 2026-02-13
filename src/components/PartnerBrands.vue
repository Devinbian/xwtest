<template>
  <div class="partner-brands" :class="`partner-brands--${variant}`">
    <template v-if="isHomeVariant">
      <div
        class="partner-brands__slider"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <div
          class="partner-brands__track"
          :style="{ transform: `translateX(${-currentSlide * 100}%)` }"
        >
          <div
            v-for="(group, index) in slideGroups"
            :key="`slide-${index}`"
            class="partner-brands__slide"
          >
            <div class="partner-brands__grid partner-brands__grid--home">
              <article
                v-for="brand in group"
                :key="brand.id"
                class="partner-brands__card"
                :class="{ 'is-empty': brand.isEmpty }"
              >
                <a
                  v-if="!brand.isEmpty"
                  :href="brand.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="partner-brands__card-link"
                >
                  <div class="partner-brands__logo">
                    <img :src="brand.logo" :alt="brand.name" loading="lazy" decoding="async" />
                  </div>
                  <p class="partner-brands__description">{{ brand.description }}</p>
                </a>
              </article>
            </div>
          </div>
        </div>

        <button
          v-if="slideGroups.length > 1"
          type="button"
          class="partner-brands__nav partner-brands__nav--prev"
          aria-label="上一组品牌"
          @click="prevSlide"
          :disabled="currentSlide === 0"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          v-if="slideGroups.length > 1"
          type="button"
          class="partner-brands__nav partner-brands__nav--next"
          aria-label="下一组品牌"
          @click="nextSlide"
          :disabled="currentSlide === slideGroups.length - 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <div v-if="slideGroups.length > 1" class="partner-brands__dots">
          <button
            v-for="(_, index) in slideGroups"
            :key="`dot-${index}`"
            type="button"
            class="partner-brands__dot"
            :class="{ active: currentSlide === index }"
            :aria-label="`切换到第 ${index + 1} 组品牌`"
            :aria-current="currentSlide === index ? 'true' : undefined"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="partner-brands__grid partner-brands__grid--page">
        <article v-for="brand in pagedBrands" :key="brand.id" class="partner-brands__card">
          <a
            :href="brand.website"
            target="_blank"
            rel="noopener noreferrer"
            class="partner-brands__card-link"
          >
            <div class="partner-brands__logo">
              <img :src="brand.logo" :alt="brand.name" loading="lazy" decoding="async" />
            </div>
            <p class="partner-brands__description">{{ brand.description }}</p>
          </a>
        </article>
      </div>

      <div v-if="totalPages > 1" class="partner-brands__pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import { partners } from '@/data/home/partners.js';

type Variant = 'home' | 'page';

interface Partner {
  id: number | string;
  name: string;
  logo: string;
  website: string;
  description: string;
}

interface SlidePartner extends Partner {
  isEmpty?: boolean;
}

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    itemsPerPage?: number;
  }>(),
  {
    variant: 'home',
    autoPlay: true,
    autoPlayInterval: 9000,
    itemsPerPage: 12,
  },
);

const allBrands = partners as Partner[];
const isHomeVariant = computed(() => props.variant === 'home');

const pageSize = computed(() => Math.max(1, props.itemsPerPage));
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(allBrands.length / pageSize.value)),
);
const pagedBrands = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return allBrands.slice(start, start + pageSize.value);
});

const slideGroups = computed<SlidePartner[][]>(() => {
  if (!isHomeVariant.value) return [];

  const groups: SlidePartner[][] = [];
  for (let i = 0; i < allBrands.length; i += pageSize.value) {
    const group: SlidePartner[] = allBrands
      .slice(i, i + pageSize.value)
      .map((brand) => ({ ...brand, isEmpty: false }));

    if (group.length < pageSize.value) {
      group.push(
        ...Array.from({ length: pageSize.value - group.length }, (_, padIndex) => ({
          id: `empty-${i}-${padIndex}`,
          name: '',
          logo: '',
          website: '',
          description: '',
          isEmpty: true,
        })),
      );
    }

    groups.push(group);
  }

  return groups;
});

const currentSlide = ref(0);
const isHovering = ref(false);
let autoPlayTimer: number | null = null;

const goToSlide = (index: number) => {
  currentSlide.value = index;
};

const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value -= 1;
};

const nextSlide = () => {
  if (currentSlide.value < slideGroups.value.length - 1) currentSlide.value += 1;
};

const changePage = (page: number) => {
  currentPage.value = page;
};

const stopAutoPlay = () => {
  if (!autoPlayTimer) return;
  window.clearInterval(autoPlayTimer);
  autoPlayTimer = null;
};

const startAutoPlay = () => {
  if (
    autoPlayTimer ||
    !isHomeVariant.value ||
    !props.autoPlay ||
    slideGroups.value.length <= 1
  ) {
    return;
  }

  autoPlayTimer = window.setInterval(() => {
    if (isHovering.value) return;

    if (currentSlide.value < slideGroups.value.length - 1) {
      currentSlide.value += 1;
    } else {
      currentSlide.value = 0;
    }
  }, props.autoPlayInterval);
};

watch(totalPages, (count: number) => {
  if (currentPage.value > count) currentPage.value = 1;
});

watch(slideGroups, (groups: SlidePartner[][]) => {
  if (groups.length === 0) return;
  if (currentSlide.value > groups.length - 1) currentSlide.value = 0;
});

watch(
  [
    isHomeVariant,
    () => props.autoPlay,
    () => props.autoPlayInterval,
    () => slideGroups.value.length,
  ],
  ([homeMode, shouldAutoPlay, _interval, groupCount]: [boolean, boolean, number, number]) => {
    if (homeMode && shouldAutoPlay && groupCount > 1) {
      stopAutoPlay();
      startAutoPlay();
      return;
    }
    stopAutoPlay();
  },
  { immediate: true },
);

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style lang="scss" scoped>
$primary-green: #83b735;

.partner-brands {
  width: 100%;

  .partner-brands__card {
    min-width: 0;
  }

  .partner-brands__card-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    width: 100%;
    text-decoration: none;
  }

  .partner-brands__logo {
    width: 100%;
    min-height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: min(130px, 100%);
      height: 30px;
      object-fit: contain;
      max-width: 100%;
      max-height: 100%;
      transition: transform 0.3s ease;
    }
  }

  .partner-brands__description {
    margin: 0;
    text-align: center;
    line-height: 1.45;
  }
}

.partner-brands--home {
  .partner-brands__slider {
    position: relative;
    overflow: hidden;
    max-width: 1440px;
    margin: 0 auto;
  }

  .partner-brands__track {
    display: flex;
    transition: transform 0.5s ease;
  }

  .partner-brands__slide {
    flex: 0 0 100%;
    width: 100%;
  }

  .partner-brands__grid--home {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 1.2rem;
    padding: 0 0.5rem;
  }

  .partner-brands__card-link {
    min-height: 102px;
    padding: 0.85rem 0.75rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .partner-brands__description {
    color: #5b5b5b;
    font-size: 0.92rem;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .partner-brands__card:not(.is-empty):hover {
    .partner-brands__card-link {
      transform: translateY(-3px);
    }

    img {
      transform: scale(1.05);
    }
  }

  .partner-brands__card.is-empty {
    opacity: 0;
    pointer-events: none;
  }

  .partner-brands__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    transition: transform 0.3s ease, opacity 0.3s ease;
    z-index: 2;

    &:hover {
      transform: translateY(-50%) scale(1.08);
      background: rgba(255, 255, 255, 0.16);
    }

    &:active:not(:disabled) {
      transform: translateY(-50%) scale(0.95);
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

  .partner-brands__nav--prev {
    left: -60px;
  }

  .partner-brands__nav--next {
    right: -60px;
  }

  .partner-brands__dots {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    margin-top: 2.2rem;
  }

  .partner-brands__dot {
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 999px;
    background: transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease, opacity 0.3s ease;
    padding: 0;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.25);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    &:hover:not(.active)::before {
      background: rgba($primary-green, 0.72);
    }

    &.active::before {
      width: 24px;
      background: $primary-green;
    }
  }
}

.partner-brands--page {
  .partner-brands__grid--page {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
  }

  .partner-brands__card-link {
    min-height: 132px;
    padding: 1.25rem 1rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .partner-brands__description {
    color: #666;
    font-size: 0.95rem;
  }

  .partner-brands__card:hover {
    .partner-brands__card-link {
      transform: translateY(-4px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    img {
      transform: scale(1.05);
    }
  }

  .partner-brands__pagination {
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
        color: #fff;
      }
    }
  }
}

@media (max-width: 1024px) {
  .partner-brands--home {
    .partner-brands__grid--home {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-template-rows: repeat(3, minmax(0, 1fr));
      gap: 1.5rem;
    }
  }

  .partner-brands--page {
    .partner-brands__grid--page {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .partner-brands--home {
    .partner-brands__grid--home {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-template-rows: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .partner-brands__nav {
      display: none;
    }
  }

  .partner-brands--page {
    .partner-brands__grid--page {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 640px) {
  .partner-brands--home {
    .partner-brands__grid--home {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-template-rows: repeat(6, minmax(0, 1fr));
    }

    .partner-brands__card-link {
      min-height: 94px;
      padding: 0.7rem 0.65rem;
    }

    .partner-brands__description {
      font-size: 0.85rem;
    }
  }
}
</style>
