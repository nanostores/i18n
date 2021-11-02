import { equal } from 'uvu/assert'
import { atom } from 'nanostores'
import { test } from 'uvu'

import { createI18n, count } from '../index.js'

let locale = atom('ru')
let i18n = createI18n(locale, {
  async get() {
    return {}
  }
})

test('uses pluralization rules', () => {
  let messages = i18n('templates', {
    robots: count({
      one: '{count} робот',
      few: '{count} робота',
      many: '{count} роботов'
    }),
    onlyMany: count({
      many: 'много'
    })
  })

  equal(messages.get().robots(1), '1 робот')
  equal(messages.get().robots(21), '21 робот')
  equal(messages.get().robots(2), '2 робота')
  equal(messages.get().robots(5), '5 роботов')

  equal(messages.get().onlyMany(1), 'много')
  equal(messages.get().onlyMany(2), 'много')
})

test.run()
