export const generatePlaceholderUrl = (originalUrl: string): string => {
  // 如果是开发环境，直接返回原图
  if (import.meta.env.DEV) {
    return originalUrl;
  }
  
  // 生产环境下，返回低质量预览图的URL
  // 假设您的低质量预览图命名规则是 original-small.jpg
  // 解析URL
  const base = import.meta.env.BASE_URL; // "/xwtest/" 或 "/"
  const urlWithoutBase = originalUrl.replace(base, '');
  
  // 生成小图URL
  const smallImageUrl = urlWithoutBase.replace(/(\.[^.]+)$/, '-small$1');
  
  // 重新添加base路径
  return `${base}${smallImageUrl}`;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });
}; 
