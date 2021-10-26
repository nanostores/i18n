import { atom, STORE_UNMOUNT_DELAY } from 'nanostores'
import { delay } from 'nanodelay'

import { createI18n, Translations } from '../index.js'

let getCalls: string[] = []
let resolveGet: (translations: Translations) => void = () => {}
let requestsByLocale: Record<string, typeof resolveGet> = {}

function get(code: string): Promise<Translations> {
  getCalls.push(code)
  return new Promise(resolve => {
    requestsByLocale[code] = resolve
    resolveGet = resolve
  })
}

async function getResponse(
  translations: Translations,
  code?: string
): Promise<void> {
  if (code) {
    requestsByLocale[code](translations)
  } else {
    resolveGet(translations)
  }
}

afterEach(() => {
  getCalls = []
})

it('is loaded from the start', () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get })

  expect(i18n.loading.get()).toBe(false)
  expect(getCalls).toHaveLength(0)

  let messages = i18n('component', { title: 'Title' })
  expect(messages.get()).toEqual({ title: 'Title' })
})

it('loads locale', async () => {
  let locale = atom<'en' | 'ru' | 'fr'>('ru')
  let i18n = createI18n(locale, { get })

  expect(i18n.loading.get()).toBe(true)
  expect(getCalls).toEqual(['ru'])

  let messages = i18n('component', { title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.title)
  })
  expect(events).toEqual(['Title'])

  await getResponse({
    component: { title: 'Заголовок' }
  })
  expect(events).toEqual(['Title', 'Заголовок'])
  expect(messages.get()).toEqual({ title: 'Заголовок' })

  locale.set('en')
  expect(i18n.loading.get()).toBe(false)
  expect(events).toEqual(['Title', 'Заголовок', 'Title'])

  locale.set('ru')
  expect(i18n.loading.get()).toBe(false)
  expect(getCalls).toEqual(['ru'])
  expect(events).toEqual(['Title', 'Заголовок', 'Title', 'Заголовок'])

  locale.set('fr')
  expect(i18n.loading.get()).toBe(true)
  expect(getCalls).toEqual(['ru', 'fr'])
  expect(events).toEqual(['Title', 'Заголовок', 'Title', 'Заголовок'])

  await getResponse({
    component: { title: 'Titre' }
  })
  expect(i18n.loading.get()).toBe(false)
  expect(events).toEqual(['Title', 'Заголовок', 'Title', 'Заголовок', 'Titre'])
})

it('is ready for locale change in the middle of request', async () => {
  let locale = atom<'en' | 'ru' | 'fr'>('en')
  let i18n = createI18n(locale, { get })
  let messages = i18n('component', { title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.title)
  })

  locale.set('ru')
  locale.set('fr')
  await getResponse({
    component: { title: 'Titre' }
  })
  expect(i18n.loading.get()).toBe(false)
  expect(events).toEqual(['Title', 'Titre'])
})

it('is ready for wrong response order', async () => {
  let locale = atom<'en' | 'ru' | 'fr'>('en')
  let i18n = createI18n(locale, { get })
  let messages = i18n('component', { title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.title)
  })

  locale.set('ru')
  locale.set('fr')

  await getResponse({ component: { title: 'Заголовок' } }, 'ru')
  expect(i18n.cache.ru).toEqual({ component: { title: 'Заголовок' } })
  expect(i18n.loading.get()).toBe(true)
  expect(events).toEqual(['Title'])

  await getResponse({ component: { title: 'Titre' } }, 'fr')
  expect(i18n.loading.get()).toBe(false)
  expect(events).toEqual(['Title', 'Titre'])
})

it('changes base locale', () => {
  let locale = atom('ru')
  let i18n = createI18n(locale, { baseLocale: 'ru', get })

  expect(i18n.loading.get()).toBe(false)
  expect(getCalls).toHaveLength(0)

  let messages = i18n('component', { title: 'Заголовок' })
  expect(messages.get()).toEqual({ title: 'Заголовок' })
})

it('removes listeners', async () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get })
  let prevLocale = locale.lc
  let prevLoading = i18n.loading.lc

  let messages = i18n('component', { title: 'Заголовок' })
  let unbind = messages.listen(() => {})
  unbind()

  await delay(STORE_UNMOUNT_DELAY)
  expect(locale.lc).toBe(prevLocale)
  expect(i18n.loading.lc).toBe(prevLoading)
})
