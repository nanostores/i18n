import type { StoreValue } from 'nanostores'
import { atom } from 'nanostores'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

import { formatter } from '../index.js'

test('has number, date and relative time formatters', () => {
  let locale = atom('en')
  let format = formatter(locale)

  let f: StoreValue<typeof format> | undefined
  format.subscribe(value => {
    f = value
  })
  if (typeof f === 'undefined') throw new Error('t was not set')

  equal(f.number(10000), '10,000')
  equal(f.number(10000, { useGrouping: false }), '10000')
  equal(f.time(new Date(86400000)), '1/2/1970')
  equal(f.time(new Date(86400000), { month: '2-digit' }), '01')
  equal(f.relativeTime(-1, 'day'), '1 day ago')
  equal(f.relativeTime(-1, 'day', { numeric: 'auto' }), 'yesterday')

  if (!process.version.startsWith('v12.')) {
    locale.set('ru')
    equal(f.number(10000), '10 000')
    equal(f.time(new Date(86400000)), '02.01.1970')
    equal(f.relativeTime(-1, 'day'), '1 день назад')
    equal(f.relativeTime(-1, 'day', { numeric: 'auto' }), 'вчера')
  }
})

test.run()
