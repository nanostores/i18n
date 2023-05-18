import type { ComponentsJSON } from '../index.js'

import { equal } from 'uvu/assert'
import { atom } from 'nanostores'
import { test } from 'uvu'

import { createI18n, count } from '../index.js'

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
    robots: count({
      one: '{count} robot',
      many: '{count} robots'
    }),
    onlyMany: count({
      many: 'many'
    })
  })

  messages.subscribe(() => {})

  await getResponse({
    templates: {
      robots: {
        one: '{count} робот',
        few: '{count} робота',
        many: '{count} роботов'
      },
      onlyMany: {
        many: 'много'
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

test.run()
