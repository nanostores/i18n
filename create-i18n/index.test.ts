import { delay } from 'nanodelay'
import { restoreAll, spyOn } from 'nanospy'
import { atom, STORE_UNMOUNT_DELAY } from 'nanostores'
import type { StoreValue } from 'nanostores'
import { test } from 'uvu'
import { equal, match } from 'uvu/assert'

import { count, createI18n, params } from '../index.js'
import type { ComponentsJSON } from '../index.js'

let getCalls: string[] = []
let resolveGet: (translations: ComponentsJSON) => void = () => {}
let requestsByLocale: Record<string, typeof resolveGet> = {}

function get(code: string): Promise<ComponentsJSON> {
  getCalls.push(code)
  return new Promise(resolve => {
    requestsByLocale[code] = resolve
    resolveGet = resolve
  })
}

async function getResponse(
  translations: ComponentsJSON,
  code?: string
): Promise<void> {
  if (code) {
    requestsByLocale[code](translations)
  } else {
    resolveGet(translations)
  }
}

test.after.each(() => {
  getCalls = []
  restoreAll()
})

test('is loaded from the start', () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get })

  equal(i18n.loading.get(), false)
  equal(getCalls, [])

  let messages = i18n('component', { title: 'Title' })
  equal(messages.get(), { title: 'Title' })
})

test('loads locale', async () => {
  let locale = atom<'en' | 'fr' | 'ru'>('ru')
  let i18n = createI18n(locale, { get })

  equal(i18n.loading.get(), false)
  equal(getCalls, [])

  let messages = i18n('component', { title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  equal(getCalls, ['ru'])
  equal(events, ['Title'])

  await getResponse({
    component: { title: 'Заголовок' }
  })
  equal(events, ['Title', 'Заголовок'])
  equal(messages.get(), { title: 'Заголовок' })

  locale.set('en')
  equal(i18n.loading.get(), false)
  equal(events, ['Title', 'Заголовок', 'Title'])

  locale.set('ru')
  equal(i18n.loading.get(), false)
  equal(getCalls, ['ru'])
  equal(events, ['Title', 'Заголовок', 'Title', 'Заголовок'])

  locale.set('fr')
  equal(i18n.loading.get(), true)
  equal(getCalls, ['ru', 'fr'])
  equal(events, ['Title', 'Заголовок', 'Title', 'Заголовок'])

  await getResponse({
    component: { title: 'Titre' }
  })
  equal(i18n.loading.get(), false)
  equal(events, ['Title', 'Заголовок', 'Title', 'Заголовок', 'Titre'])
})

test('is ready for locale change in the middle of request', async () => {
  let locale = atom<'en' | 'fr' | 'ru'>('en')
  let i18n = createI18n(locale, { get })
  let messages = i18n('component', { title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.title)
  })

  locale.set('ru')
  locale.set('fr')
  await getResponse({ component: { title: 'Titre' } })
  equal(i18n.loading.get(), false)
  equal(events, ['Title', 'Titre'])
})

test('is ready for wrong response order', async () => {
  let locale = atom<'en' | 'fr' | 'ru'>('en')
  let i18n = createI18n(locale, { get })
  let messages = i18n('component', { title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.title)
  })

  locale.set('ru')
  locale.set('fr')

  await getResponse({ component: { title: 'Заголовок' } }, 'ru')
  equal(i18n.cache.ru, { component: { title: 'Заголовок' } })
  equal(i18n.loading.get(), true)
  equal(events, ['Title'])

  await getResponse({ component: { title: 'Titre' } }, 'fr')
  equal(i18n.loading.get(), false)
  equal(events, ['Title', 'Titre'])
})

test('changes base locale', () => {
  let locale = atom('ru')
  let i18n = createI18n(locale, { baseLocale: 'ru', get })

  equal(i18n.loading.get(), false)
  equal(getCalls, [])

  let messages = i18n('component', { title: 'Заголовок' })
  equal(messages.get(), { title: 'Заголовок' })
})

test('removes listeners', async () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get })
  let prevLocale = locale.lc
  let prevLoading = i18n.loading.lc

  let messages = i18n('component', { title: 'Заголовок' })
  let unbind = messages.listen(() => {})
  unbind()

  await delay(STORE_UNMOUNT_DELAY)
  equal(locale.lc, prevLocale)
  equal(i18n.loading.lc, prevLoading)
})

test('mixes translations with base', async () => {
  let locale = atom('ru')
  let i18n = createI18n(locale, { get })
  equal(i18n.loading.get(), false)

  let messages = i18n('component', { other: 'Other', title: 'Title' })
  let events: string[] = []
  messages.subscribe(t => {
    events.push(t.other)
  })
  equal(i18n.loading.get(), true)

  await getResponse({
    component: { title: 'Заголовок' },
    post: { name: 'Публикация' }
  })
  equal(i18n.loading.get(), false)
  equal(events, ['Other', 'Other'])

  let messages2 = i18n('post', { name: 'Post', page: 'Page' })
  equal(messages2.get(), { name: 'Публикация', page: 'Page' })
})

test('applies transforms', async () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get })
  let messages = i18n('component', {
    pages: params<{ category: number }>(
      count({
        many: '{count} pages in {category}',
        one: 'One page in {category}'
      })
    )
  })

  let t: StoreValue<typeof messages> | undefined
  messages.subscribe(value => {
    t = value
  })
  if (typeof t === 'undefined') throw new Error('t was not set')

  equal(t.pages({ category: 10 })(2), '2 pages in 10')

  locale.set('ru')
  await getResponse({
    component: {
      pages: {
        few: '{count} страницы в {category}',
        many: '{count} страниц в {category}',
        one: '{count} страница в {category}'
      }
    }
  })
  equal(t.pages({ category: 10 })(2), '2 страницы в 10')
})

test('supports reverse transform', () => {
  let locale = atom('en')
  let i18n = createI18n(locale, { get })
  let messages = i18n('component', {
    reverse: count(
      params<{ category: number }>({
        many: '{count} pages in {category}',
        one: 'One page in {category}'
      })
    )
  })

  let t: StoreValue<typeof messages> | undefined
  messages.subscribe(value => {
    t = value
  })
  if (typeof t === 'undefined') throw new Error('t was not set')

  equal(t.reverse(1)({ category: 10 }), 'One page in 10')
})

test('tracks double definition', () => {
  let warn = spyOn(console, 'warn', () => {})
  let locale = atom('en')
  let i18n = createI18n(locale, { get })

  i18n('double', {})
  equal(warn.callCount, 0)

  i18n('double', {})
  equal(warn.callCount, 1)
  match(warn.calls[0][0], /defined multiple times/)
})

test('cache is used on first use', async () => {
  let locale = atom('ru')
  let i18n = createI18n(locale, {
    cache: {
      ru: { games: { title: 'Игры' } }
    },
    get
  })
  let gamesWithCache = i18n('games', { title: 'Games' })
  equal(gamesWithCache.value?.title, 'Игры')
})

test.run()
