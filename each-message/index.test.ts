import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'

import { createI18n, eachMessage } from '../index.js'

test('has global transform', () => {
  let locale = atom('en')

  let i18n = createI18n(locale, {
    get() {
      return Promise.resolve({})
    },
    preprocessors: [eachMessage(str => str.toLocaleUpperCase())]
  })
  let gamesWithCache = i18n('games', { title: 'Games' })
  equal(gamesWithCache.value?.title, 'GAMES')
})
