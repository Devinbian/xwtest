export type HotOverride = {
  isHot?: boolean;
  hotRank?: number | null;
};

export type HotConfig = {
  overrides: Record<string, HotOverride>;
  disableAllHot: boolean;
  updatedAt?: string | null;
};

export const HOT_PRODUCTS_CHANGED_EVENT = 'xw:hot-products-changed';
export const HOT_PRODUCTS_API_PATH = '/api/hot-products';
export const HOT_PRODUCTS_SESSION_API_PATH = '/api/hot-products/session';

export const notifyHotOverridesChanged = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(HOT_PRODUCTS_CHANGED_EVENT));
};

export const getHotEditorSession = async (): Promise<boolean> => {
  try {
    const res = await fetch(HOT_PRODUCTS_SESSION_API_PATH, {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!res.ok) return false;
    const payload = (await res.json()) as any;
    return !!payload?.authorized;
  } catch {
    return false;
  }
};

export const authorizeHotEditorSession = async (token: string) => {
  let res: Response;
  try {
    res = await fetch(HOT_PRODUCTS_SESSION_API_PATH, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({ token: String(token ?? '').trim() }),
    });
  } catch {
    throw new Error('network_error');
  }

  if (res.ok) return;
  if (res.status === 401) throw new Error('unauthorized');
  throw new Error(`authorize_failed_${res.status}`);
};

export const clearHotEditorSession = async () => {
  try {
    await fetch(HOT_PRODUCTS_SESSION_API_PATH, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
  } catch {
    // ignore
  }
};

export const fetchHotOverrides = async (): Promise<Record<string, HotOverride>> => {
  const config = await fetchHotConfig();
  return config.overrides;
};

export const fetchHotConfig = async (): Promise<HotConfig> => {
  try {
    const res = await fetch(HOT_PRODUCTS_API_PATH, {
      method: 'GET',
      headers: { accept: 'application/json' },
      credentials: 'same-origin',
    });
    if (!res.ok) return { overrides: {}, disableAllHot: false, updatedAt: null };
    const payload = (await res.json()) as unknown;
    if (!payload || typeof payload !== 'object') return { overrides: {}, disableAllHot: false, updatedAt: null };
    const overrides = (payload as any).overrides;
    const disableAllHot = (payload as any).disableAllHot === true;
    const updatedAt = typeof (payload as any).updatedAt === 'string' ? (payload as any).updatedAt : null;
    if (!overrides || typeof overrides !== 'object') return { overrides: {}, disableAllHot, updatedAt };
    return { overrides: overrides as Record<string, HotOverride>, disableAllHot, updatedAt };
  } catch {
    return { overrides: {}, disableAllHot: false, updatedAt: null };
  }
};

export const saveHotOverrides = async (overrides: Record<string, HotOverride>) => {
  return saveHotConfig({ overrides, disableAllHot: false });
};

export const saveHotConfig = async (config: Pick<HotConfig, 'overrides' | 'disableAllHot'>) => {
  let res;
  try {
    res = await fetch(HOT_PRODUCTS_API_PATH, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        overrides: config?.overrides ?? {},
        disableAllHot: config?.disableAllHot === true,
      }),
    });
  } catch {
    throw new Error('network_error');
  }

  if (res.ok) return;
  if (res.status === 401) throw new Error('unauthorized');
  throw new Error(`save_failed_${res.status}`);
};

export const applyHotOverrides = <
  T extends { id: number; isHot?: boolean; hotRank?: number },
>(
  products: readonly T[],
  overrides: Record<string, HotOverride> = {},
  disableAllHot = false,
): T[] => {
  return products.map((product) => {
    const override = overrides[String(product.id)];
    const baselineIsHot = disableAllHot ? false : product.isHot;
    const baselineHotRank = disableAllHot ? undefined : product.hotRank;

    if (!override) {
      if (!disableAllHot) return product;
      if (product.isHot === baselineIsHot && product.hotRank === baselineHotRank) return product;
      return { ...product, isHot: baselineIsHot, hotRank: baselineHotRank };
    }

    const isHot =
      typeof override.isHot === 'boolean'
        ? override.isHot
        : typeof override.hotRank === 'number'
          ? true
          : baselineIsHot;

    const hotRank =
      typeof override.hotRank === 'number'
        ? override.hotRank
        : override.hotRank === null
          ? undefined
          : override.isHot === false
            ? undefined
            : baselineHotRank;

    if (!disableAllHot && isHot === product.isHot && hotRank === product.hotRank) return product;
    if (disableAllHot && isHot === baselineIsHot && hotRank === baselineHotRank) return { ...product, isHot, hotRank };
    return { ...product, isHot, hotRank };
  });
};
