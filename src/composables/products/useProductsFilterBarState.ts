import type { ComputedRef, Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { useProductsFilterState } from './useProductsFilterState';
import { useProductsTopbarState } from './useProductsTopbarState';

type CategoryLike = {
  id: number;
  name: string;
  brands: string[];
};

type ProductLike = {
  id: number;
  name: string;
  brand: string;
  brandDisplay: string;
  type: string;
  categoryId: number;
  description: string;
  specs?: string[];
  isHot?: boolean;
  hotRank?: number;
};

type UseProductsFilterBarStateArgs<
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
> = {
  typedCategories: readonly TCategory[];
  typedProducts: readonly TProduct[];
  productsWithHot: ComputedRef<TProduct[]>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  hotEditorUnlocked: Ref<boolean>;
  isMobile: Ref<boolean>;
  showFilter: Ref<boolean>;
};

export const useProductsFilterBarState = <
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
>({
  typedCategories,
  typedProducts,
  productsWithHot,
  route,
  router,
  hotEditorUnlocked,
  isMobile,
  showFilter,
}: UseProductsFilterBarStateArgs<TCategory, TProduct>) => {
  const getTypeLabel = (type?: string): string => {
    if (type === 'new') return '产品';
    if (type === 'used') return '中古品';
    return '全部';
  };

  const filterState = useProductsFilterState({
    typedCategories,
    productsWithHot,
    route,
    router,
    hotEditorUnlocked,
  });

  const topbarState = useProductsTopbarState({
    route,
    router,
    typedCategories,
    typedProducts,
    selectedCategories: filterState.selectedCategories,
    selectedBrands: filterState.selectedBrands,
    selectedNewProduct: filterState.selectedNewProduct,
    searchQuery: filterState.searchQuery,
    hotOnly: filterState.hotOnly,
    isMobile,
    toggleProductType: filterState.toggleProductType,
    toggleCategory: filterState.toggleCategory,
    clearSearch: filterState.clearSearch,
    updateQueryParams: filterState.updateQueryParams,
    getTypeLabel,
  });

  const openMobileFilter = () => {
    showFilter.value = true;
  };

  const closeMobileFilter = () => {
    showFilter.value = false;
  };

  const clearFiltersAndClose = () => {
    showFilter.value = false;
    filterState.clearFilters();
  };

  const toggleChipsExpanded = () => {
    topbarState.chipsExpanded.value = !topbarState.chipsExpanded.value;
  };

  return {
    ...filterState,
    ...topbarState,
    getTypeLabel,
    openMobileFilter,
    closeMobileFilter,
    clearFiltersAndClose,
    toggleChipsExpanded,
  };
};
