<template>
  <div ref="root" class="lazy-picture" :class="{ loading: !isLoaded, error: hasError }">
    <img
      v-if="placeholder"
      :src="placeholder"
      :alt="alt"
      class="placeholder"
      :style="{ opacity: isLoaded ? 0 : 1 }"
      decoding="async"
    />

    <div v-if="shouldLoad && !isLoaded" class="loading-spinner" aria-hidden="true">
      <i class="fas fa-spinner fa-spin"></i>
    </div>

    <picture v-if="shouldLoad && !hasError" :key="reloadKey">
      <source v-if="avifSrc" :srcset="avifSrc" type="image/avif" />
      <source v-if="webpSrc" :srcset="webpSrc" type="image/webp" />
      <img
        ref="mainImageEl"
        :src="fallbackSrc"
        :alt="alt"
        class="main-image"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        :fetchpriority="eager ? 'high' : 'auto'"
        @load="handleLoad"
        @error="handleError"
        :style="{ opacity: isLoaded ? 1 : 0 }"
      />
    </picture>

    <div v-if="hasError" class="error-placeholder">
      <i class="fas fa-image"></i>
      <span>图片加载失败</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

interface Props {
  src: string;
  alt: string;
  placeholder?: string;
  eager?: boolean;
  rootMargin?: string;
  disableSources?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  eager: false,
  rootMargin: '200px 0px',
  disableSources: false,
});

const root = ref<HTMLElement | null>(null);
const mainImageEl = ref<HTMLImageElement | null>(null);
const shouldLoad = ref<boolean>(props.eager);
const isLoaded = ref(false);
const hasError = ref(false);
const forceFallback = ref(false);
const fallbackAttempt = ref(0);
const reloadKey = ref(0);

let observer: IntersectionObserver | null = null;
let loadProbeTimer: number | null = null;

const stopLoadProbe = () => {
  if (loadProbeTimer) window.clearInterval(loadProbeTimer);
  loadProbeTimer = null;
};

const splitUrl = (url: string): { path: string; suffix: string } => {
  const match = url.match(/^([^?#]+)([?#].*)?$/);
  return { path: match?.[1] ?? url, suffix: match?.[2] ?? '' };
};

const replaceExt = (url: string, nextExt: string): string => {
  const { path, suffix } = splitUrl(url);
  const lastSlash = path.lastIndexOf('/');
  const lastDot = path.lastIndexOf('.');
  if (lastDot <= lastSlash) return url;
  return `${path.slice(0, lastDot)}.${nextExt}${suffix}`;
};

const isRasterConvertible = (url: string): boolean => {
  const { path } = splitUrl(url.toLowerCase());
  return /\.(png|jpe?g|webp|avif)$/.test(path);
};

const rasterExt = computed(() => {
  const { path } = splitUrl(props.src.toLowerCase());
  const lastSlash = path.lastIndexOf('/');
  const lastDot = path.lastIndexOf('.');
  if (lastDot <= lastSlash) return undefined;
  return path.slice(lastDot + 1);
});

const avifSrc = computed(() => {
  if (forceFallback.value || props.disableSources) return undefined;
  if (!isRasterConvertible(props.src)) return undefined;
  if (rasterExt.value === 'avif') return props.src;
  return replaceExt(props.src, 'avif');
});

const webpSrc = computed(() => {
  if (forceFallback.value || props.disableSources) return undefined;
  if (!isRasterConvertible(props.src)) return undefined;
  if (rasterExt.value === 'webp') return props.src;
  return replaceExt(props.src, 'webp');
});

const fallbackCandidates = computed(() => {
  if (!isRasterConvertible(props.src)) return [props.src];

  // If src is a modern format, try classic formats in order.
  if (rasterExt.value === 'avif' || rasterExt.value === 'webp') {
    const candidates = [replaceExt(props.src, 'jpg'), replaceExt(props.src, 'png'), replaceExt(props.src, 'jpeg')];
    return Array.from(new Set(candidates));
  }

  return [props.src];
});

const fallbackSrc = computed(() => {
  const candidates = fallbackCandidates.value;
  const index = Math.min(fallbackAttempt.value, Math.max(0, candidates.length - 1));
  return candidates[index] ?? props.src;
});

const handleLoad = () => {
  isLoaded.value = true;
};

const syncLoadedFromCache = () => {
  const el = mainImageEl.value;
  if (!el) return;
  if (el.complete && el.naturalWidth > 0) handleLoad();
};

const startLoadProbe = () => {
  stopLoadProbe();

  // Some mobile/in-app WebViews can fail to fire `load` events reliably,
  // especially inside transformed/animated containers. Probe a few times.
  let ticks = 0;
  loadProbeTimer = window.setInterval(() => {
    ticks += 1;

    if (!shouldLoad.value || hasError.value) {
      stopLoadProbe();
      return;
    }

    const el = mainImageEl.value;
    if (el?.complete && el.naturalWidth > 0) {
      handleLoad();
      stopLoadProbe();
      return;
    }

    // ~4s max
    if (ticks >= 16) stopLoadProbe();
  }, 250);
};

const handleError = () => {
  if (!forceFallback.value) {
    forceFallback.value = true;
    isLoaded.value = false;
    hasError.value = false;
    fallbackAttempt.value = 0;
    reloadKey.value += 1;
    return;
  }

  const nextAttempt = fallbackAttempt.value + 1;
  if (nextAttempt < fallbackCandidates.value.length) {
    fallbackAttempt.value = nextAttempt;
    isLoaded.value = false;
    hasError.value = false;
    reloadKey.value += 1;
    return;
  }

  hasError.value = true;
};

watch(
  () => props.src,
  () => {
    forceFallback.value = false;
    fallbackAttempt.value = 0;
    isLoaded.value = false;
    hasError.value = false;
    reloadKey.value += 1;
    stopLoadProbe();
  },
);

watch(
  () => props.eager,
  (next) => {
    if (next) shouldLoad.value = true;
  },
);

watch(shouldLoad, (next) => {
  if (!next) return;
  void nextTick(() => {
    syncLoadedFromCache();
    startLoadProbe();
  });
});

watch(reloadKey, () => {
  void nextTick(() => {
    syncLoadedFromCache();
    startLoadProbe();
  });
});

onMounted(() => {
  void nextTick(() => {
    syncLoadedFromCache();
    if (shouldLoad.value) startLoadProbe();
  });
  if (shouldLoad.value) return;

  if (typeof IntersectionObserver === 'undefined') {
    shouldLoad.value = true;
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        shouldLoad.value = true;
        observer?.disconnect();
        observer = null;
        break;
      }
    },
    { root: null, rootMargin: props.rootMargin, threshold: 0.01 }
  );

  if (root.value) observer.observe(root.value);
  else shouldLoad.value = true;
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
  stopLoadProbe();
});
</script>

<style lang="scss" scoped>
.lazy-picture {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow: hidden;

  .placeholder {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px);
    transition: opacity 0.25s ease;
  }

  picture {
    position: absolute;
    inset: 0;
    display: block;
  }

  .main-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(0, 0, 0, 0.5);
    font-size: 1.5rem;
    z-index: 1;
  }

  .error-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    color: #999;
    z-index: 1;

    i {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
