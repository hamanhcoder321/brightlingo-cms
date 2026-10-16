import { useI18n as useI18nLib } from 'vue-i18n'

export function useI18n() {
  const { t, locale } = useI18nLib()
  
  return {
    t,
    locale
  }
}
