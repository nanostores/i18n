import { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import { count } from '.'
// eslint-disable-next-line import/extensions
import { TranslationFunction } from '../create-i18n'
// eslint-disable-next-line import/extensions
import { params } from '../params'

const f1 = count({
  one: 'One page',
  many: '{count} pages'
})

const f2 = count(
  params<{ category: number }>({
    one: 'One page in {category}',
    many: '{count} pages in {category}'
  })
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<IsExact<typeof f1, TranslationFunction<[number], string>>>,
  Assert<IsExact<ReturnType<typeof f1>, string>>,
  Assert<
    IsExact<
      typeof f2,
      TranslationFunction<
        [
          {
            category: number
          }
        ],
        TranslationFunction<[number], string>
      >
    >
  >,
  Assert<IsExact<ReturnType<typeof f2>, TranslationFunction<[number], string>>>
]
