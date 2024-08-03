import type { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import {
  count,
  type ExtractTemplateParams,
  params,
  type TranslationFunction
} from '../index.js'

let f1 = params('Pages in {category}')
let f2 = params<{ category: number }>(
  count({
    many: '{count} pages in {category}',
    one: 'One page in {category}'
  })
)
let f21 = f2({ category: 12 })
let f22 = f2(12)
let incorrectParamsType = params<{ incorrect_param: number }>(
  'Pages in {category}'
)
let noParams = params('No params')

console.log(f1, f21, f22, incorrectParamsType, noParams)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Assert<
    IsExact<
      typeof f1,
      TranslationFunction<[{ category: number | string }], string>
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
      { param_1: number | string; param_2: number | string }
    >
  >,
  Assert<
    IsExact<
      ExtractTemplateParams<'{param_1} {param_2}'>,
      { param_1: number | string; param_2: number | string }
    >
  >,
  Assert<
    IsExact<ExtractTemplateParams<'{param_1}'>, { param_1: number | string }>
  >,
  Assert<IsExact<ExtractTemplateParams<'test'>, {}>>,
  Assert<
    IsExact<
      ExtractTemplateParams<'{param_1} test'>,
      { param_1: number | string }
    >
  >,
  Assert<
    IsExact<
      ExtractTemplateParams<'{param_1} {param_2} test'>,
      { param_1: number | string; param_2: number | string }
    >
  >
]
