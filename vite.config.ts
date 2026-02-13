import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const normalizeBase = (value?: string): string => {
  const raw = String(value ?? '').trim()
  if (!raw) return '/'
  const withLeadingSlash = raw.startsWith('/') ? raw : `/${raw}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

// 使用函数式配置
export default defineConfig(() => {
  const base = normalizeBase(process.env.VITE_BASE_PATH)

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
          api: 'modern-compiler'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      https: false,
      proxy: {
        '/api': 'http://localhost:5175',
      },
    },
    // 默认 '/'；GitHub Pages 等子路径部署时通过 `VITE_BASE_PATH=/repo-name/` 覆盖。
    base,
  }
}) 
