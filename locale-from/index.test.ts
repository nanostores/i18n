import { delay } from 'nanodelay'
import { atom, STORE_UNMOUNT_DELAY } from 'nanostores'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

import { localeFrom } from '../index.js'

type Locale = 'en' | 'fr' | 'ru'

test('subscribes to stores before store with locale', async () => {
  let a = atom<Locale | undefined>()
  let b = atom<Locale | undefined>()
  let c = atom<Locale | undefined>('en')
  let d = atom<Locale | undefined>()
  let e = atom<Locale>('ru')

  function storesListeners(): number[] {
    return [a.lc, b.lc, c.lc, d.lc, e.lc]
  }

  let locale = localeFrom(a, b, c, d, e)
  let unbind = locale.listen(() => {})

  equal(locale.get(), 'en')
  equal(storesListeners(), [1, 1, 1, 0, 0])

  b.set('fr')
  equal(locale.get(), 'fr')
  equal(storesListeners(), [1, 1, 0, 0, 0])

  b.set(undefined)
  c.set(undefined)
  equal(locale.get(), 'ru')
  equal(storesListeners(), [1, 1, 1, 1, 1])

  unbind()
  await delay(STORE_UNMOUNT_DELAY)
  equal(storesListeners(), [0, 0, 0, 0, 0])
})

test.run()
