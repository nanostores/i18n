import type { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import type { TranslationFunction } from '../create-i18n/index.js'
import { count, params } from '../index.js'

let f1 = count({
  many: '{count} pages',
  one: 'One page'
})
let f2 = count(
  params<{ category: number }>({
    many: '{count} pages in {category}',
    one: 'One page in {category}'
  })
)
let f21 = f2({ category: 12 })
let f22 = f2(12)

console.log(f1, f21, f22)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<IsExact<typeof f1, TranslationFunction<[number], string>>>,
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
