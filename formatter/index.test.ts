import { atom, StoreValue } from 'nanostores'

import { formatter } from '../index.js'

it('has number and date formatter', () => {
  let locale = atom('en')
  let format = formatter(locale)

  let f: StoreValue<typeof format> | undefined
  format.subscribe(value => {
    f = value
  })
  if (typeof f === 'undefined') throw new Error('t was not set')

  expect(f.number(10000)).toBe('10,000')
  expect(f.time(new Date(86400000))).toBe('1/2/1970')

  locale.set('ru')
  expect(f.number(10000)).toBe('10 000')
  expect(f.time(new Date(86400000))).toBe('02.01.1970')
})
