import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import lazyLoad from './directives/lazyLoad'

// 导入全局样式
import './styles/index.scss'

const app = createApp(App)
app.use(router)
app.directive('lazy', lazyLoad)
app.mount('#app') 