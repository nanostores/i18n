import { atom, StoreValue, STORE_UNMOUNT_DELAY } from 'nanostores'
import { equal, throws } from 'uvu/assert'
import { delay } from 'nanodelay'
import { test } from 'uvu'

import { ComponentsJSON, createI18n, params, count } from '../index.js'

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

let partialGetCalls: object[] = []
let partialResolveGet: (translations: ComponentsJSON[]) => void = () => {}
let partialRequestsByLocale: Record<string, typeof partialResolveGet> = {}

function partialGet(
  code: string,
  components: string[]
): Promise<ComponentsJSON[]> {
  partialGetCalls.push({ [code]: components })
  return new Promise(resolve => {
    partialRequestsByLocale[code] = resolve
    partialResolveGet = resolve
  })
}

async function partialGetResponse(
  translations: ComponentsJSON[],
  code?: string
): Promise<void> {
  if (code) {
    partialRequestsByLocale[code](translations)
  } else {
    partialResolveGet(translations)
  }
}

test.after.each(() => {
  getCalls = []
  partialGetCalls = []
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
  let locale = atom<'en' | 'ru' | 'fr'>('ru')
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
  let locale = atom<'en' | 'ru' | 'fr'>('en')
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

  let messages = i18n('component', { title: 'Title', other: 'Other' })
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
        one: 'One page in {category}',
        many: '{count} pages in {category}'
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
        one: '{count} страница в {category}',
        few: '{count} страницы в {category}',
        many: '{count} страниц в {category}'
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
        one: 'One page in {category}',
        many: '{count} pages in {category}'
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
  let locale = atom('en')
  let i18n = createI18n(locale, { get })
  i18n('double', {})
  throws(() => {
    i18n('double', {})
  }, /I18n component double was defined multiple times/)
})

test('loads locale partial', async () => {
  let locale = atom<'en' | 'ru' | 'fr' | 'de'>('ru')
  let i18n = createI18n(locale, { get: partialGet })

  equal(i18n.loading.get(), false)
  equal(partialGetCalls, [])

  let post = i18n('main/post', { title: 'Post' })
  let heading = i18n('main/heading', { title: 'Title' })
  let comment = i18n('main/comment', { title: 'Comment' })
  let message = i18n('chat/message', { title: 'Message' })
  let events: string[] = []
  post.subscribe(t => {
    events.push(t.title)
  })
  heading.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  equal(partialGetCalls, [{ ru: ['main/post', 'main/heading'] }])
  equal(events, ['Post', 'Title'])

  await partialGetResponse([
    {
      'main/post': { title: 'Публикация' },
      'main/heading': { title: 'Заголовок' },
      'main/comment': { title: 'Комментарий' }
    }
  ])
  equal(events, ['Post', 'Title', 'Публикация', 'Заголовок'])
  equal(post.get(), { title: 'Публикация' })
  equal(heading.get(), { title: 'Заголовок' })
  equal(comment.get(), { title: 'Comment' })

  equal(i18n.loading.get(), false)
  comment.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), false)
  equal(comment.get(), { title: 'Комментарий' })
  equal(events, ['Post', 'Title', 'Публикация', 'Заголовок', 'Комментарий'])
  events = []

  locale.set('en')
  equal(i18n.loading.get(), false)
  equal(events, ['Post', 'Title', 'Comment'])
  events = []

  locale.set('ru')
  equal(i18n.loading.get(), false)
  equal(partialGetCalls, [{ ru: ['main/post', 'main/heading'] }])
  equal(events, ['Публикация', 'Заголовок', 'Комментарий'])
  events = []

  post.off()

  locale.set('fr')
  equal(i18n.loading.get(), true)
  equal(partialGetCalls, [
    { ru: ['main/post', 'main/heading'] },
    { fr: ['main/heading', 'main/comment'] }
  ])
  equal(events, [])

  await partialGetResponse([
    {
      'main/body': { title: 'La publication' },
      'main/heading': { title: 'Titre' },
      'main/comment': { title: 'Commentaire' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, ['Titre', 'Commentaire'])

  equal(heading.get(), { title: 'Titre' })
  equal(comment.get(), { title: 'Commentaire' })
  equal(post.get(), { title: 'Публикация' })

  post.subscribe(t => {
    events.push(t.title)
  })
  equal(post.get(), { title: 'La publication' })
  equal(events, ['Titre', 'Commentaire', 'La publication'])
  events = []

  post.off()
  heading.off()
  comment.off()

  message.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  equal(partialGetCalls, [
    { ru: ['main/post', 'main/heading'] },
    { fr: ['main/heading', 'main/comment'] },
    { fr: ['chat/message'] }
  ])
  equal(events, [])

  await partialGetResponse([
    {
      'chat/message': { title: 'Le message' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, ['Le message'])

  post.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), false)
  equal(events, ['Le message', 'La publication'])

  locale.set('de')
  equal(i18n.loading.get(), true)
  equal(partialGetCalls, [
    { ru: ['main/post', 'main/heading'] },
    { fr: ['main/heading', 'main/comment'] },
    { fr: ['chat/message'] },
    { de: ['chat/message', 'main/post'] }
  ])
  equal(events, ['Le message', 'La publication'])

  await partialGetResponse([
    {
      'main/body': { title: 'Publikation' },
      'main/heading': { title: 'Titel' },
      'main/comment': { title: 'Kommentar' }
    },
    {
      'chat/message': { title: 'Nachricht' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, ['Le message', 'La publication', 'Nachricht', 'Publikation'])

  events = []
})

test.run()
