import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
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
        charset: false
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    https: false,
  }
}) 
