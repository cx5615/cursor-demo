import zhTranslations from '../locales/zh.json'
import enTranslations from '../locales/en.json'

export type Language = 'zh' | 'en'

interface Translations {
  [key: string]: string
}

const translations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
}

const LANGUAGE_KEY = 'language'

export const i18n = {
  // 获取当前语言
  getLanguage: (): Language => {
    return (localStorage.getItem(LANGUAGE_KEY) as Language) || 'zh'
  },

  // 设置语言
  setLanguage: (lang: Language): void => {
    localStorage.setItem(LANGUAGE_KEY, lang)
  },

  // 获取翻译
  t: (key: string, lang?: Language): string => {
    const currentLang = lang || i18n.getLanguage()
    return translations[currentLang]?.[key] || key
  },

  // 获取所有翻译
  getTranslations: (lang?: Language): Translations => {
    const currentLang = lang || i18n.getLanguage()
    return translations[currentLang] || translations.zh
  },
}

