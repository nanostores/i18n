import { atom } from 'nanostores'
import { equal } from 'node:assert'
import { test } from 'node:test'

import { count, createI18n } from '../index.js'
import type { ComponentsJSON } from '../index.js'

let resolveGet: (translations: ComponentsJSON) => void = () => {}

function get(): Promise<ComponentsJSON> {
  return new Promise(resolve => {
    resolveGet = resolve
  })
}

function getResponse(translations: ComponentsJSON): Promise<void> {
  resolveGet(translations)
  return Promise.resolve()
}

let locale = atom<'ru' | 'pl'>('ru')
let i18n = createI18n(locale, { get })

test('uses pluralization rules', async () => {
  let messages = i18n('templates', {
    onlyMany: count({
      many: 'many'
    }),
    onlyOther: count({
      other: 'other'
    }),
    robots: count({
      other: '{count} robots',
      one: '{count} robot'
    })
  })

  messages.subscribe(() => {})

  await getResponse({
    templates: {
      onlyMany: {
        many: 'много'
      },
      robots: {
        few: '{count} робота',
        many: '{count} роботов',
        one: '{count} робот'
      }
    }
  })

  equal(messages.get().robots(1), '1 робот')
  equal(messages.get().robots(21), '21 робот')
  equal(messages.get().robots(2), '2 робота')
  equal(messages.get().robots(5), '5 роботов')

  equal(messages.get().onlyMany(1), 'много')
  equal(messages.get().onlyMany(2), 'много')

  locale.set('pl')

  await getResponse({
    templates: {
      onlyMany: {
        many: 'wiele'
      },
      onlyOther: {
        other: 'inne'
      },
      robots: {
        one: '{count} robot',
        few: '{count} roboty',
        many: '{count} robotów',
        other: '{count} robota'
      }
    }
  })

  equal(messages.get().robots(0), '0 robotów')
  equal(messages.get().robots(1), '1 robot')
  equal(messages.get().robots(2), '2 roboty')
  equal(messages.get().robots(5), '5 robotów')
  equal(messages.get().robots(2.5), '2.5 robota')

  equal(messages.get().onlyMany(1), 'wiele')
  equal(messages.get().onlyMany(2), 'wiele')

  equal(messages.get().onlyOther(1), 'inne')
  equal(messages.get().onlyOther(2), 'inne')
})
