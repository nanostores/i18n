import type { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import { messageFormat, type TranslationFunction } from '../index.js'

let f1 = messageFormat('Hello {$name}!')
let f2 = messageFormat('Click {#link}here{/link}')
let f3 = messageFormat('Warning {#icon/}')
let f4 = messageFormat('{$user} clicked {#link}here{/link} {#star/}')
let f5 = messageFormat('You have {#bold}{$amount}{/bold} notifications')
let f6 = messageFormat('{#bold}Click {#link}here{/link} for details{/bold}')
let f7 = messageFormat('{#a}A{/a} {#b/} {#c}C{/c}')
let f8 = messageFormat('{#bold}one{/bold} and {#bold}two{/bold}')
let f9 = messageFormat(
  'Invalid: {#link}here{/wrong}, Valid: {#bold}text{/bold}'
)
let f10 = messageFormat(
  'Welcome {$user}! {#bold}Check your {#link}{$item_count} items{/link} {#star/} {/bold}'
)
let f11 = messageFormat('{#empty}{/empty}')
let f12 = messageFormat('{#a} Outer {#a} Inner {/a} {/a}')
let f13 = messageFormat(
  '{#a} Outer {$outerVar} {#a} Inner {$innerVar} {/a} {/a}'
)
let f14 = messageFormat('{#amount}You have {$amount} items{/amount}')
let f15 = messageFormat('Hello { $user }! Click {# link }here{/ link }')
let f16 = messageFormat('hello!')

// oxlint-disable-next-line no-unused-vars
type cases = [
  Assert<
    IsExact<typeof f1, TranslationFunction<[{ name: string | number }], string>>
  >,
  Assert<
    IsExact<
      typeof f2,
      TranslationFunction<[{ link: (content: string) => string }], string>
    >
  >,
  Assert<
    IsExact<typeof f3, TranslationFunction<[{ icon: () => string }], string>>
  >,
  Assert<
    IsExact<
      typeof f4,
      TranslationFunction<
        [
          {
            user: string | number
            link: (content: string) => string
            star: () => string
          }
        ],
        string
      >
    >
  >,
  Assert<
    IsExact<
      typeof f5,
      TranslationFunction<
        [{ bold: (content: string) => string; amount: string | number }],
        string
      >
    >
  >,
  Assert<
    IsExact<
      typeof f6,
      TranslationFunction<
        [
          {
            bold: (content: string) => string
            link: (content: string) => string
          }
        ],
        string
      >
    >
  >,
  Assert<
    IsExact<
      typeof f7,
      TranslationFunction<
        [
          {
            a: (content: string) => string
            b: () => string
            c: (content: string) => string
          }
        ],
        string
      >
    >
  >,
  Assert<
    IsExact<
      typeof f8,
      TranslationFunction<[{ bold: (content: string) => string }], string>
    >
  >,
  Assert<
    IsExact<
      typeof f9,
      TranslationFunction<[{ bold: (content: string) => string }], string>
    >
  >,
  Assert<
    IsExact<
      typeof f10,
      TranslationFunction<
        [
          {
            user: string | number
            item_count: number | string
            bold: (content: string) => string
            link: (content: string) => string
            star: () => string
          }
        ],
        string
      >
    >
  >,
  Assert<
    IsExact<
      typeof f11,
      TranslationFunction<[{ empty: (content: string) => string }], string>
    >
  >,
  Assert<
    IsExact<
      typeof f12,
      TranslationFunction<[{ a: (content: string) => string }], string>
    >
  >,
  Assert<
    IsExact<
      typeof f13,
      TranslationFunction<
        [
          {
            a: (content: string) => string
            outerVar: string | number
            innerVar: string | number
          }
        ],
        string
      >
    >
  >,
  Assert<IsExact<typeof f14, never>>,
  Assert<IsExact<typeof f15, TranslationFunction<[], string>>>,
  Assert<IsExact<typeof f16, TranslationFunction<[], string>>>
]
