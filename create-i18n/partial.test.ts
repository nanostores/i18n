import { delay } from 'nanodelay'
import { atom, STORE_UNMOUNT_DELAY } from 'nanostores'
import { afterEach, test } from 'node:test'
import { deepStrictEqual, equal } from 'node:assert'

import { createI18n } from '../index.js'
import type { ComponentsJSON } from '../index.js'

let getCalls: object[] = []
let resolveGet: (translations: ComponentsJSON[]) => void = () => {}
let requestsByLocale: Record<string, typeof resolveGet> = {}

function get(code: string, components: string[]): Promise<ComponentsJSON[]> {
  getCalls.push({ [code]: components })
  return new Promise(resolve => {
    requestsByLocale[code] = resolve
    resolveGet = resolve
  })
}

async function getResponse(
  translations: ComponentsJSON[],
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

let locale = atom<'de' | 'en' | 'fr' | 'ru'>('ru')
let i18n = createI18n(locale, { get })
let events: string[] = []

let post = i18n('main/post', { title: 'Post' })
let heading = i18n('main/heading', { title: 'Title' })
let comment = i18n('main/comment', { title: 'Comment' })
let message = i18n('chat/message', { title: 'Message' })
let user = i18n('settings/user', { title: 'User' })
let games = i18n('games', { title: 'Games' })

let postUnbind: () => void
let headingUnbind: () => void
let commentUnbind: () => void

test("after mount shouldn't load translations with same prefix", async () => {
  equal(i18n.loading.get(), false)
  deepStrictEqual(getCalls, [])

  postUnbind = post.subscribe(t => {
    events.push(t.title)
  })
  headingUnbind = heading.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  deepStrictEqual(getCalls, [{ ru: ['main/post'] }])
  deepStrictEqual(events, ['Post', 'Title'])
})

test('loads translations partial', async () => {
  await getResponse([
    {
      'main/comment': { title: 'Комментарий' },
      'main/heading': { title: 'Заголовок' },
      'main/post': { title: 'Публикация' }
    }
  ])
  equal(i18n.loading.get(), false)
  deepStrictEqual(events, ['Post', 'Title', 'Публикация', 'Заголовок'])
  deepStrictEqual(post.get(), { title: 'Публикация' })
  deepStrictEqual(heading.get(), { title: 'Заголовок' })
  deepStrictEqual(comment.get(), { title: 'Комментарий' })

  equal(i18n.loading.get(), false)
  deepStrictEqual(getCalls, [])
})

test('after mount should load translations with different prefix', async () => {
  events = []
  let userUnbind = user.subscribe(t => {
    events.push(t.title)
  })
  let gamesUnbind = games.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  deepStrictEqual(getCalls, [{ ru: ['settings/user'] }, { ru: ['games'] }])
  deepStrictEqual(events, ['User', 'Games'])

  await getResponse([
    {
      'settings/user': { title: 'Пользователь' }
    },
    {
      games: { title: 'Игры' }
    }
  ])
  equal(i18n.loading.get(), false)
  deepStrictEqual(events, [
    'User',
    'Games',
    'Публикация',
    'Заголовок',
    'Пользователь',
    'Игры'
  ])
  userUnbind()
  gamesUnbind()
})

test("component mounting shouldn't load cached translations", async () => {
  events = []
  commentUnbind = comment.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), false)
  deepStrictEqual(getCalls, [])
  deepStrictEqual(events, ['Комментарий'])
})

test('loads translation after component mounted', async () => {
  events = []
  message.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  deepStrictEqual(getCalls, [{ ru: ['chat/message'] }])
  deepStrictEqual(events, ['Message'])

  await getResponse([
    {
      'chat/message': { title: 'Сообщение' }
    }
  ])
  equal(i18n.loading.get(), false)
  deepStrictEqual(events, [
    'Message',
    'Публикация',
    'Заголовок',
    'Комментарий',
    'Сообщение'
  ])
  deepStrictEqual(message.get(), { title: 'Сообщение' })
})

test("locale changing shouldn't load cached translations", async () => {
  events = []
  locale.set('en')
  equal(i18n.loading.get(), false)
  deepStrictEqual(getCalls, [])
  deepStrictEqual(events, ['Post', 'Title', 'Comment', 'Message'])
})

test('locale changing should load translations for mounted only', async () => {
  events = []
  postUnbind()
  headingUnbind()
  commentUnbind()

  await delay(STORE_UNMOUNT_DELAY)

  locale.set('fr')
  equal(i18n.loading.get(), true)
  deepStrictEqual(getCalls, [{ fr: ['chat/message'] }])
  deepStrictEqual(events, [])

  await getResponse([
    {
      'chat/message': { title: 'Le message' }
    }
  ])
  equal(i18n.loading.get(), false)
  deepStrictEqual(events, ['Le message'])
  deepStrictEqual(post.get(), { title: 'Post' })
  deepStrictEqual(heading.get(), { title: 'Title' })
  deepStrictEqual(comment.get(), { title: 'Comment' })
  deepStrictEqual(message.get(), { title: 'Le message' })
})

test('if get returns array, it transforms to object', async () => {
  events = []
  locale.set('en')

  post.subscribe(t => {
    events.push(t.title)
  })
  heading.subscribe(t => {
    events.push(t.title)
  })
  comment.subscribe(t => {
    events.push(t.title)
  })

  locale.set('de')
  equal(i18n.loading.get(), true)
  deepStrictEqual(getCalls, [
    { de: ['chat/message', 'main/post', 'main/heading', 'main/comment'] }
  ])
  deepStrictEqual(events, ['Message', 'Post', 'Title', 'Comment'])

  await getResponse([
    {
      'main/comment': { title: 'Kommentar' },
      'main/heading': { title: 'Titel' },
      'main/post': { title: 'Publikation' }
    },
    {
      'chat/message': { title: 'Nachricht' }
    }
  ])
  deepStrictEqual(i18n.cache.de, {
    'chat/message': { title: 'Nachricht' },
    'main/comment': { title: 'Kommentar' },
    'main/heading': { title: 'Titel' },
    'main/post': { title: 'Publikation' }
  })
  equal(i18n.loading.get(), false)
  deepStrictEqual(events, [
    'Message',
    'Post',
    'Title',
    'Comment',
    'Nachricht',
    'Publikation',
    'Titel',
    'Kommentar'
  ])
})
