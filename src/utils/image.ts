export const generatePlaceholderUrl = (originalUrl: string): string => {
  // 如果是开发环境，直接返回原图
  if (import.meta.env.DEV) {
    return originalUrl;
  }
  
  // 生产环境下，返回低质量预览图的URL
  // 假设您的低质量预览图命名规则是 original-small.jpg
  return originalUrl.replace(/(\.[^.]+)$/, '-small$1');
}; 
