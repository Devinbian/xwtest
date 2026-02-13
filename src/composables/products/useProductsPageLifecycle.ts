import { onMounted, onUnmounted, watch, type ComputedRef, type Ref } from 'vue';
import { preloadImage } from '@/utils/image';

type ProductWithImage = {
  image: string;
};

type UseProductsPageLifecycleArgs<TProduct extends ProductWithImage> = {
  initializeViewportState: () => void;
  cleanupViewportState: () => void;
  seedDesktopExpandedCategories: () => void;
  desktopCategoriesMenuEl: Ref<HTMLElement | null>;
  handleDesktopBrandPickerDismiss: (event: Event) => void;
  handleDesktopMenuWheel: (event: WheelEvent) => void;
  initializeHotEditor: () => void;
  initializeTopbarScroll: () => void;
  onTopbarScroll: () => void;
  cleanupTopbarScroll: () => void;
  filteredProducts: ComputedRef<TProduct[]>;
};

export const useProductsPageLifecycle = <TProduct extends ProductWithImage>({
  initializeViewportState,
  cleanupViewportState,
  seedDesktopExpandedCategories,
  desktopCategoriesMenuEl,
  handleDesktopBrandPickerDismiss,
  handleDesktopMenuWheel,
  initializeHotEditor,
  initializeTopbarScroll,
  onTopbarScroll,
  cleanupTopbarScroll,
  filteredProducts,
}: UseProductsPageLifecycleArgs<TProduct>) => {
  const preloadVisibleImages = async () => {
    const visibleProducts = filteredProducts.value.map((product) => product.image);
    await Promise.all(visibleProducts.map((src) => preloadImage(src)));
  };

  let boundDesktopMenuEl: HTMLElement | null = null;

  onMounted(() => {
    initializeViewportState();
    seedDesktopExpandedCategories();

    document.addEventListener('pointerdown', handleDesktopBrandPickerDismiss);
    boundDesktopMenuEl = desktopCategoriesMenuEl.value;
    boundDesktopMenuEl?.addEventListener('wheel', handleDesktopMenuWheel, { passive: false });

    initializeHotEditor();
    initializeTopbarScroll();
    window.addEventListener('scroll', onTopbarScroll, { passive: true });

    void preloadVisibleImages();
  });

  watch(filteredProducts, () => {
    void preloadVisibleImages();
  });

  onUnmounted(() => {
    cleanupViewportState();
    document.removeEventListener('pointerdown', handleDesktopBrandPickerDismiss);
    boundDesktopMenuEl?.removeEventListener('wheel', handleDesktopMenuWheel);
    window.removeEventListener('scroll', onTopbarScroll);
    cleanupTopbarScroll();
  });
};
