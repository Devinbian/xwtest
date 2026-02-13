import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { HOT_PRODUCTS_CHANGED_EVENT, applyHotOverrides, fetchHotConfig } from '@/utils/hotProducts';
import { industries } from '@/data/home/industries.js';
import { productCategories } from '@/data/home/productCategories.js';
import { services } from '@/data/home/services.js';
import { products } from '@/data/products/products.js';

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

const toFeaturedProduct = (product: ProductSource): FeaturedProduct => ({
  id: product.id,
  title: product.name,
  image: product.image,
  brand: product.brandDisplay ?? product.brand ?? '',
  description: product.description,
});

export const useHomePageState = () => {
  const router = useRouter();

  const hotConfig = ref<{
    overrides: Record<string, { isHot?: boolean; hotRank?: number | null }>;
    disableAllHot: boolean;
  }>({
    overrides: {},
    disableAllHot: false,
  });

  const loadHotOverrides = async () => {
    const cfg = await fetchHotConfig();
    hotConfig.value = {
      overrides: cfg.overrides ?? {},
      disableAllHot: cfg.disableAllHot === true,
    };
  };

  const pickFeaturedProducts = (): FeaturedProduct[] => {
    const list = applyHotOverrides(
      products as ProductSource[],
      hotConfig.value.overrides,
      hotConfig.value.disableAllHot,
    ).slice();
    const hot = list
      .filter((product) => typeof product.hotRank === 'number' || product.isHot)
      .sort((a, b) => {
        const ar =
          typeof a.hotRank === 'number' ? a.hotRank : Number.POSITIVE_INFINITY;
        const br =
          typeof b.hotRank === 'number' ? b.hotRank : Number.POSITIVE_INFINITY;
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
  const featuredHotCount = computed(() => featuredProducts.value.length);

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
  const featuredTitleShown = ref(false);

  const prefersReducedMotion = ref(false);
  const disableFeaturedModernSources = ref(false);

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
    }, 5000);
  };
  const stopAutoPlay = () => {
    if (autoPlayInterval.value) {
      clearInterval(autoPlayInterval.value);
      autoPlayInterval.value = null;
    }
  };
  const handleMouseEnter = () => {
    isHovering.value = true;
  };
  const handleMouseLeave = () => {
    isHovering.value = false;
  };

  watch(
    [renderFeatured, featuredInView, prefersReducedMotion],
    ([mounted, visible, reduce]) => {
      if (!mounted) return;
      if (reduce || !visible) stopAutoPlay();
      else startAutoPlay();
    },
  );

  watch(featuredInView, (visible) => {
    if (visible) featuredTitleShown.value = true;
  });

  watch(featuredProducts, (nextList) => {
    if (currentSlide.value > nextList.length - 1) currentSlide.value = 0;
  });

  const handleTouchStart = (element: HTMLElement) => {
    element.classList.add('active');
  };
  const handleTouchEnd = (element: HTMLElement) => {
    element.classList.remove('active');
  };
  const handleTouchStartEvent = (event: Event) => {
    const element = event.currentTarget;
    if (!(element instanceof HTMLElement)) return;
    handleTouchStart(element);
  };
  const handleTouchEndEvent = (event: Event) => {
    const element = event.currentTarget;
    if (!(element instanceof HTMLElement)) return;
    handleTouchEnd(element);
  };

  const goToCategory = (categoryId: number) => {
    router.push({
      path: '/products',
      query: {
        categories: String(categoryId),
      },
    });
  };

  const goToProduct = (brand: string) => {
    router.push({
      path: '/products',
      query: {
        brand,
      },
    });
  };

  const goToHotProducts = () => {
    router.push({
      path: '/products',
      query: {
        hot: '1',
      },
    });
  };

  const handleIndustryTouchStart = (event: TouchEvent, index: number) => {
    activeIndustry.value = index;
    const element = event.currentTarget as HTMLElement;
    element.classList.add('touch-active');
  };
  const handleIndustryTouchEnd = (event: TouchEvent) => {
    activeIndustry.value = null;
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('touch-active');
  };
  const handleIndustryTouchCancel = (event: TouchEvent) => {
    activeIndustry.value = null;
    const element = event.currentTarget as HTMLElement;
    element.classList.remove('touch-active');
  };

  let revealObserver: IntersectionObserver | null = null;
  let visibilityObserver: IntersectionObserver | null = null;

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
          const element = entry.target as HTMLElement;

          if (element === partnersSectionEl.value) renderPartners.value = true;
          else if (element === industriesSectionEl.value) renderIndustries.value = true;
          else if (element === mainProductsSectionEl.value) renderMainProducts.value = true;
          else if (element === servicesSectionEl.value) renderServices.value = true;
          else if (element === featuredSectionEl.value) renderFeatured.value = true;
          else if (element === ctaSectionEl.value) renderCta.value = true;

          revealObserver?.unobserve(element);
        }
      },
      { root: null, rootMargin: '280px 0px', threshold: 0.01 },
    );

    const revealElements = [
      partnersSectionEl.value,
      industriesSectionEl.value,
      mainProductsSectionEl.value,
      servicesSectionEl.value,
      featuredSectionEl.value,
      ctaSectionEl.value,
    ].filter(Boolean) as HTMLElement[];
    revealElements.forEach((element) => revealObserver?.observe(element));

    visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          if (element === partnersSectionEl.value) {
            partnersInView.value = entry.isIntersecting;
          }
          if (element === featuredSectionEl.value) {
            featuredInView.value = entry.isIntersecting;
          }
        }
      },
      { root: null, threshold: 0.12 },
    );

    if (partnersSectionEl.value) visibilityObserver.observe(partnersSectionEl.value);
    if (featuredSectionEl.value) visibilityObserver.observe(featuredSectionEl.value);
  };

  onMounted(() => {
    disableFeaturedModernSources.value =
      window.matchMedia?.('(pointer: coarse)')?.matches ?? false;

    const reduce =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    prefersReducedMotion.value = reduce;

    void loadHotOverrides();
    window.addEventListener(HOT_PRODUCTS_CHANGED_EVENT, loadHotOverrides);

    mountWhenNearViewport();
  });

  onUnmounted(() => {
    window.removeEventListener(HOT_PRODUCTS_CHANGED_EVENT, loadHotOverrides);
    stopAutoPlay();
    revealObserver?.disconnect();
    visibilityObserver?.disconnect();
    revealObserver = null;
    visibilityObserver = null;
  });

  return {
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
    goToCategory,
    goToProduct,
    goToHotProducts,
    handleIndustryTouchStart,
    handleIndustryTouchEnd,
    handleIndustryTouchCancel,
  };
};
