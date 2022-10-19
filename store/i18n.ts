import { atom } from 'nanostores'
import { persistentAtom } from '@nanostores/persistent'
import { localeFrom, browser, createI18n } from '@nanostores/i18n'

export const localeSettings = persistentAtom<string>('locale')

export const locale = localeFrom(
  localeSettings,
  browser({ available: ['en', 'de'] })
)

export const i18n = createI18n(locale, {
  async get (code) {
    return await fetch(`/locales/${code}.json`).then((r) => r.json())
  }
})

export type currentLocale = string;
export const currentLanguage = atom<currentLocale>('')
