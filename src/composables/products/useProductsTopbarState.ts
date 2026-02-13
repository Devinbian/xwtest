import { computed, ref, watch, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import type { SelectedBrand } from './useProductsFilterState';

type CategoryLike = {
  id: number;
  name: string;
};

type ProductLike = {
  id: number;
  name: string;
};

export type FilterChip = {
  key: string;
  label: string;
  title?: string;
  remove: () => void;
};

type UseProductsTopbarStateArgs<
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
> = {
  route: RouteLocationNormalizedLoaded;
  router: Router;
  typedCategories: readonly TCategory[];
  typedProducts: readonly TProduct[];
  selectedCategories: Ref<string[]>;
  selectedBrands: Ref<SelectedBrand[]>;
  selectedNewProduct: Ref<string>;
  searchQuery: Ref<string>;
  hotOnly: Ref<boolean>;
  isMobile: Ref<boolean>;
  toggleProductType: (type: string) => void;
  toggleCategory: (categoryId: number) => void;
  clearSearch: () => void;
  updateQueryParams: () => void;
  getTypeLabel: (type?: string) => string;
};

export const useProductsTopbarState = <
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
>({
  route,
  router,
  typedCategories,
  typedProducts,
  selectedCategories,
  selectedBrands,
  selectedNewProduct,
  searchQuery,
  hotOnly,
  isMobile,
  toggleProductType,
  toggleCategory,
  clearSearch,
  updateQueryParams,
  getTypeLabel,
}: UseProductsTopbarStateArgs<TCategory, TProduct>) => {
  const removeQueryKey = (key: string) => {
    const nextQuery: Record<string, any> = { ...route.query };
    delete nextQuery[key];
    router.replace({ query: nextQuery });
  };

  const filterChips = computed<FilterChip[]>(() => {
    const chips: FilterChip[] = [];
    const brandCategoryIds = new Set(
      selectedBrands.value
        .filter((entry) => Number.isFinite(entry.categoryId) && !!entry.brand)
        .map((entry) => String(entry.categoryId)),
    );

    const type = route.query.type as string | undefined;
    if (type === 'new' || type === 'used') {
      chips.push({
        key: `type:${type}`,
        label: `类型：${getTypeLabel(type)}`,
        remove: () => toggleProductType(type),
      });
    }

    const brandJump = route.query.brand as string | undefined;
    if (brandJump) {
      chips.push({
        key: `brandJump:${brandJump}`,
        label: `全分类品牌：${brandJump}`,
        remove: () => removeQueryKey('brand'),
      });
    }

    const q = searchQuery.value.trim();
    if (q) {
      chips.push({
        key: `q:${q}`,
        label: `搜索：${q}`,
        remove: () => clearSearch(),
      });
    }

    if (hotOnly.value) {
      chips.push({
        key: 'hot:1',
        label: '热门',
        remove: () => {
          hotOnly.value = false;
          updateQueryParams();
        },
      });
    }

    for (const id of selectedCategories.value) {
      if (brandCategoryIds.has(String(id))) continue;
      const category = typedCategories.find((entry) => String(entry.id) === String(id));
      chips.push({
        key: `cat:${id}`,
        label: category ? `分类：${category.name}` : `分类：${id}`,
        remove: () => toggleCategory(Number(id)),
      });
    }

    const brandGroups = new Map<number, string[]>();
    for (const entry of selectedBrands.value) {
      if (!Number.isFinite(entry.categoryId) || !entry.brand) continue;
      const list = brandGroups.get(entry.categoryId) ?? [];
      list.push(entry.brand);
      brandGroups.set(entry.categoryId, list);
    }

    for (const [categoryId, brands] of brandGroups.entries()) {
      const category = typedCategories.find((entry) => entry.id === categoryId);
      const categoryName = category?.name ?? `分类${categoryId}`;
      const uniq = Array.from(new Set(brands));
      const label =
        uniq.length <= 1
          ? `品牌：${categoryName} / ${uniq[0]}`
          : `品牌：${categoryName} / ${uniq[0]} +${uniq.length - 1}`;

      chips.push({
        key: `brandGroup:${categoryId}`,
        label,
        title: `品牌：${categoryName} / ${uniq.join('、')}`,
        remove: () => {
          selectedBrands.value = selectedBrands.value.filter(
            (entry) => entry.categoryId !== categoryId,
          );
          updateQueryParams();
        },
      });
    }

    if (selectedNewProduct.value) {
      const id = selectedNewProduct.value;
      const product = typedProducts.find((entry) => String(entry.id) === String(id));
      chips.push({
        key: `id:${id}`,
        label: product ? `产品：${product.name}` : `ID：${id}`,
        remove: () => {
          selectedNewProduct.value = '';
          updateQueryParams();
        },
      });
    }

    const uniq = new Map<string, FilterChip>();
    for (const chip of chips) uniq.set(chip.key, chip);
    return Array.from(uniq.values());
  });

  const chipsExpanded = ref(false);
  const maxCollapsedChips = computed(() => (isMobile.value ? 2 : 6));
  const displayedFilterChips = computed<FilterChip[]>(() => {
    if (chipsExpanded.value) return filterChips.value;
    return filterChips.value.slice(0, maxCollapsedChips.value);
  });
  const hiddenFilterChipCount = computed(() => {
    const hidden = filterChips.value.length - displayedFilterChips.value.length;
    return hidden > 0 ? hidden : 0;
  });

  watch(filterChips, (next) => {
    if (next.length <= maxCollapsedChips.value) chipsExpanded.value = false;
  });

  const topbarCompactByScroll = ref(false);
  const topbarCompact = computed(() => {
    if (filterChips.value.length === 0) return true;
    return topbarCompactByScroll.value;
  });

  let lastScrollY = 0;
  let topbarScrollRaf = 0;

  const syncTopbarCompact = (next: boolean) => {
    if (topbarCompactByScroll.value === next) return;
    topbarCompactByScroll.value = next;
    if (next) chipsExpanded.value = false;
  };

  const handleTopbarScroll = () => {
    topbarScrollRaf = 0;
    const y = window.scrollY || 0;
    const delta = y - lastScrollY;
    lastScrollY = y;

    if (y <= 40) {
      syncTopbarCompact(false);
      return;
    }

    if (delta > 8 && y > 140) {
      syncTopbarCompact(true);
      return;
    }

    if (delta < -10) {
      syncTopbarCompact(false);
    }
  };

  const onTopbarScroll = () => {
    if (topbarScrollRaf) return;
    topbarScrollRaf = window.requestAnimationFrame(handleTopbarScroll);
  };

  const initializeTopbarScroll = () => {
    lastScrollY = window.scrollY || 0;
    handleTopbarScroll();
  };

  const cleanupTopbarScroll = () => {
    if (!topbarScrollRaf) return;
    window.cancelAnimationFrame(topbarScrollRaf);
    topbarScrollRaf = 0;
  };

  watch(
    () => filterChips.value.length,
    (len, prev) => {
      if (len === 0) {
        topbarCompactByScroll.value = false;
        chipsExpanded.value = false;
        return;
      }
      if (prev === 0) {
        topbarCompactByScroll.value = false;
      }
    },
  );

  return {
    filterChips,
    chipsExpanded,
    displayedFilterChips,
    hiddenFilterChipCount,
    topbarCompact,
    onTopbarScroll,
    initializeTopbarScroll,
    cleanupTopbarScroll,
  };
};
