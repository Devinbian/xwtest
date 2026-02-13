import { ref, watch } from 'vue';

type UseProductsViewportStateArgs = {
  mobileBreakpoint?: number;
};

export const useProductsViewportState = ({
  mobileBreakpoint = 768,
}: UseProductsViewportStateArgs = {}) => {
  const isMobile = ref(false);
  const showFilter = ref(false);

  const setOverlayViewportVars = () => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--overlay-vh', `${viewportHeight * 0.01}px`);
    document.documentElement.style.setProperty('--overlay-vh-px', `${viewportHeight}px`);
  };

  const clearOverlayViewportVars = () => {
    document.documentElement.style.removeProperty('--overlay-vh');
    document.documentElement.style.removeProperty('--overlay-vh-px');
  };

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= mobileBreakpoint;
  };

  const initializeViewportState = () => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  };

  const cleanupViewportState = () => {
    clearOverlayViewportVars();
    window.removeEventListener('resize', checkMobile);
  };

  watch(showFilter, (open) => {
    if (!isMobile.value) return;
    if (open) setOverlayViewportVars();
    else clearOverlayViewportVars();
  });

  return {
    isMobile,
    showFilter,
    initializeViewportState,
    cleanupViewportState,
  };
};
