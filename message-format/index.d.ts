type MessageMarkupPart = {
  type: 'markup'
  kind: 'open' | 'close' | 'standalone'
  name: string
}

type MessageTextPart = {
  type: 'text'
  value: string
}

type MessageStringPart = {
  type: 'string'
  name: string
  value: string
}

type ExtractTagName<
  S extends string,
  Name extends string = ''
> = S extends `${infer Character}${infer Rest}`
  ? Character extends '}' | '/'
    ? [Name, S]
    : ExtractTagName<Rest, `${Name}${Character}`>
  : [Name, '']

type HasConflict<T> = keyof T extends never
  ? false
  : true extends {
        [K in keyof T]: T[K] extends string | number
          ? T[K] extends (content: string) => string
            ? true
            : false
          : false
      }[keyof T]
    ? true
    : false

type Prettify<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T[K]
} & {}

type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
    ? Trim<T>
    : S

type InternalExtract<S extends string> =
  S extends `{$${infer Var}}${infer Post}`
    ? Var extends `${string} ${string}`
      ? InternalExtract<Post>
      : { [K in Var]: string | number } & InternalExtract<Post>
    : S extends `{#${infer Post}`
      ? ExtractTagName<Post> extends [
          infer TagName extends string,
          infer PostTagName
        ]
        ? TagName extends `${string} ${string}` | ''
          ? InternalExtract<Post>
          : PostTagName extends `/${string}}${infer PostStandalone}`
            ? { [K in Trim<TagName>]: () => string } & InternalExtract<Post>
            : PostTagName extends `}${infer ContentAndPost}`
              ? ContentAndPost extends `${infer Content}{/${TagName}}${infer PostTag}`
                ? {
                    [K in Trim<TagName>]: (content: string) => string
                  } & InternalExtract<Content> &
                    InternalExtract<PostTag>
                : InternalExtract<ContentAndPost>
              : InternalExtract<PostStandalone>
        : InternalExtract<Post>
      : S extends `${string}${infer Tail}`
        ? InternalExtract<Tail>
        : object

type ExtractMessageParams<S extends string> =
  HasConflict<InternalExtract<S>> extends true
    ? never
    : Prettify<InternalExtract<S>>

// Future test types:

type TestResult = ExtractMessageParams<TestStr>

type T1 = ExtractMessageParams<'Hello {$name}!'>

type T2 = ExtractMessageParams<'Click {#link}here{/link}'>

type T3 = ExtractMessageParams<'Warning {#icon/}'>

type T4 = ExtractMessageParams<'{$user} clicked {#link}here{/link} {#star/}'>

type T5 = ExtractMessageParams<'You have {#bold}{$amount}{/bold} notifications'>

type T6 =
  ExtractMessageParams<'{#bold}Click {#link}here{/link} for details{/bold}'>

type T7 = ExtractMessageParams<'{#a}A{/a} {#b/} {#c}C{/c}'>

type T8 = ExtractMessageParams<'{#bold}one{/bold} and {#bold}two{/bold}'>

type T9 =
  ExtractMessageParams<'Invalid: {#link}here{/wrong}, Valid: {#bold}text{/bold}'>

type T10 =
  ExtractMessageParams<'Welcome {$user}! {#bold}Check your {#link}{$item_count} items{/link} {#star/} {/bold}'>

type T11 = ExtractMessageParams<'{#empty}{/empty}'>

type T12 = ExtractMessageParams<'{#a} Outer {#a} Inner {/a} {/a}'>

type T13 =
  ExtractMessageParams<'{#a} Outer {$outerVar} {#a} Inner {$innerVar} {/a} {/a}'>

type T14 = ExtractMessageParams<'{#amount}You have {$amount} items{/amount}'>

type T15 = ExtractMessageParams<'Hello { $user }! Click {# link }here{/ link }'>

type T16 = ExtractMessageParams<'hello!'>
