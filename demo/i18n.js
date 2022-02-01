import { persistentAtom } from '@nanostores/persistent'

import { createI18n, localeFrom, browser, formatter } from '../index.js'

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
              title: 'Демо интернационализации',
              desc: 'Сегодня {date}'
            }
          })
        }, 1000)
      })
    }
  }
})

export let format = formatter(locale)
