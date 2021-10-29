import { localeFrom, browser, createI18n, params } from '../index.js'

let locale = localeFrom(
  browser({
    available: ['en', 'ru'] as const
  })
)

function testString(arg: string): void {
  console.log(arg)
}

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
// THROWS Did you mean 'title'?
console.log(messages.get().title2)

let messages2 = i18n('post', {
  title: params<{ name: string }>('Title: {name}')
})
// THROWS to parameter of type '{ name: string; }
testString(messages2.get().title({ named: 'Post' }))
// THROWS is not assignable to parameter of type 'string'
testString(messages2.get().title)
