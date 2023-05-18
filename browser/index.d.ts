import type { ReadableAtom } from 'nanostores'

type AutodetectOpts<Locales extends readonly string[]> = Extract<
  Locales[number],
  'en'
> extends never
  ? {
      available: Locales
      fallback: Locales[number]
    }
  : {
      available: Locales
    }

/**
 * A store which can be used in {@link localeAtom} to autodetects user’s locale
 * from `Accept-Languages` header of the browser.
 *
 * ```js
 * import { browser, localeFrom } from '@nanostores/i18n'
 *
 * export const locale = localeFrom(
 *   localeSettings,
 *   browser({ available: ['en', 'ru'] as const })
 * )
 * ```
 *
 * @param opts Languages supported by application and optional fallback.
 * @returns Store with browser language or fallback.
 */
export function browser<Locales extends readonly string[]>(
  opts: AutodetectOpts<Locales>
): ReadableAtom<Locales[number]>
