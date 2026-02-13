import { computed, reactive, ref, type ComputedRef, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import type { SelectedBrand } from './useProductsFilterState';

type CategoryLike = {
  id: number;
  name: string;
};

type ProductLike = {
  id: number;
  name: string;
  brand: string;
  brandDisplay?: string;
  condition: string;
  link?: string;
};

export type SpecPart = {
  text: string;
  sup: boolean;
};

type UseProductsPresentationStateArgs<
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
> = {
  route: RouteLocationNormalizedLoaded;
  typedCategories: readonly TCategory[];
  selectedCategories: Ref<string[]>;
  selectedBrands: Ref<SelectedBrand[]>;
  filteredProducts: ComputedRef<TProduct[]>;
  getTypeLabel: (type?: string) => string;
};

const CONDITION_TEXT_MAP = {
  new: '全新',
  used: '二手',
  refurbished: '翻新',
  sale: '促销',
  discount: '50%',
} as const;

const stripInlineTags = (value: string): string => {
  return String(value ?? '').replace(/<[^>]*>/g, '');
};

export const useProductsPresentationState = <
  TCategory extends CategoryLike,
  TProduct extends ProductLike,
>({
  route,
  typedCategories,
  selectedCategories,
  selectedBrands,
  filteredProducts,
  getTypeLabel,
}: UseProductsPresentationStateArgs<TCategory, TProduct>) => {
  const getConditionText = (condition: string) => {
    return CONDITION_TEXT_MAP[condition as keyof typeof CONDITION_TEXT_MAP] || '未知';
  };

  const formatSpecParts = (spec: string): SpecPart[] => {
    const raw = String(spec ?? '');
    const normalized = raw.replace(
      /(\d+)\s*[×x]\s*10([+-]?\d+)/g,
      '$1×10<sup>$2</sup>',
    );

    const parts: SpecPart[] = [];
    const supPattern = /<sup>(.*?)<\/sup>/gi;
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = supPattern.exec(normalized)) !== null) {
      const plain = stripInlineTags(normalized.slice(cursor, match.index));
      if (plain) parts.push({ text: plain, sup: false });

      const exponent = stripInlineTags(match[1] ?? '');
      if (exponent) parts.push({ text: exponent, sup: true });

      cursor = supPattern.lastIndex;
    }

    const tail = stripInlineTags(normalized.slice(cursor));
    if (tail) parts.push({ text: tail, sup: false });

    return parts;
  };

  const expandedSpecIds = reactive(new Set<number>());
  const isSpecsExpanded = (id: number) => expandedSpecIds.has(id);
  const toggleSpecsExpanded = (id: number) => {
    if (expandedSpecIds.has(id)) {
      expandedSpecIds.delete(id);
      return;
    }
    expandedSpecIds.add(id);
  };

  const showQuoteDialog = ref(false);
  const selectedProduct = ref<TProduct | null>(null);

  const consultContextText = computed(() => {
    const lines: string[] = [];

    lines.push('【产品信息】');
    if (selectedProduct.value) {
      const product = selectedProduct.value;
      lines.push(`名称：${product.name}`);
      lines.push(`品牌：${product.brandDisplay || product.brand}`);
      lines.push(`成色：${getConditionText(product.condition)}`);
      if (product.link) lines.push(`详情链接：${product.link}`);
    } else {
      lines.push('未指定（请补充型号/参数/用途）');
    }

    lines.push('');
    lines.push('【当前筛选】');
    lines.push(`类型：${getTypeLabel(route.query.type as string | undefined)}`);

    const categoryNames = selectedCategories.value
      .map((id) => typedCategories.find((category) => category.id === Number(id))?.name)
      .filter(Boolean) as string[];
    lines.push(`分类：${categoryNames.length ? categoryNames.join('、') : '全部'}`);

    const brandGroups = new Map<number, string[]>();
    for (const selected of selectedBrands.value) {
      const list = brandGroups.get(selected.categoryId) ?? [];
      list.push(selected.brand);
      brandGroups.set(selected.categoryId, list);
    }
    const brandText = Array.from(brandGroups.entries()).map(([categoryId, brands]) => {
      const categoryName =
        typedCategories.find((category) => category.id === categoryId)?.name ?? `分类${categoryId}`;
      const uniq = Array.from(new Set(brands));
      return `${categoryName}：${uniq.join('、')}`;
    });
    lines.push(`品牌：${brandText.length ? brandText.join('；') : '全部'}`);

    if (route.query.brand) {
      lines.push(`品牌跳转：${route.query.brand as string}`);
    }
    if (filteredProducts.value.length) {
      lines.push(`当前列表数量：${filteredProducts.value.length}`);
    }

    lines.push('');
    lines.push('【咨询内容】价格 / 交期 / 质保 / 是否现货 / 服务承诺');

    try {
      lines.push('');
      lines.push(`页面：${window.location.href}`);
    } catch {
      // ignore
    }

    return lines.join('\n');
  });

  const openQuoteDialog = (product?: TProduct | null) => {
    selectedProduct.value = product ?? null;
    showQuoteDialog.value = true;
  };

  const closeQuoteDialog = () => {
    showQuoteDialog.value = false;
    selectedProduct.value = null;
  };

  return {
    getConditionText,
    formatSpecParts,
    isSpecsExpanded,
    toggleSpecsExpanded,
    showQuoteDialog,
    selectedProduct,
    consultContextText,
    openQuoteDialog,
    closeQuoteDialog,
  };
};
