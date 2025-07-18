import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'
import { setTimeout } from 'node:timers/promises'

import { count, createI18n, eachMessage } from '../index.js'

test('has global transform', async () => {
  let locale = atom('en')

  let i18n = createI18n(locale, {
    get() {
      return Promise.resolve({
        games: {
          items: {
            many: '{count} игр',
            one: '{count} игра'
          },
          title: 'Игры'
        }
      })
    },
    preprocessors: [
      eachMessage(str => str.replace(/game/gi, 'GAME').replace(/игр/gi, 'ИГР'))
    ]
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

  locale.set('ru')
  await setTimeout(10)
  equal(messages.get().title, 'ИГРы')
  equal(messages.get().items(1), '1 ИГРа')
})
