(() => {
  const storageKey = 'preferred-theme'
  const themes = ['light', 'dark']
  const themeColors = {
    light: '#f7f8fa',
    dark: '#0b1017',
  }
  const root = document.documentElement
  const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')

  const getStoredTheme = () => {
    try {
      const stored = localStorage.getItem(storageKey)
      return themes.includes(stored) ? stored : null
    } catch {
      return null
    }
  }

  const getSystemTheme = () => systemPreference.matches ? 'dark' : 'light'

  const updateThemeButtons = () => {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      const isDark = root.dataset.theme === 'dark'
      const label = isDark ? button.dataset.labelLight : button.dataset.labelDark
      button.setAttribute('aria-pressed', String(isDark))
      if (label) {
        button.setAttribute('aria-label', label)
        button.setAttribute('title', label)
      }
    })
  }

  const applyTheme = (theme, persist = false) => {
    const nextTheme = themes.includes(theme) ? theme : getSystemTheme()
    root.dataset.theme = nextTheme
    root.style.colorScheme = nextTheme

    const themeColor = document.querySelector('meta[name="theme-color"]')
    if (themeColor) themeColor.setAttribute('content', themeColors[nextTheme])

    if (persist) {
      try {
        localStorage.setItem(storageKey, nextTheme)
      } catch {
        // The selected theme still applies for this page when storage is unavailable.
      }
    }

    updateThemeButtons()
    window.dispatchEvent(new CustomEvent('portfolio-theme-change', { detail: { theme: nextTheme } }))
    return nextTheme
  }

  window.portfolioTheme = {
    getTheme: () => root.dataset.theme === 'dark' ? 'dark' : 'light',
    toggle: () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true),
  }

  applyTheme(getStoredTheme() || getSystemTheme())

  systemPreference.addEventListener('change', () => {
    if (!getStoredTheme()) applyTheme(getSystemTheme())
  })

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeButtons()
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', window.portfolioTheme.toggle)
    })
  })
})()
