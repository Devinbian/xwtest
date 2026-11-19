import { onMounted, onUnmounted, type Ref } from 'vue';

type UseProductsPageLifecycleArgs = {
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
};

export const useProductsPageLifecycle = ({
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
}: UseProductsPageLifecycleArgs) => {
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
  });

  onUnmounted(() => {
    cleanupViewportState();
    document.removeEventListener('pointerdown', handleDesktopBrandPickerDismiss);
    boundDesktopMenuEl?.removeEventListener('wheel', handleDesktopMenuWheel);
    window.removeEventListener('scroll', onTopbarScroll);
    cleanupTopbarScroll();
  });
};
