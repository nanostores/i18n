import { ReadableAtom } from 'nanostores'

type A = Extract<'fr' | 'ru', 'en'>

type AutodetectOpts<Locales extends readonly string[]> = Extract<
  Locales[number],
  'en'
> extends never
  ? {
      between: Locales
      fallback: Locales[number]
    }
  : {
      between: Locales
    }

/**
 * A store which can be used in {@link localeAtom} to autodetects user’s locale
 * from `Accept-Languages` header of the browser.
 *
 * ```js
 * import { autodetect, localeFrom } from '@nanostores/i18n'
 *
 * export const locale = localeFrom(
 *   localeSettings,
 *   autodetect({ between: ['en', 'ru'] as const })
 * )
 * ```
 *
 * @param opts Languages supported by application and optional fallback.
 * @returns Store with browser language or fallback.
 */
export function autodetect<Locales extends readonly string[]>(
  opts: AutodetectOpts<Locales>
): ReadableAtom<Locales[number]>
