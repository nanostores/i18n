import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'

import { createI18n, eachMessage, count } from '../index.js'

test('has global transform', () => {
  let locale = atom('en')

  let i18n = createI18n(locale, {
    get() {
      return Promise.resolve({})
    },
    preprocessors: [eachMessage(str => str.replace(/game/gi, 'GAME'))]
  })
  let messages = i18n('games', {
    items: count({
      many: '{count} games',
      one: '{count} game'
    }),
    title: 'Games'
  })

  messages.subscribe(() => {})

  equal(messages.get().title, 'GAMEs')
  equal(messages.get().items(1), '1 GAME')
})
