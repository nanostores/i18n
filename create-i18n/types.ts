import { localeFrom, browser, createI18n } from '../index.js'

let locale = localeFrom(
  browser({
    available: ['en', 'ru'] as const
  })
)

let i18n1 = createI18n(locale, {
  baseLocale: 'ru',
  async get() {
    return {
      post: {
        title: 'Title'
      }
    }
  }
})

let messages = i18n1('post', {
  title: 'Заголовок'
})
console.log(messages.get().title)
