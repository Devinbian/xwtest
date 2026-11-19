export const generatePlaceholderUrl = (originalUrl: string): string => {
  // 外部图片没有本项目生成的占位资源。
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(originalUrl)) return originalUrl;

  const base = import.meta.env.BASE_URL;
  const url = originalUrl.startsWith(base)
    ? originalUrl
    : `${base}${originalUrl.replace(/^\//, '')}`;

  // 保留查询参数和 hash，仅修改路径的扩展名。
  const [, pathname, suffix = ''] = url.match(/^([^?#]*)(.*)$/)!;
  return pathname.replace(/\.(jpe?g|png|webp|avif)$/i, (_, ext: string) => {
    const smallExt = /^(webp|avif)$/i.test(ext) ? 'jpg' : ext;
    return `-small.${smallExt}`;
  }) + suffix;
};
