export const generatePlaceholderUrl = (originalUrl: string): string => {
  // 如果是开发环境，直接返回原图
  if (import.meta.env.DEV) {
    return originalUrl;
  }
  
  // 生产环境下，返回低质量预览图的URL
  // 移除重复的 base 路径
  const cleanUrl = originalUrl.replace(/^\/xwtest\//, '').replace(/^\//, '');
  
  // 生成小图URL
  const smallImageUrl = cleanUrl.replace(/(\.[^.]+)$/, '-small.jpg');
  
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
