import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 使用函数式配置
export default defineConfig(({ command }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '/@': path.resolve(__dirname, 'src')
      }
    },
    publicDir: 'public',
    build: {
      assetsDir: 'assets'
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // Use Dart Sass modern JS API (Dart Sass 2.0 removes legacy API)
          api: 'modern'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      https: false,
    },
    // base: command === 'build' ? '/xwtest/' : '/',  //发布到GitHub Pages 用这个
    base: '/',//注意发布到阿里云服务器的时候，由于站点根目录是/home/app/xwtest/，所以需要设置base为 /;
  }
}) 
