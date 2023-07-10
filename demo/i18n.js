import { persistentAtom } from '@nanostores/persistent'

import { browser, createI18n, formatter, localeFrom } from '../index.js'

export let localeSetting = persistentAtom('locale')

export let locale = localeFrom(
  localeSetting,
  browser({ available: ['en', 'ru'] })
)

export let i18n = createI18n(locale, {
  async get(code) {
    if (code === 'ru') {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            page: {
              desc: 'Сегодня {date}',
              title: 'Демо интернационализации'
            }
          })
        }, 1000)
      })
    }
  }
})

export let format = formatter(locale)
