import { computed, onUnmounted, ref, watch, type ComputedRef, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

export type SelectedBrand = { categoryId: number; brand: string };

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

type UseProductsFilterStateArgs<
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
> = {
  typedCategories: readonly TCategory[];
  productsWithHot: ComputedRef<TProduct[]>;
  route: RouteLocationNormalizedLoaded;
  router: Router;
  hotEditorUnlocked: Ref<boolean>;
};

const firstQueryValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
};

const toTruthyFlag = (value: unknown): boolean => {
  const token = firstQueryValue(value);
  return token === '1' || token === 'true' || token === 'on';
};

export const useProductsFilterState = <
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
>({
  typedCategories,
  productsWithHot,
  route,
  router,
  hotEditorUnlocked,
}: UseProductsFilterStateArgs<TCategory, TProduct>) => {
  const findCategoryForBrand = (brand: string): { categoryId: number; brand: string } | null => {
    const needle = brand.trim().toLowerCase();
    if (!needle) return null;

    for (const category of typedCategories) {
      const canonical = category.brands?.find((b) => String(b).trim().toLowerCase() === needle);
      if (canonical) return { categoryId: category.id, brand: canonical };
    }

    return null;
  };

  const normalizeSelectedBrands = (brands: SelectedBrand[]): SelectedBrand[] => {
    const seen = new Set<string>();
    const normalized: SelectedBrand[] = [];

    for (const entry of brands) {
      const rawBrand = String(entry.brand ?? '').trim();
      if (!rawBrand) continue;

      let categoryId = entry.categoryId;
      let brand = rawBrand;

      const category = Number.isFinite(categoryId)
        ? typedCategories.find((c) => c.id === categoryId)
        : undefined;

      if (category) {
        const canonical =
          category.brands?.find((b) => String(b).trim().toLowerCase() === brand.toLowerCase()) ??
          null;
        if (canonical) {
          brand = canonical;
        } else {
          const recovered = findCategoryForBrand(brand);
          if (recovered) {
            categoryId = recovered.categoryId;
            brand = recovered.brand;
          } else {
            continue;
          }
        }
      } else {
        const recovered = findCategoryForBrand(brand);
        if (recovered) {
          categoryId = recovered.categoryId;
          brand = recovered.brand;
        } else {
          continue;
        }
      }

      if (!Number.isFinite(categoryId)) continue;
      const key = `${categoryId}:${brand}`;
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push({ categoryId, brand });
    }

    return normalized;
  };

  const parseBrandsParam = (value: unknown): SelectedBrand[] => {
    const rawValue = firstQueryValue(value);
    if (!rawValue.trim()) return [];
    return rawValue
      .split(',')
      .map((raw) => raw.trim())
      .filter(Boolean)
      .map((raw) => {
        const idx = raw.indexOf(':');
        if (idx === -1) return { categoryId: Number.NaN, brand: raw };
        const categoryIdRaw = raw.slice(0, idx);
        const brand = raw.slice(idx + 1);
        return { categoryId: Number(categoryIdRaw), brand };
      });
  };

  const serializeBrandsParam = (brands: SelectedBrand[]): string => {
    return brands
      .filter((b) => Number.isFinite(b.categoryId) && !!String(b.brand ?? '').trim())
      .map((b) => `${b.categoryId}:${String(b.brand).trim()}`)
      .join(',');
  };

  const getQueryParams = () => {
    const normalizedBrands = normalizeSelectedBrands(parseBrandsParam(route.query.brands));
    const categoriesRaw = firstQueryValue(route.query.categories);
    return {
      categories: categoriesRaw.split(',').filter(Boolean),
      brands: normalizedBrands,
      newProduct: firstQueryValue(route.query.id),
      type: firstQueryValue(route.query.type),
      q: firstQueryValue(route.query.q),
      hotOnly: toTruthyFlag(route.query.hot),
    };
  };

  const selectedCategories = ref<string[]>(getQueryParams().categories);
  const selectedBrands = ref<SelectedBrand[]>(getQueryParams().brands);
  const selectedNewProduct = ref<string>(getQueryParams().newProduct);
  const selectedType = ref<string>(getQueryParams().type);
  const searchQuery = ref<string>(getQueryParams().q);
  const hotOnly = ref<boolean>(getQueryParams().hotOnly);

  const initializeFilters = () => {
    const params = getQueryParams();
    selectedCategories.value = params.categories;
    selectedBrands.value = params.brands;
    selectedNewProduct.value = params.newProduct;
    selectedType.value = params.type;
    searchQuery.value = params.q;
    hotOnly.value = params.hotOnly;

    const rawBrands = firstQueryValue(route.query.brands);
    const nextBrands = serializeBrandsParam(params.brands);
    if ((rawBrands || '') !== (nextBrands || '')) {
      const nextQuery: Record<string, any> = { ...route.query };
      if (nextBrands) nextQuery.brands = nextBrands;
      else delete nextQuery.brands;
      router.replace({ query: nextQuery });
    }
  };

  const currentCategory = computed(() => {
    const categoryRaw = firstQueryValue(route.query.category);
    return typedCategories.find((c) => c.id === Number(categoryRaw));
  });

  const filteredProducts = computed<TProduct[]>(() => {
    let result = [...productsWithHot.value];

    const routeType = firstQueryValue(route.query.type);
    if (routeType) {
      result = result.filter((product) => product.type === routeType);
    }

    if (selectedCategories.value.length > 0) {
      result = result.filter((product) =>
        selectedCategories.value.includes(String(product.categoryId)),
      );
    }

    if (selectedBrands.value.length > 0) {
      result = result.filter((product) =>
        selectedBrands.value.some(
          (b) => b.categoryId === product.categoryId && b.brand === product.brand,
        ),
      );
    }

    const brandName = firstQueryValue(route.query.brand);
    if (brandName) {
      result = result.filter(
        (product) => product.brandDisplay === brandName || product.brand === brandName,
      );
    }

    if (selectedNewProduct.value) {
      const productId = Number(selectedNewProduct.value);
      result = result.filter((product) => product.id === productId);
    }

    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      result = result.filter((product) => {
        const categoryName =
          typedCategories.find((c) => c.id === product.categoryId)?.name ?? '';
        const haystack = [
          product.name,
          product.brandDisplay,
          product.brand,
          product.description,
          categoryName,
          ...(product.specs ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    if (hotOnly.value) {
      result = result.filter((p) => !!p.isHot || typeof p.hotRank === 'number');
    }

    return result;
  });

  const updateQueryParams = () => {
    const newQuery: Record<string, string> = {};

    if (selectedCategories.value.length > 0) {
      newQuery.categories = selectedCategories.value.join(',');
    }
    if (selectedBrands.value.length > 0) {
      newQuery.brands = selectedBrands.value
        .filter((b) => Number.isFinite(b.categoryId) && !!b.brand)
        .map((b) => `${b.categoryId}:${b.brand}`)
        .join(',');
    }

    if (selectedNewProduct.value) {
      newQuery.id = selectedNewProduct.value;
    }

    const routeType = firstQueryValue(route.query.type);
    if (routeType) {
      newQuery.type = routeType;
    }

    const routeBrand = firstQueryValue(route.query.brand);
    if (routeBrand) {
      newQuery.brand = routeBrand;
    }

    const hotGate = firstQueryValue(route.query.__hot);
    if (hotGate) {
      newQuery.__hot = hotGate;
    }

    if (hotOnly.value) {
      newQuery.hot = '1';
    }

    const q = searchQuery.value.trim();
    if (q) {
      newQuery.q = q;
    }

    router.replace({
      query: newQuery,
    });
  };

  const isCategorySelected = (categoryId: number) =>
    selectedCategories.value.includes(String(categoryId));

  const isBrandSelected = (categoryId: number, brand: string) => {
    if (!Number.isFinite(categoryId)) {
      return selectedBrands.value.some(
        (b) => b.brand === brand && !Number.isFinite(b.categoryId),
      );
    }
    return selectedBrands.value.some(
      (b) => b.categoryId === categoryId && b.brand === brand,
    );
  };

  const toggleCategory = (categoryId: number) => {
    selectedNewProduct.value = '';

    const categoryIdStr = String(categoryId);
    const index = selectedCategories.value.indexOf(categoryIdStr);
    if (index === -1) {
      selectedCategories.value.push(categoryIdStr);
    } else {
      selectedCategories.value.splice(index, 1);
    }
    updateQueryParams();
  };

  const toggleBrand = (categoryId: number, brand: string) => {
    selectedNewProduct.value = '';

    if (!Number.isFinite(categoryId)) {
      selectedBrands.value = selectedBrands.value.filter((b) => b.brand !== brand);
      updateQueryParams();
      return;
    }

    const index = selectedBrands.value.findIndex(
      (b) => b.categoryId === categoryId && b.brand === brand,
    );

    if (index === -1) {
      selectedBrands.value.push({ categoryId, brand });
    } else {
      selectedBrands.value.splice(index, 1);
    }

    updateQueryParams();
  };

  const toggleProductType = (type: string) => {
    const newQuery = { ...route.query } as Record<string, any>;
    const currentType = firstQueryValue(route.query.type);

    if (currentType === type) {
      delete newQuery.type;
    } else {
      newQuery.type = type;
      delete newQuery.id;
    }

    router.push({ query: newQuery });
    selectedNewProduct.value = '';
  };

  const commitSearch = () => {
    const q = searchQuery.value.trim();
    const newQuery: Record<string, any> = { ...route.query };

    if (q) newQuery.q = q;
    else delete newQuery.q;

    if (newQuery.id) delete newQuery.id;
    selectedNewProduct.value = '';

    router.replace({ query: newQuery });
  };

  let searchCommitTimer: number | null = null;
  const onSearchInput = () => {
    if (searchCommitTimer) window.clearTimeout(searchCommitTimer);
    searchCommitTimer = window.setTimeout(() => {
      commitSearch();
    }, 240);
  };

  const clearSearch = () => {
    searchQuery.value = '';
    commitSearch();
  };

  const toggleHotOnly = () => {
    hotOnly.value = !hotOnly.value;
    if (firstQueryValue(route.query.id)) {
      selectedNewProduct.value = '';
    }
    updateQueryParams();
  };

  const activeFiltersCount = computed(() => {
    let count = 0;
    if (firstQueryValue(route.query.type)) count += 1;
    if (firstQueryValue(route.query.brand)) count += 1;
    if (hotOnly.value) count += 1;
    if (searchQuery.value.trim()) count += 1;
    count += selectedCategories.value.length;
    count += selectedBrands.value.length;
    if (selectedNewProduct.value) count += 1;
    return count;
  });

  const clearFilters = () => {
    selectedType.value = '';
    selectedBrands.value = [];
    selectedCategories.value = [];
    selectedNewProduct.value = '';
    searchQuery.value = '';
    hotOnly.value = false;

    router.push({
      name: 'products',
      query: hotEditorUnlocked.value ? { __hot: '1' } : {},
    });
  };

  watch(
    () => route.query,
    () => {
      if (!firstQueryValue(route.query.id)) {
        selectedNewProduct.value = '';
      }
      initializeFilters();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (searchCommitTimer) {
      window.clearTimeout(searchCommitTimer);
      searchCommitTimer = null;
    }
  });

  return {
    selectedCategories,
    selectedBrands,
    selectedNewProduct,
    searchQuery,
    hotOnly,
    currentCategory,
    filteredProducts,
    activeFiltersCount,
    isCategorySelected,
    isBrandSelected,
    toggleCategory,
    toggleBrand,
    toggleProductType,
    clearFilters,
    clearSearch,
    commitSearch,
    onSearchInput,
    toggleHotOnly,
    updateQueryParams,
    normalizeSelectedBrands,
  };
};
