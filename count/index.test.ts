import { atom } from 'nanostores'

import { createI18n, count } from '../index.js'

let locale = atom('ru')
let i18n = createI18n(locale, {
  async get() {
    return {}
  }
})

it('uses pluralization rules', () => {
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

  expect(messages.get().robots(1)).toBe('1 робот')
  expect(messages.get().robots(21)).toBe('21 робот')
  expect(messages.get().robots(2)).toBe('2 робота')
  expect(messages.get().robots(5)).toBe('5 роботов')

  expect(messages.get().onlyMany(1)).toBe('много')
  expect(messages.get().onlyMany(2)).toBe('много')
})
