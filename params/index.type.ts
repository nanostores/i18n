import { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import { params } from '.'
// eslint-disable-next-line import/extensions
import { count } from '../count'
// eslint-disable-next-line import/extensions
import { TranslationFunction } from '../create-i18n'

const f1 = params<{ category: number }>('Pages in {category}')
const f2 = params<{ category: number }>(
  count({
    one: 'One page in {category}',
    many: '{count} pages in {category}'
  })
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<
    IsExact<typeof f1, TranslationFunction<[{ category: number }], string>>
  >,
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
