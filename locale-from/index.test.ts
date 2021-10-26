import { atom, STORE_UNMOUNT_DELAY } from 'nanostores'
import { delay } from 'nanodelay'

import { localeFrom } from '../index.js'

type Locale = 'en' | 'ru' | 'fr'

it('subscribes to stores before store with locale', async () => {
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

  expect(locale.get()).toBe('en')
  expect(storesListeners()).toEqual([1, 1, 1, 0, 0])

  b.set('fr')
  expect(locale.get()).toBe('fr')
  expect(storesListeners()).toEqual([1, 1, 0, 0, 0])

  b.set(undefined)
  c.set(undefined)
  expect(locale.get()).toBe('ru')
  expect(storesListeners()).toEqual([1, 1, 1, 1, 1])

  unbind()
  await delay(STORE_UNMOUNT_DELAY)
  expect(storesListeners()).toEqual([0, 0, 0, 0, 0])
})
