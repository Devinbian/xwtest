import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue';
import type { SelectedBrand } from './useProductsFilterState';

type CategoryLike = {
  id: number;
  name: string;
  brands: string[];
};

type DesktopBrandSuggestion = {
  key: string;
  brand: string;
  scopeLabel: string;
  kind: 'all' | 'one';
  categoryIds: number[];
  categoryId?: number;
};

type UseDesktopBrandFacetsStateArgs<TCategory extends CategoryLike> = {
  typedCategories: readonly TCategory[];
  selectedCategories: Ref<string[]>;
  selectedBrands: Ref<SelectedBrand[]>;
  selectedNewProduct: Ref<string>;
  normalizeSelectedBrands: (brands: SelectedBrand[]) => SelectedBrand[];
  updateQueryParams: () => void;
  isBrandSelected: (categoryId: number, brand: string) => boolean;
  toggleBrand: (categoryId: number, brand: string) => void;
  isMobile: Ref<boolean>;
};

export const DESKTOP_BRAND_PREVIEW_LIMIT = 10;

const normalizeToken = (value: string): string =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '');

export const useDesktopBrandFacetsState = <TCategory extends CategoryLike>({
  typedCategories,
  selectedCategories,
  selectedBrands,
  selectedNewProduct,
  normalizeSelectedBrands,
  updateQueryParams,
  isBrandSelected,
  toggleBrand,
  isMobile,
}: UseDesktopBrandFacetsStateArgs<TCategory>) => {
  const desktopBrandQuery = ref('');
  const desktopOnlyShowSelected = ref(false);
  const desktopExpandedCategories = reactive<Record<number, boolean>>({});
  const desktopShowAllBrands = reactive<Record<number, boolean>>({});
  const desktopBrandPickerOpen = ref(false);
  const desktopBrandPickerRoot = ref<HTMLElement | null>(null);
  const desktopBrandPickerInput = ref<HTMLInputElement | null>(null);
  const desktopCategoriesMenuEl = ref<HTMLElement | null>(null);

  const handleDesktopMenuWheel = (event: WheelEvent) => {
    const menu = desktopCategoriesMenuEl.value;
    if (!menu) return;
    if (event.deltaY === 0) return;
    const atTop = menu.scrollTop <= 0;
    const atBottom = menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1;
    if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
      event.preventDefault();
    }
  };

  const brandToCategoryIds = new Map<string, number[]>();
  for (const category of typedCategories) {
    for (const brand of category.brands ?? []) {
      const name = String(brand ?? '').trim();
      if (!name) continue;
      const ids = brandToCategoryIds.get(name) ?? [];
      if (!ids.includes(category.id)) ids.push(category.id);
      brandToCategoryIds.set(name, ids);
    }
  }

  const desktopBrandSuggestions = computed<DesktopBrandSuggestion[]>(() => {
    const q = normalizeToken(desktopBrandQuery.value);
    if (!q) return [];

    const suggestions: DesktopBrandSuggestion[] = [];
    const seen = new Set<string>();

    for (const [brand, categoryIds] of brandToCategoryIds.entries()) {
      const brandKey = normalizeToken(brand);
      if (!brandKey.includes(q)) continue;

      if (categoryIds.length > 1) {
        const key = `all:${brand}`;
        if (!seen.has(key)) {
          seen.add(key);
          suggestions.push({
            key,
            brand,
            kind: 'all',
            categoryIds: [...categoryIds],
            scopeLabel: '全部分类',
          });
        }
      }

      for (const id of categoryIds) {
        const categoryName = typedCategories.find((c) => c.id === id)?.name ?? '';
        const key = `one:${id}:${brand}`;
        if (seen.has(key)) continue;
        seen.add(key);
        suggestions.push({
          key,
          brand,
          kind: 'one',
          categoryIds: [id],
          categoryId: id,
          scopeLabel: categoryName || '分类',
        });
      }
    }

    const starts = (suggestion: DesktopBrandSuggestion) =>
      normalizeToken(suggestion.brand).startsWith(q);
    suggestions.sort((a, b) => {
      const aStarts = starts(a);
      const bStarts = starts(b);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      if (a.kind !== b.kind) return a.kind === 'all' ? -1 : 1;
      return a.brand.localeCompare(b.brand);
    });

    return suggestions.slice(0, 8);
  });

  const isCategoryExpanded = (categoryId: number) => !!desktopExpandedCategories[categoryId];
  const toggleCategoryExpanded = (categoryId: number) => {
    desktopExpandedCategories[categoryId] = !desktopExpandedCategories[categoryId];
  };

  const selectedBrandCountByCategory = (categoryId: number) => {
    return selectedBrands.value.filter(
      (entry) => entry.categoryId === categoryId && !!String(entry.brand ?? '').trim(),
    ).length;
  };

  const clearCategoryFilters = (categoryId: number) => {
    selectedNewProduct.value = '';
    const categoryIdStr = String(categoryId);
    selectedCategories.value = selectedCategories.value.filter(
      (id) => String(id) !== categoryIdStr,
    );
    selectedBrands.value = selectedBrands.value.filter(
      (entry) => entry.categoryId !== categoryId,
    );
    updateQueryParams();
  };

  const desktopVisibleCategories = computed(() => {
    if (!desktopOnlyShowSelected.value) return typedCategories;
    const keep = new Set<number>();
    for (const idRaw of selectedCategories.value) {
      const id = Number(idRaw);
      if (Number.isFinite(id)) keep.add(id);
    }
    for (const entry of selectedBrands.value) {
      if (Number.isFinite(entry.categoryId)) keep.add(entry.categoryId);
    }
    if (keep.size === 0) return typedCategories;
    return typedCategories.filter((category) => keep.has(category.id));
  });

  let desktopExpansionSeeded = false;
  const seedDesktopExpandedCategories = () => {
    if (desktopExpansionSeeded) return;
    desktopExpansionSeeded = true;

    const ids = new Set<number>();
    for (const raw of selectedCategories.value) {
      const id = Number(raw);
      if (Number.isFinite(id)) ids.add(id);
    }
    for (const entry of selectedBrands.value) {
      if (Number.isFinite(entry.categoryId)) ids.add(entry.categoryId);
    }
    for (const id of ids) desktopExpandedCategories[id] = true;
  };

  const expandSelectedFacets = () => {
    for (const raw of selectedCategories.value) {
      const id = Number(raw);
      if (Number.isFinite(id)) desktopExpandedCategories[id] = true;
    }
    for (const entry of selectedBrands.value) {
      if (Number.isFinite(entry.categoryId)) {
        desktopExpandedCategories[entry.categoryId] = true;
      }
    }
  };

  const desktopBrandsForCategory = (category: TCategory): string[] => {
    const base = [...(category.brands ?? [])].map((brand) => String(brand)).filter(Boolean);
    base.sort((a, b) => {
      const aSelected = isBrandSelected(category.id, a);
      const bSelected = isBrandSelected(category.id, b);
      if (aSelected !== bSelected) return aSelected ? -1 : 1;
      return a.localeCompare(b);
    });

    if (desktopShowAllBrands[category.id]) return base;
    return base.slice(0, DESKTOP_BRAND_PREVIEW_LIMIT);
  };

  const toggleDesktopShowAllBrands = (categoryId: number) => {
    desktopShowAllBrands[categoryId] = !desktopShowAllBrands[categoryId];
  };

  const toggleBrandAcrossCategories = (brand: string, categoryIds: number[]) => {
    selectedNewProduct.value = '';

    const trimmedBrand = String(brand ?? '').trim();
    const ids = categoryIds.filter((id) => Number.isFinite(id));
    if (!trimmedBrand || ids.length === 0) return;

    const selectedSet = new Set(
      selectedBrands.value.map((entry) => `${entry.categoryId}:${entry.brand}`),
    );
    const keys = ids.map((id) => `${id}:${trimmedBrand}`);
    const shouldRemove = keys.every((key) => selectedSet.has(key));

    let next = selectedBrands.value.filter(
      (entry) => !(entry.brand === trimmedBrand && ids.includes(entry.categoryId)),
    );
    if (!shouldRemove) {
      for (const id of ids) {
        if (selectedSet.has(`${id}:${trimmedBrand}`)) continue;
        next.push({ categoryId: id, brand: trimmedBrand });
        desktopExpandedCategories[id] = true;
      }
    }

    selectedBrands.value = normalizeSelectedBrands(next);
    updateQueryParams();
  };

  const applyDesktopBrandSuggestion = (suggestion: DesktopBrandSuggestion) => {
    if (suggestion.kind === 'all') {
      toggleBrandAcrossCategories(suggestion.brand, suggestion.categoryIds);
    } else {
      const categoryId = suggestion.categoryId ?? suggestion.categoryIds[0];
      desktopExpandedCategories[categoryId] = true;
      toggleBrand(categoryId, suggestion.brand);
    }
    desktopBrandQuery.value = '';
    desktopBrandPickerOpen.value = false;
  };

  watch(
    [selectedCategories, selectedBrands],
    () => {
      if (isMobile.value) return;
      expandSelectedFacets();
    },
    { deep: true },
  );

  const openDesktopBrandPicker = async () => {
    desktopBrandPickerOpen.value = true;
    await nextTick();
    desktopBrandPickerInput.value?.focus?.();
  };

  const closeDesktopBrandPicker = () => {
    desktopBrandPickerOpen.value = false;
    desktopBrandQuery.value = '';
  };

  const toggleDesktopBrandPicker = () => {
    if (desktopBrandPickerOpen.value) closeDesktopBrandPicker();
    else void openDesktopBrandPicker();
  };

  const handleDesktopBrandPickerDismiss = (event: Event) => {
    if (!desktopBrandPickerOpen.value) return;
    const root = desktopBrandPickerRoot.value;
    const target = event.target as Node | null;
    if (!target) return;
    if (root?.contains(target)) return;
    closeDesktopBrandPicker();
  };

  return {
    desktopBrandQuery,
    desktopOnlyShowSelected,
    desktopExpandedCategories,
    desktopShowAllBrands,
    desktopBrandPickerOpen,
    desktopBrandPickerRoot,
    desktopBrandPickerInput,
    desktopCategoriesMenuEl,
    desktopBrandSuggestions,
    isCategoryExpanded,
    toggleCategoryExpanded,
    selectedBrandCountByCategory,
    clearCategoryFilters,
    desktopVisibleCategories,
    seedDesktopExpandedCategories,
    desktopBrandsForCategory,
    toggleDesktopShowAllBrands,
    applyDesktopBrandSuggestion,
    closeDesktopBrandPicker,
    toggleDesktopBrandPicker,
    handleDesktopBrandPickerDismiss,
    handleDesktopMenuWheel,
  };
};
