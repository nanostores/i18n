import type { AssertTrue as Assert, IsExact } from 'conditional-type-checks'
import type { TranslationFunction } from '../create-i18n'

import { params } from '.'
// eslint-disable-next-line import/extensions
import { count } from '../count'
// eslint-disable-next-line import/extensions

const f1 = params<{ category: number }>('Pages in {category}')
const f2 = params<{ category: number }>(
  count({
    one: 'One page in {category}',
    many: '{count} pages in {category}'
  })
)
const f21 = f2({ category: 12 })
const f22 = f2(12)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<
    IsExact<typeof f1, TranslationFunction<[{ category: number }], string>>
  >,
  Assert<IsExact<ReturnType<typeof f1>, string>>,
  Assert<
    IsExact<
      typeof f2,
      {
        (input: { category: number }): TranslationFunction<[number], string>
        (input: number): TranslationFunction<[{ category: number }], string>
      }
    >
  >,
  Assert<IsExact<typeof f21, TranslationFunction<[number], string>>>,
  Assert<
    IsExact<typeof f22, TranslationFunction<[{ category: number }], string>>
  >,
  // saving backward compatibility
  // 1. Parameters
  Assert<IsExact<Parameters<typeof f2>, [input: { category: number }]>>,
  // 2. ReturnType
  Assert<IsExact<ReturnType<typeof f2>, TranslationFunction<[number], string>>>
]
