export const generatePlaceholderUrl = (originalUrl: string): string => {
  // 如果是开发环境，直接返回原图
  if (import.meta.env.DEV) {
    return originalUrl;
  }
  
  // 生产环境下，返回低质量预览图的URL
  // 移除重复的 base 路径
  const cleanUrl = originalUrl.replace(/^\/xwtest\//, '').replace(/^\//, '');

  const urlPath = cleanUrl.split('?')[0].split('#')[0];
  const lastSlash = urlPath.lastIndexOf('/');
  const lastDot = urlPath.lastIndexOf('.');
  const ext =
    lastDot > lastSlash ? urlPath.slice(lastDot + 1).toLowerCase() : 'jpg';
  const smallExt = ext === 'avif' || ext === 'webp' ? 'jpg' : ext;

  // 生成小图URL（保持与原图扩展名一致；对 avif/webp 强制使用 jpg 作为占位兜底）
  const smallImageUrl = cleanUrl.replace(/(\.[^.]+)$/, `-small.${smallExt}`);
  
  // 添加正确的 base 路径
  return `${import.meta.env.BASE_URL}${smallImageUrl}`;
};

export const preloadImage = (src: string): Promise<void> => {
  // 移除重复的 base 路径
  const cleanUrl = src.replace(/^\/xwtest\//, '').replace(/^\//, '');
  
  // 添加正确的 base 路径
  const finalUrl = `${import.meta.env.BASE_URL}${cleanUrl}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = finalUrl;
  });
}; 
