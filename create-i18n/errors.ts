import { localeFrom, browser, createI18n } from '../index.js'

let locale = localeFrom(
  browser({
    available: ['en', 'ru'] as const
  })
)

createI18n(locale, {
  // THROWS '"fr"' is not assignable to type '"ru" | "en" | undefined'
  baseLocale: 'fr',
  async get() {
    return {}
  }
})

createI18n(locale, {
  baseLocale: 'en',
  // THROWS { title: string; }>' is not assignable to type 'TranslationLoader
  async get() {
    return {
      title: 'Title'
    }
  }
})

let i18n = createI18n(locale, {
  async get() {
    return {}
  }
})

let messages = i18n('post', {
  title: 'Заголовок'
})
// THROWS 'title2' does not exist on type '{ title: string; }'
console.log(messages.get().title2)
