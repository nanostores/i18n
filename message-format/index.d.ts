import type { TranslationFunction } from '../create-i18n/index.js'

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

type MessagePart = MessageMarkupPart | MessageStringPart | MessageTextPart

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

interface MessageFormat {
  /**
   * Add parameters to translation strings using MessageFormat 2 (MF2) standard.
   * @link https://messageformat.unicode.org/
   *
   * @example
   * ```ts
   * import { messageFormat } from '@nanostores/i18n'
   * import { i18n } from '../stores/i18n'
   *
   * export const messages = i18n('component', {
   *   click: messageFormat('Click {#link}here{/link}'),
   *   greeting: messageFormat('Welcome {$user}! {#star/}')
   * })
   * ```
   *
   * @example
   * ```js
   * const t = useStore(messages)
   * t.click({ link: (content) => `<a href='some_url'>${content}</a>` })
   * t.greeting({ user: 'Jane', star: () => '⭐' })
   * ```
   *
   * @param input MessageFormat template string.
   * @returns Transform for translation.
   */
  <Input extends string>(
    input: Input
  ): ExtractMessageParams<Input> extends never
    ? never
    : TranslationFunction<
        keyof ExtractMessageParams<Input> extends never
          ? []
          : [ExtractMessageParams<Input>],
        string
      >
}

export const messageFormat: MessageFormat
