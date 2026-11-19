import { onMounted, onUnmounted } from 'vue';

type UseProductsPageLifecycleArgs = {
  initializeViewportState: () => void;
  cleanupViewportState: () => void;
  seedDesktopExpandedCategories: () => void;
  initializeHotEditor: () => void;
  initializeTopbarScroll: () => void;
  onTopbarScroll: () => void;
  cleanupTopbarScroll: () => void;
};

export const useProductsPageLifecycle = ({
  initializeViewportState,
  cleanupViewportState,
  seedDesktopExpandedCategories,
  initializeHotEditor,
  initializeTopbarScroll,
  onTopbarScroll,
  cleanupTopbarScroll,
}: UseProductsPageLifecycleArgs) => {
  onMounted(() => {
    initializeViewportState();
    seedDesktopExpandedCategories();

    initializeHotEditor();
    initializeTopbarScroll();
    window.addEventListener('scroll', onTopbarScroll, { passive: true });
  });

  onUnmounted(() => {
    cleanupViewportState();
    window.removeEventListener('scroll', onTopbarScroll);
    cleanupTopbarScroll();
  });
};
