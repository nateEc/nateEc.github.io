import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

const redirectedPath = sessionStorage.getItem('spa-redirect')
if (redirectedPath) {
  sessionStorage.removeItem('spa-redirect')
  window.history.replaceState(null, '', redirectedPath)
}

const { default: router } = await import('./router')

const app = createApp(App)
app.use(router)
app.mount('#app')
