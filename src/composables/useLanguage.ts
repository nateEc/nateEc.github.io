import { ref } from 'vue'

export type Language = 'en' | 'zh'

const currentLanguage = ref<Language>('en')

export function useLanguage() {
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('preferred-language', lang)
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
  }

  return {
    currentLanguage,
    setLanguage,
    toggleLanguage,
    initLanguage
  }
}
