import { atom, STORE_UNMOUNT_DELAY } from 'nanostores'
import { equal } from 'uvu/assert'
import { delay } from 'nanodelay'
import { test } from 'uvu'

import { ComponentsJSON, createI18n } from '../index.js'

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

test.after.each(() => {
  getCalls = []
})

let locale = atom<'en' | 'ru' | 'fr' | 'de'>('ru')
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
  equal(getCalls, [])

  postUnbind = post.subscribe(t => {
    events.push(t.title)
  })
  headingUnbind = heading.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  equal(getCalls, [{ ru: ['main/post'] }])
  equal(events, ['Post', 'Title'])
})

test('loads translations partial', async () => {
  await getResponse([
    {
      'main/post': { title: 'Публикация' },
      'main/heading': { title: 'Заголовок' },
      'main/comment': { title: 'Комментарий' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, ['Post', 'Title', 'Публикация', 'Заголовок'])
  equal(post.get(), { title: 'Публикация' })
  equal(heading.get(), { title: 'Заголовок' })
  equal(comment.get(), { title: 'Комментарий' })
  events = []
})

test('after mount should load translations with different prefix', async () => {
  equal(i18n.loading.get(), false)
  equal(getCalls, [])

  let userUnbind = user.subscribe(t => {
    events.push(t.title)
  })
  let gamesUnbind = games.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  equal(getCalls, [{ ru: ['settings/user'] }, { ru: ['games'] }])
  equal(events, ['User', 'Games'])

  await getResponse([
    {
      'settings/user': { title: 'Пользователь' }
    },
    {
      games: { title: 'Игры' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, [
    'User',
    'Games',
    'Публикация',
    'Заголовок',
    'Пользователь',
    'Игры'
  ])
  userUnbind()
  gamesUnbind()
  events = []
})

test("component mounting shouldn't load cached translations", async () => {
  commentUnbind = comment.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), false)
  equal(getCalls, [])
  equal(events, ['Комментарий'])
  events = []
})

test('loads translation after component mounted', async () => {
  message.subscribe(t => {
    events.push(t.title)
  })
  equal(i18n.loading.get(), true)
  equal(getCalls, [{ ru: ['chat/message'] }])
  equal(events, ['Message'])

  await getResponse([
    {
      'chat/message': { title: 'Сообщение' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, [
    'Message',
    'Публикация',
    'Заголовок',
    'Комментарий',
    'Сообщение'
  ])
  equal(message.get(), { title: 'Сообщение' })
  events = []
})

test("locale changing shouldn't load cached translations", async () => {
  locale.set('en')
  equal(i18n.loading.get(), false)
  equal(getCalls, [])
  equal(events, ['Post', 'Title', 'Comment', 'Message'])
  events = []
})

test('locale changing should load translations for mounted only', async () => {
  postUnbind()
  headingUnbind()
  commentUnbind()

  await delay(STORE_UNMOUNT_DELAY)

  locale.set('fr')
  equal(i18n.loading.get(), true)
  equal(getCalls, [{ fr: ['chat/message'] }])
  equal(events, [])

  await getResponse([
    {
      'chat/message': { title: 'Le message' }
    }
  ])
  equal(i18n.loading.get(), false)
  equal(events, ['Le message'])
  equal(post.get(), { title: 'Post' })
  equal(heading.get(), { title: 'Title' })
  equal(comment.get(), { title: 'Comment' })
  equal(message.get(), { title: 'Le message' })
  events = []
})

test('if get returns array, it transforms to object', async () => {
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
  equal(getCalls, [
    { de: ['chat/message', 'main/post', 'main/heading', 'main/comment'] }
  ])
  equal(events, ['Message', 'Post', 'Title', 'Comment'])

  await getResponse([
    {
      'main/post': { title: 'Publikation' },
      'main/heading': { title: 'Titel' },
      'main/comment': { title: 'Kommentar' }
    },
    {
      'chat/message': { title: 'Nachricht' }
    }
  ])
  equal(i18n.cache.de, {
    'main/post': { title: 'Publikation' },
    'main/heading': { title: 'Titel' },
    'main/comment': { title: 'Kommentar' },
    'chat/message': { title: 'Nachricht' }
  })
  equal(i18n.loading.get(), false)
  equal(events, [
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

test.run()
