import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式
import './styles/index.scss'

const updateViewportHeightVars = () => {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-vh', `${viewportHeight * 0.01}px`);
  document.documentElement.style.setProperty('--app-vh-px', `${viewportHeight}px`);
};

if (typeof window !== 'undefined') {
  updateViewportHeightVars();
  window.addEventListener('resize', updateViewportHeightVars, { passive: true });
  window.addEventListener('orientationchange', () => window.setTimeout(updateViewportHeightVars, 80), { passive: true });
  window.visualViewport?.addEventListener('resize', updateViewportHeightVars, { passive: true });
}

const app = createApp(App)
app.use(router)
app.mount('#app')
