import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const redirectedPath = sessionStorage.getItem('spa-redirect')
if (redirectedPath) {
  sessionStorage.removeItem('spa-redirect')
  window.history.replaceState(null, '', redirectedPath)
}

const app = createApp(App)
app.use(router)
app.mount('#app')
