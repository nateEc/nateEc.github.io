import { ref } from 'vue'

export type Language = 'en' | 'zh'

const currentLanguage = ref<Language>('en')

export function useLanguage() {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('preferred-language', lang)
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
  }

  const toggleLanguage = () => {
    const newLang: Language = currentLanguage.value === 'en' ? 'zh' : 'en'
    setLanguage(newLang)
  }

  const initLanguage = () => {
    const saved = localStorage.getItem('preferred-language') as Language
    if (saved && (saved === 'en' || saved === 'zh')) {
      currentLanguage.value = saved
    }
    document.documentElement.lang = currentLanguage.value === 'zh' ? 'zh-CN' : 'en'
  }

  return {
    currentLanguage,
    setLanguage,
    toggleLanguage,
    initLanguage
  }
}
