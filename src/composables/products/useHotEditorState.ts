import { computed, ref, watch } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import {
  applyHotOverrides,
  authorizeHotEditorSession,
  clearHotEditorSession,
  fetchHotConfig,
  getHotEditorSession,
  notifyHotOverridesChanged,
  saveHotConfig,
  type HotOverride,
} from '@/utils/hotProducts';

type ProductLike = {
  id: number;
  isHot?: boolean;
  hotRank?: number;
};

type UseHotEditorStateArgs<TProduct extends ProductLike> = {
  typedProducts: readonly TProduct[];
  route: RouteLocationNormalizedLoaded;
  router: Router;
  enabledStorageKey?: string;
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

const safeGetLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetLocalStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

type HotConfigSnapshot = {
  overrides: Record<string, HotOverride>;
  disableAllHot: boolean;
};

export const useHotEditorState = <TProduct extends ProductLike>({
  typedProducts,
  route,
  router,
  enabledStorageKey = 'xw:hot-editor:enabled',
}: UseHotEditorStateArgs<TProduct>) => {
  const isHotEditorUnlockQuery = computed(() => toTruthyFlag(route.query.__hot));
  const hotEditorOneTimeToken = computed(() => {
    const token = firstQueryValue(route.query.__token);
    return token.trim();
  });

  const hotEditorUnlocked = ref(false);
  const hotEditorEnabled = ref(false);
  const hotConfig = ref<HotConfigSnapshot>({
    overrides: {},
    disableAllHot: false,
  });
  const isSavingHotOverrides = ref(false);
  const hotEditorAuthorized = ref(false);
  const hotAdminMenu = ref<HTMLDetailsElement | null>(null);

  const productsWithHot = computed<TProduct[]>(() => {
    return applyHotOverrides(
      typedProducts,
      hotConfig.value.overrides,
      hotConfig.value.disableAllHot,
    );
  });

  const loadHotConfig = async () => {
    const cfg = await fetchHotConfig();
    hotConfig.value = {
      overrides: cfg.overrides ?? {},
      disableAllHot: cfg.disableAllHot === true,
    };
  };

  const refreshHotEditorSession = async () => {
    hotEditorAuthorized.value = await getHotEditorSession();
    if (!hotEditorAuthorized.value && hotEditorEnabled.value) {
      hotEditorEnabled.value = false;
      safeSetLocalStorage(enabledStorageKey, '0');
    }
  };

  const authorizeHotEditor = async (token?: string) => {
    const resolved =
      String(token ?? '').trim() ||
      String(window.prompt('请输入热门编辑口令（服务器端 HOT_EDITOR_TOKEN）') ?? '').trim();
    if (!resolved) return false;
    await authorizeHotEditorSession(resolved);
    await refreshHotEditorSession();
    return hotEditorAuthorized.value;
  };

  const logoutHotEditor = async () => {
    await clearHotEditorSession();
    await refreshHotEditorSession();
    hotEditorEnabled.value = false;
    safeSetLocalStorage(enabledStorageKey, '0');
  };

  const closeHotAdminMenu = () => {
    hotAdminMenu.value?.removeAttribute('open');
  };

  const persistHotConfig = async (next: HotConfigSnapshot) => {
    if (isSavingHotOverrides.value) return;
    if (!hotEditorAuthorized.value) {
      const ok = await authorizeHotEditor();
      if (!ok) return;
    }

    hotConfig.value = next;
    isSavingHotOverrides.value = true;
    try {
      await saveHotConfig(next);
      notifyHotOverridesChanged();
    } catch (err) {
      await loadHotConfig();
      const message = String((err as any)?.message ?? err);
      if (message === 'unauthorized') {
        await refreshHotEditorSession();
        window.alert('热门编辑口令不正确或未配置，保存失败。');
      } else {
        window.alert('保存热门配置失败，请稍后重试。');
      }
    } finally {
      isSavingHotOverrides.value = false;
    }
  };

  const enterHotEdit = async () => {
    if (isSavingHotOverrides.value) return;
    const ok = await refreshHotEditorSession().then(() => hotEditorAuthorized.value);
    if (!ok) {
      const authorized = await authorizeHotEditor();
      if (!authorized) return;
    }
    hotEditorEnabled.value = true;
    safeSetLocalStorage(enabledStorageKey, '1');
  };

  const exitHotEdit = async () => {
    closeHotAdminMenu();
    hotEditorEnabled.value = false;
    safeSetLocalStorage(enabledStorageKey, '0');
  };

  const toggleHotEditor = () => {
    if (!hotEditorUnlocked.value) return;
    hotEditorEnabled.value = !hotEditorEnabled.value;
    safeSetLocalStorage(enabledStorageKey, hotEditorEnabled.value ? '1' : '0');
  };

  const restoreDefaultHot = () => {
    closeHotAdminMenu();
    void persistHotConfig({ overrides: {}, disableAllHot: false });
  };

  const clearAllHot = () => {
    closeHotAdminMenu();
    const ok = window.confirm('确认清空所有热门标记？（将覆盖代码默认热门）');
    if (!ok) return;
    void persistHotConfig({ overrides: {}, disableAllHot: true });
  };

  const setProductHot = (productId: number, nextIsHot: boolean) => {
    const key = String(productId);
    const nextOverrides = { ...hotConfig.value.overrides };
    const previous = nextOverrides[key] ?? {};

    if (nextIsHot) {
      const { hotRank } = previous;
      nextOverrides[key] = { ...previous, isHot: true };
      if (typeof hotRank === 'number') nextOverrides[key].hotRank = hotRank;
      else if (hotRank === null) delete nextOverrides[key].hotRank;
    } else {
      nextOverrides[key] = { isHot: false };
    }

    void persistHotConfig({ ...hotConfig.value, overrides: nextOverrides });
  };

  const setProductHotRank = (productId: number, raw: string) => {
    const key = String(productId);
    const trimmed = String(raw ?? '').trim();
    const rank = trimmed ? Number.parseInt(trimmed, 10) : Number.NaN;
    const normalizedRank = Number.isFinite(rank) ? Math.trunc(rank) : undefined;

    const nextOverrides = { ...hotConfig.value.overrides };

    if (!trimmed) {
      const current = nextOverrides[key] ?? {};
      nextOverrides[key] = { ...current, isHot: true, hotRank: null };
      void persistHotConfig({ ...hotConfig.value, overrides: nextOverrides });
      return;
    }

    if (!normalizedRank || normalizedRank < 1 || normalizedRank > 10) return;

    for (const product of typedProducts) {
      if (product.id === productId) continue;
      if (product.hotRank === normalizedRank) {
        const otherKey = String(product.id);
        nextOverrides[otherKey] = { ...(nextOverrides[otherKey] ?? {}), hotRank: null };
      }
    }
    for (const [otherKey, override] of Object.entries(nextOverrides)) {
      if (otherKey === key) continue;
      if (typeof override?.hotRank === 'number' && override.hotRank === normalizedRank) {
        nextOverrides[otherKey] = { ...(override ?? {}), hotRank: null };
      }
    }

    nextOverrides[key] = { ...(nextOverrides[key] ?? {}), isHot: true, hotRank: normalizedRank };
    void persistHotConfig({ ...hotConfig.value, overrides: nextOverrides });
  };

  const initializeHotEditor = () => {
    void refreshHotEditorSession();
    void loadHotConfig();

    hotEditorEnabled.value =
      hotEditorUnlocked.value && safeGetLocalStorage(enabledStorageKey) === '1';

    if (hotEditorUnlocked.value && hotEditorOneTimeToken.value) {
      void authorizeHotEditor(hotEditorOneTimeToken.value).finally(() => {
        const nextQuery = { ...route.query } as Record<string, any>;
        delete nextQuery.__token;
        router.replace({ query: nextQuery });
      });
    }
  };

  watch(
    isHotEditorUnlockQuery,
    (unlocked) => {
      hotEditorUnlocked.value = unlocked;
      if (!unlocked) hotEditorEnabled.value = false;
    },
    { immediate: true },
  );

  return {
    hotEditorUnlocked,
    hotEditorEnabled,
    isSavingHotOverrides,
    hotEditorAuthorized,
    hotAdminMenu,
    productsWithHot,
    refreshHotEditorSession,
    loadHotConfig,
    authorizeHotEditor,
    logoutHotEditor,
    enterHotEdit,
    exitHotEdit,
    toggleHotEditor,
    restoreDefaultHot,
    clearAllHot,
    setProductHot,
    setProductHotRank,
    initializeHotEditor,
  };
};
