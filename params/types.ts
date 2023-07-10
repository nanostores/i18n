import type { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import type {
  type ExtractTemplateParams,
  type TranslationFunction,
  count,
  params
} from '../index.js'

const f1 = params('Pages in {category}')
const f2 = params<{ category: number }>(
  count({
    one: 'One page in {category}',
    many: '{count} pages in {category}'
  })
)
const f21 = f2({ category: 12 })
const f22 = f2(12)
const incorrectParamsType = params<{ incorrect_param: number }>(
  'Pages in {category}'
)
const noParams = params('No params')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<
    IsExact<
      typeof f1,
      TranslationFunction<[{ category: string | number }], string>
    >
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
  Assert<IsExact<ReturnType<typeof f2>, TranslationFunction<[number], string>>>,
  Assert<
    IsExact<
      typeof incorrectParamsType,
      TranslationFunction<[{ incorrect_param: number }], any>
    >
  >,
  Assert<IsExact<typeof noParams, TranslationFunction<[], string>>>,
  // Cases for `ExtractTemplateParams`
  Assert<
    IsExact<
      ExtractTemplateParams<'test {param_1} {param_2}'>,
      { param_1: string | number; param_2: string | number }
    >
  >,
  Assert<
    IsExact<
      ExtractTemplateParams<'{param_1} {param_2}'>,
      { param_1: string | number; param_2: string | number }
    >
  >,
  Assert<
    IsExact<ExtractTemplateParams<'{param_1}'>, { param_1: string | number }>
  >,
  Assert<IsExact<ExtractTemplateParams<'test'>, {}>>,
  Assert<
    IsExact<
      ExtractTemplateParams<'{param_1} test'>,
      { param_1: string | number }
    >
  >,
  Assert<
    IsExact<
      ExtractTemplateParams<'{param_1} {param_2} test'>,
      { param_1: string | number; param_2: string | number }
    >
  >
]
