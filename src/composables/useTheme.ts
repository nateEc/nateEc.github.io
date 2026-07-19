import { ref } from 'vue'

export type Theme = 'light' | 'dark'

declare global {
  interface Window {
    portfolioTheme: {
      getTheme: () => Theme
      toggle: () => Theme
    }
  }
}

const currentTheme = ref<Theme>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
let initialized = false

const syncTheme = () => {
  currentTheme.value = window.portfolioTheme.getTheme()
}

export const useTheme = () => {
  const initTheme = () => {
    if (initialized) return
    initialized = true
    syncTheme()
    window.addEventListener('portfolio-theme-change', syncTheme)
  }

  return {
    currentTheme,
    initTheme,
    toggleTheme: window.portfolioTheme.toggle,
  }
}
