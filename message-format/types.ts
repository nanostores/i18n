import type { AssertTrue as Assert, IsExact } from 'conditional-type-checks'

import type { ExtractMessageParams } from './index.js'

// oxlint-disable-next-line no-unused-vars
type cases = [
  Assert<
    IsExact<ExtractMessageParams<'Hello {$name}!'>, { name: string | number }>
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'Click {#link}here{/link}'>,
      { link: (content: string) => string }
    >
  >,
  Assert<
    IsExact<ExtractMessageParams<'Warning {#icon/}'>, { icon: () => string }>
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{$user} clicked {#link}here{/link} {#star/}'>,
      {
        user: string | number
        link: (content: string) => string
        star: () => string
      }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'You have {#bold}{$amount}{/bold} notifications'>,
      { bold: (content: string) => string; amount: string | number }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#bold}Click {#link}here{/link} for details{/bold}'>,
      { bold: (content: string) => string; link: (content: string) => string }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#a}A{/a} {#b/} {#c}C{/c}'>,
      {
        a: (content: string) => string
        b: () => string
        c: (content: string) => string
      }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#bold}one{/bold} and {#bold}two{/bold}'>,
      { bold: (content: string) => string }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'Invalid: {#link}here{/wrong}, Valid: {#bold}text{/bold}'>,
      { bold: (content: string) => string }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'Welcome {$user}! {#bold}Check your {#link}{$item_count} items{/link} {#star/} {/bold}'>,
      {
        user: string | number
        item_count: number | string
        bold: (content: string) => string
        link: (content: string) => string
        star: () => string
      }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#empty}{/empty}'>,
      { empty: (content: string) => string }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#a} Outer {#a} Inner {/a} {/a}'>,
      { a: (content: string) => string }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#a} Outer {$outerVar} {#a} Inner {$innerVar} {/a} {/a}'>,
      {
        a: (content: string) => string
        outerVar: string | number
        innerVar: string | number
      }
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'{#amount}You have {$amount} items{/amount}'>,
      never
    >
  >,
  Assert<
    IsExact<
      ExtractMessageParams<'Hello { $user }! Click {# link }here{/ link }'>,
      object
    >
  >,
  Assert<IsExact<ExtractMessageParams<'hello!'>, object>>
]
