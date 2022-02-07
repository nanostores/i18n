import { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import { count } from '.'
// eslint-disable-next-line import/extensions
import { TranslationFunction } from '../create-i18n'

type TestingTranslation = TranslationFunction<[number], string>

const f = count({
  one: 'One page',
  many: '{count} pages'
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<IsExact<typeof f, TestingTranslation>>,
  Assert<IsExact<ReturnType<typeof f>, string>>
]
