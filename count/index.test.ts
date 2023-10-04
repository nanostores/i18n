import { atom } from 'nanostores'
import { test } from 'node:test'
import { equal } from 'node:assert'

import { count, createI18n } from '../index.js'
import type { ComponentsJSON } from '../index.js'

let resolveGet: (translations: ComponentsJSON) => void = () => {}

function get(): Promise<ComponentsJSON> {
  return new Promise(resolve => {
    resolveGet = resolve
  })
}

async function getResponse(translations: ComponentsJSON): Promise<void> {
  resolveGet(translations)
}

let locale = atom('ru')
let i18n = createI18n(locale, { get })

test('uses pluralization rules', async () => {
  let messages = i18n('templates', {
    onlyMany: count({
      many: 'many'
    }),
    robots: count({
      many: '{count} robots',
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
})
