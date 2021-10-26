import { ReadableAtom, Atom } from 'nanostores'

/**
 * Choose the first available locale from difference sources. Like use locale
 * from `localStorage` setting and browser’s locale if previous one is missing.
 *
 * ```ts
 * import { localeFrom, autodetect } from '@nanostores/i18n'
 * import { persistentAtom } from '@nanostores/persistent'
 *
 * export const localeSettings = persistentAtom<'ru' | 'en' | undefined>()
 *
 * export const locale = localeFrom(
 *   localeSettings,
 *   autodetect({ between: ['ru', 'en'] as const })
 * )
 * ```
 *
 * @param stores Stores of different source of locale
 * @returns Store with the first non-`undefined` value from input stores
 */
export function localeFrom<Locale extends string>(
  ...stores: [...Atom<Locale | undefined>[], Atom<Locale>]
): ReadableAtom<Locale>
