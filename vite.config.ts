import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const plugins: PluginOption[] = [vue()]

if (process.env.VITE_VUE_DEVTOOLS === 'true') {
  plugins.push(vueDevTools())
}

// https://vite.dev/config/
export default defineConfig({
  plugins,
  base:'/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
